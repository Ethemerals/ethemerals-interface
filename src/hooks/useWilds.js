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

// HELPERS

export const wildsParseSlots = (wildStakes) => {
	let defenders = [];
	let looters = [];
	let birthers = [];
	let attackers = [];
	wildStakes.forEach((stake) => {
		if (stake.stakeType === '1') {
			defenders.push(stake);
		}
		if (stake.stakeType === '2') {
			looters.push(stake);
		}
		if (stake.stakeType === '3') {
			birthers.push(stake);
		}
		if (stake.stakeType === '4') {
			attackers.push(stake);
		}
	});

	return { defenders, looters, birthers, attackers };
};

export const wildsParseInitValues = (land) => {
	const { defenders, looters, birthers, attackers } = wildsParseSlots(land.wildStakes);

	let _landStats = {
		id: land.id,
		raidStatus: land.raidStatus,
		remaining: land.remainingELFx ? land.remainingELFx : 0, // TODO hardcode graph
		rate: land.emissionRate ? land.emissionRate : 0, // TODO hardcode graph
		lastEvent: land.lastEvent ? land.lastEvent : null,
		lastRaid: land.lastRaid ? land.lastRaid : null,
		baseDefence: land.baseDefence ? land.baseDefence : null,
		defenders,
		looters,
		birthers,
		attackers,
	};

	return _landStats;
};

// CONSTANTS
