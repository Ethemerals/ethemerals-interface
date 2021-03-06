import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import abis from '../constants/contracts/abis';
import { Addresses } from '../constants/contracts/Addresses';
import { useWeb3, useGetLayerDetails } from './useWeb3';
import { getContract } from '../utils/contracts/getContract';
import { useChain } from 'react-moralis';
import { GET_EBSTAKES_BY_PRICEFEEDID, GET_EBSTAKES_COUNT, GET_EBSTAKES_RECORD_BY_PRICEFEEDID, GET_MARKET_CHAMPION } from '../queries/SubgraphEternalBattle';
import { Links } from '../constants/Links';
import { GraphQLClient } from 'graphql-request';
import Moralis from 'moralis';
import { safeScale } from '../components/wilds/utils';

const getChangeAPI = async (meralId) => {
	try {
		const result = await Moralis.Cloud.run('getChange', { meralId });
		return result;
	} catch (error) {
		console.log(error);
		throw new Error('get change error');
	}
};

const getChange = async (contract, id, provider, isLayer2) => {
	if (contract && provider && isLayer2 && id) {
		try {
			let [score, rewards, win] = await contract.getChange(id);
			return { score: score.toString(), rewards: rewards.toString(), win };
		} catch (error) {
			return getChangeAPI(id);
		}
	} else {
		return getChangeAPI(id);
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

const getMarketChampions = async (id, startTime) => {
	try {
		const endpoint = Links.SUBGRAPH_ENDPOINT_L2;
		const graphQLClient = new GraphQLClient(endpoint);
		const fetchData = await graphQLClient.request(GET_MARKET_CHAMPION, { priceFeedId: parseInt(id), startTime: parseInt(startTime) });
		return fetchData;
	} catch (error) {
		throw new Error('get market champions error');
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

	const getFromApi = !provider && !isLayer2 && !contractBattle;

	const { isLoading, data } = useQuery([`getChange_${id}`], () => getChange(contractBattle, id, provider, isLayer2), {
		enabled: !!id && !!contractBattle,
		refetchInterval: 50000,
	});

	const { isLoading: isLoadingApi, data: dataApi } = useQuery([`getChange_${id}`], () => getChangeAPI(id), {
		enabled: !!getFromApi,
		refetchInterval: 50000,
	});

	const [scoreChange, setScoreChange] = useState(undefined);

	useEffect(() => {
		if (!isLoading && data) {
			setScoreChange(data);
		}
	}, [data, isLoading]);

	useEffect(() => {
		if (!isLoadingApi && dataApi) {
			setScoreChange(dataApi);
		}
	}, [dataApi, isLoadingApi]);

	return { scoreChange, isLoading };
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

export const useGetMarketChampion = (priceFeedId) => {
	const seasonStart = process.env.REACT_APP_BATTLE_SEASON_START;
	const [merals, setMerals] = useState([]);
	const [champion, setChampion] = useState(undefined);
	const { isLoading, data } = useQuery([`getMarketChampion_${priceFeedId}_${seasonStart}`], () => getMarketChampions(priceFeedId, seasonStart), { enabled: !!priceFeedId, refetchInterval: 100000 });

	useEffect(() => {
		if (!isLoading && data) {
			let _merals = [];
			let _meralsAdded = [];
			let _meralIds = [];

			data.ebstakeRecords.forEach((record) => {
				let _meral = record.meral;
				_meral.owner = record.owner.id;
				_meral.hpGain = parseInt(record.hp);
				_meral.elfGain = parseInt(record.elf);
				_merals.push(_meral);
			});

			for (let i = 0; i < _merals.length; i++) {
				let m = _merals[i];

				for (let j = i + 1; j < _merals.slice(i, _merals.length - 1).length; j++) {
					if (m.meralId === _merals[j].meralId) {
						m.hpGain += _merals[j].hpGain;
						m.elfGain += _merals[j].elfGain;
					}
				}

				if (!_meralIds.find((element) => element === m.meralId)) {
					_meralsAdded.push(m);
				}
				_meralIds.push(m.meralId);
			}

			setMerals(_meralsAdded);
			if (_meralsAdded.length > 0) {
				setChampion(_meralsAdded[0]);
			}
		}
	}, [isLoading, data]);

	// TODO get ACTIVE

	return { champion, merals };
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
