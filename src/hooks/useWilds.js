import { useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';

import getSigner from '../constants/Signer';
import abis from '../constants/contracts/abis';
import { Addresses } from '../constants/contracts/Addresses';
import { useWeb3 } from '../context/Web3Context';
import { useQuery } from 'react-query';

const getContracts = async (provider, setContractBattle) => {
	if (provider) {
		await setContractBattle(new Contract(Addresses.Wilds, abis.Wilds, getSigner(provider)));
		console.log('GOT WILDS CONTRACTS');
	} else {
	}
};

const calculateDamage = async (provider, contract, id) => {
	if (provider && contract) {
		try {
			let damage = await contract.calculateDamage(id);
			return { damage: damage.toString() };
		} catch (error) {
			throw new Error('error');
		}
	} else {
		// try {
		// 	const { change } = await getChangeAPI(id);
		// 	let data = { ...change };
		// 	if (data) {
		// 		return data;
		// 	} else {
		// 		throw new Error('error');
		// 	}
		// } catch (error) {
		// 	console.log(error);
		// 	throw new Error('error');
		// }
	}
};

const calculateStamina = async (provider, contract, id) => {
	if (provider && contract) {
		try {
			let stamina = await contract.calculateStamina(id);
			return { stamina: stamina.toString() };
		} catch (error) {
			throw new Error('error');
		}
	} else {
		// try {
		// 	const { change } = await getChangeAPI(id);
		// 	let data = { ...change };
		// 	if (data) {
		// 		return data;
		// 	} else {
		// 		throw new Error('error');
		// 	}
		// } catch (error) {
		// 	console.log(error);
		// 	throw new Error('error');
		// }
	}
};

const getLCP = async (provider, contract, landId, tokenId) => {
	if (provider && contract) {
		try {
			let lcp = await contract.getLCP(landId, tokenId);
			return { lcp: lcp.toString() };
		} catch (error) {
			throw new Error('error');
		}
	} else {
		// try {
		// 	const { change } = await getChangeAPI(id);
		// 	let data = { ...change };
		// 	if (data) {
		// 		return data;
		// 	} else {
		// 		throw new Error('error');
		// 	}
		// } catch (error) {
		// 	console.log(error);
		// 	throw new Error('error');
		// }
	}
};

export const useWildsContract = () => {
	const provider = useWeb3();

	const [contractWilds, setContractWilds] = useState(undefined);

	useEffect(() => {
		getContracts(provider, setContractWilds);
	}, [provider]);

	return { contractWilds };
};

const calcBps = (_x, _y) => {
	return _x < _y ? ((_y - _x) * 10000) / _x : ((_x - _y) * 10000) / _y;
};

export const useWildsNFTStats = (contract, landId, tokenId) => {
	const provider = useWeb3();
	const { isLoading, data } = useQuery(`calculateDamage_${tokenId}`, () => calculateDamage(provider, contract, tokenId), { refetchInterval: 250000 });
	const { isLoading: stamIsLoading, data: stamData } = useQuery(`calculateStamina_${tokenId}`, () => calculateStamina(provider, contract, tokenId), { refetchInterval: 250000 });
	const { isLoading: lcpIsLoading, data: lcpData } = useQuery(`lcp_${landId}_${tokenId}`, () => getLCP(provider, contract, landId, tokenId), { refetchInterval: 250000 });

	const [damage, setDamage] = useState(undefined);
	const [stamina, setStamina] = useState(undefined);
	const [lcp, setLcp] = useState(undefined);

	useEffect(() => {
		if (!isLoading && data) {
			setDamage(data.damage);
		}
	}, [data, isLoading]);

	useEffect(() => {
		if (!stamIsLoading && stamData) {
			setStamina(stamData.stamina);
		}
	}, [stamData, stamIsLoading]);

	useEffect(() => {
		if (!lcpIsLoading && lcpData) {
			setLcp(lcpData.lcp);
		}
	}, [lcpData, lcpIsLoading]);

	return { damage, stamina, lcp };
};

// CONSTANTS
let startPrice = 10000000;

let atkDivMod = 1400;
let defDivMod = 1000;
let spdDivMod = 200;

export const winCase = (positionSize, percentChange = 0.1, stats) => {
	// SCORE
	const change = positionSize * calcBps(startPrice, startPrice * (1 + percentChange));

	const atkMod = (stats[0] * change) / atkDivMod;
	const score = (change + atkMod) / 1000;

	// ELF BONUS
	const rewards = (stats[2] * score) / spdDivMod;
	return {
		score: parseInt(score),
		rewards: parseInt(rewards),
	};
};

export const loseCase = (positionSize, percentChange = 0.1, stats) => {
	// SCORE
	const change = positionSize * calcBps(startPrice, startPrice * (1 - percentChange));

	const defMod = (stats[1] * change) / defDivMod;
	const score = (change - defMod) / 1000;

	// ELF BONUS
	const rewards = 0;
	return {
		score: parseInt(score),
		rewards: parseInt(rewards),
	};
};
