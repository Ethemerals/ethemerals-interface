import { useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';

import { useWeb3 } from './Web3Context';

import getSigner from '../constants/Signer';
import abis from '../constants/contracts/abis';
import Addresses from '../constants/contracts/Addresses';

const getContracts = async (provider, setContractEquipable) => {
	if (provider) {
		await setContractEquipable(new Contract(Addresses.Equipables, abis.Equipables, getSigner(provider)));
		console.log('GOT EQUIPABLE CONTRACT');
	} else {
	}
};

export const useEquipableContract = () => {
	const provider = useWeb3();

	const [contractEquipable, setContractEquipable] = useState(undefined);

	useEffect(() => {
		getContracts(provider, setContractEquipable);
	}, [provider]);

	return { contractEquipable };
};
