import { useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';

import getSigner from '../constants/Signer';
import abis from '../constants/contracts/abis';
import { Addresses } from '../constants/contracts/Addresses';

import { useGQLQueryL1 } from './useGQLQuery';
import { GET_ONSEN_ACCOUNT } from '../queries/SubgraphWilds';
import { useWeb3 } from './useWeb3';

const getContracts = async (provider, setContractOnsen) => {
	if (provider) {
		await setContractOnsen(new Contract(Addresses.Onsen, abis.Onsen, getSigner(provider)));
		console.log('GOT ONSEN CONTRACTS');
	} else {
	}
};

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

	const [contractOnsen, setOnsenContract] = useState(undefined);

	useEffect(() => {
		getContracts(provider, setOnsenContract);
	}, [provider]);

	return { contractOnsen };
};

export const useOnsenAccount = () => {
	const { data } = useGQLQueryL1('account_onsen', GET_ONSEN_ACCOUNT, { id: Addresses.Onsen.toLowerCase() }, { refetchOnMount: true });
	const [accountOnsen, setAccountOnsen] = useState(null);

	useEffect(() => {
		if (data && data.account !== null) {
			setAccountOnsen(data.account);
		}
	}, [data]);

	return {
		accountOnsen,
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
