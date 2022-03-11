import { useEffect, useState } from 'react';
import { useGQLQueryL1 } from '../hooks/useGQLQuery';
import { GET_CORE, GET_DELEGATES } from '../queries/Subgraph';
import abis from '../constants/contracts/abis';
import { Addresses } from '../constants/contracts/Addresses';
import { useWeb3 } from './useWeb3';

import { getContract, getIsApprovedForAll } from '../utils/contracts/getContract';
import { useChain } from 'react-moralis';
import { useQuery } from 'react-query';

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

export const useDelegates = () => {
	const { data } = useGQLQueryL1('delegates', GET_DELEGATES, { refetchOnMount: true });
	const [delegates, setDelegates] = useState(null);
	useEffect(() => {
		if (data && data.delegates !== null) {
			setDelegates(data.delegates);
		}
	}, [data]);

	return {
		delegates,
	};
};

export const useCoreApprovals = (owner, operator) => {
	const { contractCore } = useCoreContract();
	const { isLoading, data } = useQuery(`coreGetIsApprovedForAll${operator}`, () => getIsApprovedForAll(contractCore, owner, operator), {
		enabled: !!contractCore && !!owner && !!operator,
		refetchInterval: 50000,
	});
	const [isApprovedForAll, setIsApprovedForAll] = useState(undefined);

	useEffect(() => {
		if (data && !isLoading) {
			setIsApprovedForAll(data);
		}
	}, [data, isLoading]);

	return { isApprovedForAll };
};
