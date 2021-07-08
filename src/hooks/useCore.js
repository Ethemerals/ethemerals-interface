import { useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';

import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_CORE, GET_CORE_ACCOUNT } from '../queries/Subgraph';

import { useWeb3 } from './Web3Context';

import getSigner from '../constants/Signer';
import abis from '../constants/contracts/abis';
import Addresses from '../constants/contracts/Addresses';

const getContracts = async (provider, setContractCore) => {
	if (provider) {
		await setContractCore(new Contract(Addresses.Ethemerals, abis.Ethemerals, getSigner(provider)));
		console.log('GOT CORE CONTRACT');
	} else {
	}
};

export const useCoreContract = () => {
	const provider = useWeb3();

	const [contractCore, setContractCore] = useState(undefined);

	useEffect(() => {
		getContracts(provider, setContractCore);
	}, [provider]);

	return { contractCore };
};

export const useCore = () => {
	const { data } = useGQLQuery('core', GET_CORE, { id: Addresses.Ethemerals.toLowerCase() }, { refetchOnMount: true });
	const [core, setCore] = useState(null);

	useEffect(() => {
		if (data && data.core !== null) {
			setCore(data.core);
		}
	}, [data]);

	return {
		core,
	};
};

export const useCoreAccount = () => {
	const { data } = useGQLQuery('account_core', GET_CORE_ACCOUNT, { id: Addresses.Ethemerals.toLowerCase() }, { refetchOnMount: true });
	const [accountCore, setAccountCore] = useState(null);

	useEffect(() => {
		if (data && data.account !== null) {
			setAccountCore(data.account);
		}
	}, [data]);

	return {
		accountCore,
	};
};
