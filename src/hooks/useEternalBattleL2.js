import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useGQLQueryL2 } from './useGQLQuery';

import abis from '../constants/contracts/abis';
import { Addresses } from '../constants/contracts/Addresses';
import { useWeb3, useGetLayerDetails } from './useWeb3';
import { getContract } from '../utils/contracts/getContract';
import { useChain } from 'react-moralis';
import { GET_EBSTAKES_BY_PRICEFEEDID, GET_EBSTAKES_COUNT, GET_EBSTAKES_RECORD_BY_PRICEFEEDID } from '../queries/SubgraphEternalBattle';
import { Links } from '../constants/Links';
import { GraphQLClient } from 'graphql-request';
import { GET_NFT_L2 } from '../queries/SubgraphPoly';
import Moralis from 'moralis';
import { safeScale } from '../components/wilds/utils';

const getChangeAPI = async (meralId) => {
	try {
		console.log('hereAPI');
		const result = await Moralis.Cloud.run('getChange', { meralId });
		return result;
	} catch (error) {
		console.log(error);
		throw new Error('get change error');
	}
};

const getChange = async (provider, contract, id, isLayer2) => {
	if (provider && contract && isLayer2) {
		console.log('here');
		try {
			let [score, rewards, win] = await contract.getChange(id);
			return { score: score.toString(), rewards: rewards.toString(), win };
		} catch (error) {
			console.log(error);
			throw new Error('error');
		}
	} else {
		try {
			const data = await getChangeAPI(id);
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

const getActivestakes = async (id, count = false) => {
	try {
		const endpoint = Links.SUBGRAPH_ENDPOINT_L2;
		const graphQLClient = new GraphQLClient(endpoint);
		const fetchData = await graphQLClient.request(count ? GET_EBSTAKES_COUNT : GET_EBSTAKES_BY_PRICEFEEDID, { priceFeedId: id });
		return fetchData;
	} catch (error) {
		throw new Error('get stakes error');
	}
};

const getHistoryStakes = async (id) => {
	try {
		const endpoint = Links.SUBGRAPH_ENDPOINT_L2;
		const graphQLClient = new GraphQLClient(endpoint);
		const fetchData = await graphQLClient.request(GET_EBSTAKES_RECORD_BY_PRICEFEEDID, { priceFeedId: id });
		return fetchData;
	} catch (error) {
		throw new Error('get stakes error');
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

export const useActiveStakesCount = (id) => {
	const { isLoading, data } = useQuery([`getActiveStakesCount_${id}`], () => getActivestakes(id, true), { enabled: !!id, refetchInterval: 50000 });
	const [longs, setLongs] = useState(null);
	const [shorts, setShorts] = useState(null);

	useEffect(() => {
		if (data && !isLoading) {
			let longs = 0;
			let shorts = 0;
			data.ebstakeActives.forEach((stake) => {
				if (stake.long) {
					longs++;
				} else {
					shorts++;
				}
			});
			setLongs(longs);
			setShorts(shorts);
		}
	}, [data, isLoading]);

	return {
		longs,
		shorts,
	};
};

export const useHistoryStakes = (id) => {
	const { isLoading, data } = useQuery([`getHistoryStakes_${id}`], () => getHistoryStakes(id), { enabled: !!id, refetchInterval: 50000 });

	const [historyLongs, setHistoryLongs] = useState(undefined);
	const [historyShorts, setHistoryShorts] = useState(undefined);

	useEffect(() => {
		if (data && !isLoading) {
			let longs = [];
			let shorts = [];
			data.ebstakeRecords.forEach((stake) => {
				if (stake.long) {
					longs.push(stake);
				} else {
					shorts.push(stake);
				}
			});
			if (longs.length > 0) {
				setHistoryLongs(longs);
			}
			if (shorts.length > 0) {
				setHistoryShorts(shorts);
			}
		}
		return () => {
			setHistoryLongs(undefined);
			setHistoryShorts(undefined);
		};
	}, [data, isLoading]);

	return { historyLongs, historyShorts };
};

export const useEternalBattleL2GetChange = (id) => {
	const { provider } = useWeb3();
	const { isLayer2 } = useGetLayerDetails();
	const { contractBattle } = useEternalBattleL2Contract();

	const { isLoading, data } = useQuery([`getChange_${id}`], () => getChange(provider, contractBattle, id, isLayer2), { enabled: !!id && !!contractBattle, refetchInterval: 50000 });

	const [scoreChange, setScoreChange] = useState(undefined);

	useEffect(() => {
		if (!isLoading && data) {
			setScoreChange(data);
		}
	}, [data, isLoading]);

	return { scoreChange, isLoading };
};

export const useEternalBattleChampions = (priceFeedId) => {
	const { data } = useGQLQueryL2(`getEternalBattleChampions_${priceFeedId}`, GET_NFT_L2, { id: 1000263 }, { refetchOnMount: true });

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

const calcBps = (_x, _y) => {
	return _x < _y ? ((_y - _x) * 10000) / _x : ((_x - _y) * 10000) / _y;
};

const calcBonus = (_stat) => {
	let stat = _stat * 10000;
	return (stat + stat / 2) / 10000;
};

// CONSTANTS
let startPrice = 10000000;

let atkDivMod = 1200;
let defDivMod = 2000;
let spdDivMod = 5000;

export const winCase = (positionSize, percentChange = 0.1, stats, shouldBonus = false) => {
	// SCORE
	let change = positionSize * calcBps(startPrice, startPrice * (1 + percentChange));

	let atk = stats.atk;
	let spd = stats.spd;

	if (shouldBonus) {
		atk = calcBonus(atk);
		spd = calcBonus(spd);
	}

	atk = safeScale(atk, 2000, 100, 2000);
	spd = safeScale(spd, 2000, 100, 2000);

	change = change / 1000;

	let score = (change * atk) / atkDivMod + change;

	// ELF BONUS
	const rewards = (change * spd) / spdDivMod + change;
	return {
		score: parseInt(score),
		rewards: parseInt(rewards),
	};
};

export const loseCase = (positionSize, percentChange = 0.1, stats, shouldBonus = false) => {
	// SCORE
	let change = positionSize * calcBps(startPrice, startPrice * (1 - percentChange));

	let def = stats.def;

	if (shouldBonus) {
		def = calcBonus(def);
	}

	def = safeScale(def, 2000, 100, 2000);

	change = change / 1000;

	let subtract = (change * def) / defDivMod;
	let score = change > subtract ? change - subtract : 0;

	// ELF BONUS
	const rewards = 0;
	return {
		score: parseInt(score),
		rewards: parseInt(rewards),
	};
};
