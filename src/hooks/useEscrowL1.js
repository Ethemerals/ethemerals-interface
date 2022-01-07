import { useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { useQuery } from 'react-query';
import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_CORE, GET_CORE_ACCOUNT, GET_DELEGATES } from '../queries/Subgraph';

import getSigner from '../constants/Signer';
import abis from '../constants/contracts/abis';
import { Addresses } from '../constants/contracts/Addresses';
import { useWeb3 } from '../context/Web3Context';

const getContracts = async (provider, setContractEscrow) => {
	if (provider) {
		await setContractEscrow(new Contract(Addresses.EscrowL1, abis.EscrowL1, getSigner(provider)));
		console.log('GOT ESCROW CONTRACT');
	} else {
	}
};

export const useEscrowL1Contract = () => {
	const provider = useWeb3();

	const [contractEscrowL1, setContractEscrow] = useState(undefined);

	useEffect(() => {
		getContracts(provider, setContractEscrow);
	}, [provider]);

	return { contractEscrowL1 };
};

export const useCoreAccount = () => {
	const { data } = useGQLQuery('account_core', GET_CORE_ACCOUNT, { id: Addresses.Ethemerals.toLowerCase() }, { refetchOnMount: true });

	const [accountCore, setAccountCore] = useState(null);

	useEffect(() => {
		if (data && data.account !== null) {
			setAccountCore(data.account);
			console.log('GOT ACCOUNT CORE');
		}
	}, [data]);

	return {
		accountCore,
	};
};
