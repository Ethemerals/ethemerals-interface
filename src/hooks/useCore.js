import { useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { useQuery } from 'react-query';
import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_CORE, GET_CORE_ACCOUNT, GET_DELEGATES } from '../queries/Subgraph';

import { useWeb3 } from './Web3Context';
import { useMoralis } from 'react-moralis';

import getSigner from '../constants/Signer';
import abis from '../constants/contracts/abis';
import Addresses from '../constants/contracts/Addresses';

const getContracts = async (provider, setContractCore) => {
	console.log(provider);
	if (provider) {
		await setContractCore(new Contract(Addresses.Ethemerals, abis.Ethemerals, getSigner(provider)));
		console.log('GOT CORE CONTRACT');
	} else {
	}
};

const getIsApprovedForAll = async (contract, _owner, _operator) => {
	if (contract) {
		try {
			let approved = false;
			const value = await contract.isApprovedForAll(_owner, _operator);
			if (value.toString() === 'true') {
				approved = true;
			}
			return approved;
		} catch (error) {
			console.log(error);
			throw new Error('error');
		}
	} else {
		console.log('no wallet');
		throw new Error('error');
	}
};

export const useCoreContract = () => {
	const provider = useWeb3();
	const { web3 } = useMoralis();

	const [contractCore, setContractCore] = useState(undefined);

	useEffect(() => {
		getContracts(provider, setContractCore);
		console.log(provider, 'provider');
	}, [provider]);

	useEffect(() => {
		console.log(web3.givenProvider, 'web3');
		console.log(Object.keys(web3), 'web3');
		if (web3.givenProvider) {
			getContracts(web3.givenProvider, setContractCore);
		}
	}, [web3]);

	return { contractCore };
};

export const useCore = () => {
	const { data } = useGQLQuery('core', GET_CORE, { id: Addresses.Ethemerals.toLowerCase() }, { refetchOnMount: true });
	const { data: dataDelegates } = useGQLQuery('delegates_list', GET_DELEGATES, { refetchOnMount: true });

	const [core, setCore] = useState(null);
	const [delegates, setDelegates] = useState(null);
	useEffect(() => {
		if (data && data.core !== null) {
			setCore(data.core);
		}
	}, [data]);

	useEffect(() => {
		if (dataDelegates && dataDelegates.delegates !== null) {
			setDelegates(dataDelegates.delegates);
			console.log('GOT DELEGATES LIST');
		}
	}, [dataDelegates]);

	return {
		core,
		delegates,
	};
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

export const useCoreApprovals = (contractCore, owner, operator) => {
	const { isLoading, data } = useQuery([`core_approvals`], () => getIsApprovedForAll(contractCore, owner, operator), { enabled: !!owner && !!contractCore && !!operator, refetchInterval: 30000 });

	const [EBApproved, setEBApproved] = useState(null);

	useEffect(() => {
		if (!isLoading) {
			setEBApproved(data);
		}
	}, [data, isLoading]);

	return {
		EBApproved,
	};
};
