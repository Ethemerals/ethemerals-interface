import { useEffect, useState } from 'react';

import { Contract } from '@ethersproject/contracts';

import getSigner from '../constants/Signer';
import abis from '../constants/contracts/abis';
import Addresses from '../constants/contracts/Addresses';
import { useWeb3 } from './Web3Context';

const getContracts = async (provider, setContractToken) => {
	if (provider) {
		await setContractToken(new Contract(Addresses.EthemeralLifeForce, abis.EthemeralLifeForce, getSigner(provider)));
		console.log('GOT TOKEN CONTRACT');
	} else {
	}
};

export const useTokenContract = () => {
	const provider = useWeb3();

	const [contractToken, setContractToken] = useState(undefined);

	useEffect(() => {
		getContracts(provider, setContractToken);
	}, [provider]);

	return { contractToken };
};
