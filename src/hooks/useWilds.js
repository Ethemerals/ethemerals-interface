import { useEffect, useState } from 'react';
import Moralis from 'moralis';
import abis from '../constants/contracts/abis';
import { Addresses } from '../constants/contracts/Addresses';
import { useWeb3 } from './useWeb3';
import { useQuery } from 'react-query';
import { getContract } from '../utils/contracts/getContract';
import { useChain } from 'react-moralis';
import { getAccount } from '../utils/contracts/getAccount';

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
	const { provider } = useWeb3();
	const { chainId } = useChain();

	const [contractWilds, setContract] = useState(undefined);

	useEffect(() => {
		getContract(provider, Addresses.Wilds.toLowerCase(), abis.Wilds, setContract, 'WILDS');
	}, [provider, chainId]);

	return { contractWilds };
};

const getWildsLand = async (landId) => {
	try {
		const result = await Moralis.Cloud.run('getWildsLand', { landId });
		return result;
	} catch (error) {
		throw new Error('get wildsLand error');
	}
};

export const useWildsLand = (landId) => {
	const [wildsLand, setWildsLand] = useState(undefined);
	let [defenders, setDefenders] = useState([]);
	let [attackers, setAttackers] = useState([]);
	let [looters, setLooters] = useState([]);
	let [birthers, setBirthers] = useState([]);

	const { data, isLoading } = useQuery(`getWildsLand_${landId}`, () => getWildsLand(landId), { enabled: !!landId, refetchOnMount: true, refetchInterval: 30000 }); // TODO

	useEffect(() => {
		if (data && !isLoading) {
			setWildsLand(data);
			setDefenders(data.defenders);
			setAttackers(data.attackers);
			setLooters(data.looters);
			setBirthers(data.birthers);
		}
	}, [data, isLoading]);

	return {
		wildsLand,
		defenders,
		attackers,
		looters,
		birthers,
		isLoading,
	};
};

export const getWildsLands = async () => {
	try {
		const result = await Moralis.Cloud.run('getWildsLands');
		return result;
	} catch (error) {
		throw new Error('get wildsLands error');
	}
};

export const useWildsLands = () => {
	const [wildsLands, setWildsLands] = useState([]);

	const { data, isLoading } = useQuery(`getWildsLands`, () => getWildsLands(), { refetchOnMount: true, refetchInterval: 60000 }); // TODO

	useEffect(() => {
		if (data && !isLoading) {
			setWildsLands(data);
		}
	}, [data, isLoading]);

	return {
		wildsLands,
	};
};

export const useWildsAccount = () => {
	const [wildsAccount, setAccount] = useState(undefined);
	const [wildsNFTs, setNFTs] = useState([]);
	let address = Addresses.Wilds;
	const { data, isLoading } = useQuery(`account_${address}`, () => getAccount(address), { enabled: !!address, refetchOnMount: true, refetchInterval: 20000 }); // TODO

	useEffect(() => {
		if (data && !isLoading) {
			setAccount(data);
			setNFTs(data.pMerals);
		}
	}, [data, isLoading]);

	return {
		wildsAccount,
		wildsNFTs,
	};
};

export const useWildsNFTStats = (contract, landId, tokenId) => {
	const { provider } = useWeb3();
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

// CONSTANTS

export const StakeAction = {
	DEFEND: { type: 1, name: 'Defend' },
	LOOT: { type: 2, name: 'Loot' },
	BIRTH: { type: 3, name: 'Birth' },
	ATTACK: { type: 4, name: 'Attack' },
};

export const RaidStatus = {
	DEFAULT: 0,
	RAIDABLE: 1,
	RAIDING: 2,
};
