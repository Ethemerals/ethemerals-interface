import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useGQLQueryL1, useGQLQueryL2 } from './useGQLQuery';

import abis from '../constants/contracts/abis';
import { Addresses } from '../constants/contracts/Addresses';
import { useWeb3 } from './useWeb3';
import { getContract } from '../utils/contracts/getContract';
import { useChain } from 'react-moralis';
import { GET_EBSTAKES_BY_PRICEFEEDID, GET_EBSTAKES_RECORD_BY_PRICEFEEDID } from '../queries/SubgraphEternalBattle';
import { Links } from '../constants/Links';
import { GraphQLClient } from 'graphql-request';
import { GET_NFT_L2 } from '../queries/SubgraphPoly';

const getChangeAPI = async (id) => {
	// const url = `${process.env.REACT_APP_API_MARKETS}ebgetchange?id=${id}&network=${process.env.REACT_APP_NETWORK}`;
	// const { data } = await axios.get(url);
	// if (data.status === 'success') {
	// 	return data.data;
	// } else {
	// 	return null;
	// }
};

const getChange = async (provider, contract, id) => {
	if (provider && contract) {
		try {
			let [score, rewards, win] = await contract.getChange(id);
			return { score: score.toString(), rewards: rewards.toString(), win };
		} catch (error) {
			throw new Error('error');
		}
	} else {
		try {
			const { change } = await getChangeAPI(id);
			let data = { ...change };
			if (data) {
				return data;
			} else {
				throw new Error('error');
			}
		} catch (error) {
			console.log(error);
			throw new Error('error');
		}
	}
};

const getActivestakes = async (id) => {
	try {
		const endpoint = Links.SUBGRAPH_ENDPOINT_L2;
		const graphQLClient = new GraphQLClient(endpoint);
		const fetchData = await graphQLClient.request(GET_EBSTAKES_BY_PRICEFEEDID, { priceFeedId: id });
		return fetchData;
	} catch (error) {
		throw new Error('get account error');
	}
};

export const useActiveStakes = (id) => {
	const { isLoading, data } = useQuery([`getActiveStakes_${id}`], () => getActivestakes(id), { enabled: !!id, refetchInterval: 50000 });

	const [activeLongs, setActiveLongs] = useState(undefined);
	const [activeShorts, setActiveShorts] = useState(undefined);

	useEffect(() => {
		if (data && !isLoading) {
			let longs = [];
			let shorts = [];
			data.ebstakeActives.forEach((stake) => {
				if (stake.long) {
					longs.push(stake);
				} else {
					shorts.push(stake);
				}
			});
			if (longs.length > 0) {
				setActiveLongs(longs);
			}
			if (shorts.length > 0) {
				setActiveShorts(shorts);
			}
		}
		return () => {
			setActiveLongs(undefined);
			setActiveShorts(undefined);
		};
	}, [data, isLoading]);

	return { activeLongs, activeShorts };
};

export const useEternalBattleL2GetChange = (id) => {
	const { provider } = useWeb3();
	const { contractBattle } = useEternalBattleL2Contract();
	const { isLoading, data } = useQuery([`getChange_${id}`, id], () => getChange(provider, contractBattle, id), { enabled: !!id && !!contractBattle, refetchInterval: 50000 });

	const [scoreChange, setScoreChange] = useState(undefined);

	useEffect(() => {
		if (!isLoading) {
			setScoreChange(data);
		}
	}, [data, isLoading]);

	return { scoreChange, isLoading };
};

export const useEternalBattleChampions = (priceFeedId) => {
	const { data } = useGQLQueryL2(`getEternalBattleChampions_${priceFeedId}`, GET_NFT_L2, { id: 1000404 }, { refetchOnMount: true });

	const [meral, setMeral] = useState(null);

	useEffect(() => {
		if (data && data.meral !== null) {
			setMeral(data.meral);
		}
	}, [data]);

	return {
		meral,
	};
};

export const useEternalBattleL2Contract = () => {
	const { provider } = useWeb3();
	const { chainId } = useChain();

	const [contractBattle, setContractBattle] = useState(undefined);

	useEffect(() => {
		getContract(provider, Addresses.EternalBattleL2.toLowerCase(), abis.EternalBattleL2, setContractBattle, 'ETERNALBATTLEL2');
	}, [provider, chainId]);

	return { contractBattle };
};

export const useEternalBattleStakesActive = (priceFeedId) => {
	const { data } = useGQLQueryL1(`eternalBattleStakesActive_${priceFeedId}`, GET_EBSTAKES_BY_PRICEFEEDID, { priceFeedId }, { refetchOnMount: true });
	const [EBStakesActive, setEBStakesaAtive] = useState(null);

	useEffect(() => {
		if (data && data.account !== null) {
			setEBStakesaAtive(data.ebstakeActives);
		}
	}, [data]);

	return {
		EBStakesActive,
	};
};

export const useEternalBattleStakesRecord = (priceFeedId) => {
	const { data } = useGQLQueryL1(`eternalBattleStakesRecord_${priceFeedId}`, GET_EBSTAKES_RECORD_BY_PRICEFEEDID, { priceFeedId }, { refetchOnMount: true });
	const [EBStakesRecord, setEBStakesaRecord] = useState(null);

	useEffect(() => {
		if (data && data.account !== null) {
			setEBStakesaRecord(data.ebstakesRecord);
		}
	}, [data]);

	return {
		EBStakesRecord,
	};
};

const calcBps = (_x, _y) => {
	return _x < _y ? ((_y - _x) * 10000) / _x : ((_x - _y) * 10000) / _y;
};

// CONSTANTS
let startPrice = 10000000;

let atkDivMod = 1800;
let defDivMod = 1400;
let spdDivMod = 400;

export const winCase = (positionSize, percentChange = 0.1, stats) => {
	// SCORE
	const change = positionSize * calcBps(startPrice, startPrice * (1 + percentChange));

	const atkMod = (stats.atk * change) / atkDivMod;
	const score = (change + atkMod) / 1000;

	// ELF BONUS
	const rewards = (stats.spd * score) / spdDivMod;
	return {
		score: parseInt(score),
		rewards: parseInt(rewards),
	};
};

export const loseCase = (positionSize, percentChange = 0.1, stats) => {
	// SCORE
	const change = positionSize * calcBps(startPrice, startPrice * (1 - percentChange));

	const defMod = (stats.def * change) / defDivMod;
	const score = (change - defMod) / 1000;

	// ELF BONUS
	const rewards = 0;
	return {
		score: parseInt(score),
		rewards: parseInt(rewards),
	};
};
