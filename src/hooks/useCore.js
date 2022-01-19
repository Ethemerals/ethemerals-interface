import { useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { useQuery } from 'react-query';
import { useGQLQueryL1 } from '../hooks/useGQLQuery';
import { GET_CORE, GET_DELEGATES } from '../queries/Subgraph';
import abis from '../constants/contracts/abis';
import { Addresses } from '../constants/contracts/Addresses';
import { useWeb3 } from './useWeb3';
import { useAddresses } from './useAddresses';
import { getContract } from './getters/getContract';

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
	const { provider } = useWeb3();
	const { addresses } = useAddresses();
	const address = addresses ? addresses.Ethemerals : undefined;

	const [contractCore, setContractCore] = useState(undefined);

	useEffect(() => {
		getContract(provider, address, abis.Ethemerals, setContractCore, 'CORE');
	}, [provider, addresses, abis]);

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

// export const useCoreAccount = () => {
// 	const { data } = useGQLQueryL1('account_core', GET_CORE_ACCOUNT, { id: Addresses.Ethemerals.toLowerCase() }, { refetchOnMount: true });

// 	const [accountCore, setAccountCore] = useState(null);

// 	useEffect(() => {
// 		if (data && data.account !== null) {
// 			setAccountCore(data.account);
// 			console.log('GOT ACCOUNT CORE');
// 		}
// 	}, [data]);

// 	return {
// 		accountCore,
// 	};
// };

// export const useCoreApprovals = (contractCore, owner, operator) => {
// 	console.log(owner, operator);
// 	const { isLoading, data } = useQuery([`core_approvals`], () => getIsApprovedForAll(contractCore, owner, operator), { enabled: !!owner && !!contractCore && !!operator, refetchInterval: 30000 });

// 	const [EBApproved, setEBApproved] = useState(null);

// 	useEffect(() => {
// 		if (!isLoading) {
// 			setEBApproved(data);
// 		}
// 	}, [data, isLoading]);

// 	return {
// 		EBApproved,
// 	};
// };
