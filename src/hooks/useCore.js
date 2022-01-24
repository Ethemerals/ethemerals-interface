import { useEffect, useState } from 'react';
import { useGQLQueryL1 } from '../hooks/useGQLQuery';
import { GET_CORE, GET_DELEGATES } from '../queries/Subgraph';
import abis from '../constants/contracts/abis';
import { Addresses } from '../constants/contracts/Addresses';
import { useWeb3 } from './useWeb3';

import { getContract } from '../utils/contracts/getContract';
import { useChain } from 'react-moralis';

export const useCoreContract = () => {
	const { provider } = useWeb3();
	const { chainId } = useChain();

	const [contractCore, setContractCore] = useState(undefined);

	useEffect(() => {
		getContract(provider, Addresses.Ethemerals, abis.Ethemerals, setContractCore, 'CORE');
	}, [provider, chainId]);

	return { contractCore };
};

export const useCore = () => {
	const { data } = useGQLQueryL1('core', GET_CORE, { id: Addresses.Ethemerals.toLowerCase() }, { refetchOnMount: true });
	const { data: dataDelegates } = useGQLQueryL1('delegates_list', GET_DELEGATES, { refetchOnMount: true });

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
