import { useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';

import getSigner from '../constants/Signer';
import abis from '../constants/contracts/abis';
import { Addresses } from '../constants/contracts/Addresses';

import { useGQLQueryL1 } from './useGQLQuery';
import { GET_ONSEN_ACCOUNT } from '../queries/SubgraphWilds';
import { useWeb3 } from './useWeb3';
import { useChain } from 'react-moralis';
import { getContract } from '../utils/contracts/getContract';
import { getAccount } from '../utils/contracts/getAccount';
import { useQuery } from 'react-query';

// const calculateChange = async (provider, contract, id) => {
// 	if (provider && contract) {
// 		try {
// 			let change = await contract.calculateChange(id);
// 			console.log(change);
// 			// return { change: change.toString() };
// 		} catch (error) {
// 			throw new Error('error');
// 		}
// 	} else {
// 		// try {
// 		// 	const { change } = await getChangeAPI(id);
// 		// 	let data = { ...change };
// 		// 	if (data) {
// 		// 		return data;
// 		// 	} else {
// 		// 		throw new Error('error');
// 		// 	}
// 		// } catch (error) {
// 		// 	console.log(error);
// 		// 	throw new Error('error');
// 		// }
// 	}
// };

export const useOnsenContract = () => {
	const { provider } = useWeb3();
	const { chainId } = useChain();

	const [contractOnsen, setOnsenContract] = useState(undefined);

	useEffect(() => {
		getContract(provider, Addresses.Onsen.toLowerCase(), abis.Onsen, setOnsenContract, 'ONSEN');
	}, [provider, chainId]);

	return { contractOnsen };
};

export const useOnsenAccount = () => {
	const [onsenAccount, setAccount] = useState(undefined);
	const [onsenNFTs, setNFTs] = useState([]);
	let address = Addresses.Onsen;
	const { data, isLoading } = useQuery(`account_${address}`, () => getAccount(address), { enabled: !!address, refetchOnMount: true, refetchInterval: 20000 }); // TODO

	useEffect(() => {
		if (data && !isLoading) {
			setAccount(data);
			setNFTs(data.pMerals);
			console.log(data);
		}
	}, [data, isLoading]);

	return {
		onsenAccount,
		onsenNFTs,
	};
};

export const getOnsenChange = (now, start, meral) => {
	let rewards = getXp(now, start);
	let score = getScore(now, start, meral.spd);
	return { rewards, score };
};

const getXp = (now, start) => {
	return parseInt((now - start) / 7200);
};

const getScore = (now, start, stat) => {
	let scaled = safeScale(stat, 2000, 14, 22);
	return parseInt(((now - start) * parseInt(scaled)) / 1000);
};

function safeScale(number, inMax, outMin, outMax) {
	let scaled = (number * (outMax - outMin)) / inMax + outMin;
	return scaled > outMax ? outMax : scaled;
}
