import { useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { useQuery } from 'react-query';
import { useGQLQueryL1 } from './useGQLQuery';
import { GET_CORE, GET_CORE_ACCOUNT, GET_DELEGATES } from '../queries/Subgraph';
import { GET_ESCROWL1_ACCOUNT } from '../queries/SubgraphEscrow';

import getSigner from '../constants/Signer';
import abis from '../constants/contracts/abis';
import { Addresses } from '../constants/contracts/Addresses';

import { useWeb3 } from './useWeb3';

const getContracts = async (provider, setContractEscrow) => {
	if (provider) {
		await setContractEscrow(new Contract(Addresses.EscrowL1, abis.EscrowL1, getSigner(provider)));
		console.log('GOT ESCROW CONTRACT');
	} else {
	}
};

export const useEscrowL1Contract = () => {
	const { provider } = useWeb3();

	const [contractEscrowL1, setContractEscrow] = useState(undefined);

	useEffect(() => {
		getContracts(provider, setContractEscrow);
	}, [provider]);

	return { contractEscrowL1 };
};

export const useEscrowL1Account = () => {
	const { data } = useGQLQueryL1('account_escrow_l1', GET_ESCROWL1_ACCOUNT, { id: Addresses.EscrowL1.toLowerCase() }, { refetchOnMount: true });
	const [accountEscrowL1, setAccount] = useState(null);

	useEffect(() => {
		if (data && data.account !== null) {
			setAccount(data.account);
		}
	}, [data]);

	return {
		accountEscrowL1,
	};
};
