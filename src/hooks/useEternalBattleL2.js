import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useGQLQueryL1 } from './useGQLQuery';

import abis from '../constants/contracts/abis';
import { Addresses } from '../constants/contracts/Addresses';
import { useWeb3 } from './useWeb3';
import { getContract } from '../utils/contracts/getContract';
import { useChain } from 'react-moralis';
import { GET_EBSTAKES_BY_PRICEFEEDID, GET_EBSTAKES_RECORD_BY_PRICEFEEDID } from '../queries/SubgraphEternalBattle';

const getChangeAPI = async (id) => {
	const url = `${process.env.REACT_APP_API_MARKETS}ebgetchange?id=${id}&network=${process.env.REACT_APP_NETWORK}`;
	const { data } = await axios.get(url);
	if (data.status === 'success') {
		return data.data;
	} else {
		return null;
	}
};

const getStakeAPI = async (id) => {
	const url = `${process.env.REACT_APP_API_MARKETS}ebgetstake?id=${id}&network=${process.env.REACT_APP_NETWORK}`;
	const { data } = await axios.get(url);
	if (data.status === 'success') {
		return data.data;
	} else {
		return null;
	}
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

const getStake = async (provider, contract, id) => {
	if (provider && contract) {
		try {
			let [owner, priceFeedId, positionSize, startingPrice, long] = await contract.getStake(id);
			return { owner, priceFeedId, positionSize, startingPrice: startingPrice.toString(), long };
		} catch (error) {
			throw new Error('error');
		}
	} else {
		try {
			const { stake } = await getStakeAPI(id);
			let data = { ...stake };

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

export const useEternalBattleL1GetChange = (contract, id) => {
	const { provider } = useWeb3();
	const { isLoading, data } = useQuery([`getChange_${id}`, id], () => getChange(provider, contract, id), { enabled: !!id, refetchInterval: 50000 });

	const [scoreChange, setScoreChange] = useState(undefined);

	useEffect(() => {
		if (!isLoading) {
			setScoreChange(data);
		}
	}, [data, isLoading]);

	return { scoreChange };
};

export const useEternalBattleL1GetStake = (contract, id) => {
	const { provider } = useWeb3();
	const { isLoading, data } = useQuery([`getStake_${id}`, id], () => getStake(provider, contract, id), { refetchInterval: 50000 });

	const [stake, setStake] = useState(undefined);

	useEffect(() => {
		if (!isLoading) {
			setStake(data);
		}
	}, [data, isLoading]);

	return { stake };
};

export const useEternalBattleL1Contract = () => {
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

let atkDivMod = 1400;
let defDivMod = 1000;
let spdDivMod = 200;

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
