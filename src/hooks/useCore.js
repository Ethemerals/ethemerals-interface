import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Contract } from '@ethersproject/contracts';

import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_CORE, GET_CORE_ACCOUNT } from '../queries/Subgraph';

import { useSendTx } from './TxContext';
import { useWeb3, useAddress, useOnboard, useLogin, useContractToken, useReadyToTransact } from './Web3Context';

import getSigner from '../constants/Signer';
import abis from '../constants/contracts/abis';
import Addresses from '../constants/contracts/Addresses';

// const getChange = async (contract, id) => {
// 	if (contract) {
// 		try {
// 			const value = await contract.getChange(id);
// 			console.log(value);

// 			if (value[0].toString() === '0') {
// 				return 0;
// 			}

// 			return parseInt(value[0]) * (value[1] ? 1 : -1);
// 		} catch (error) {
// 			throw new Error('error');
// 		}
// 	} else {
// 		// connect
// 		console.log('no wallet');
// 		throw new Error('error');
// 	}
// };

// export const useExternalBattleGetChange = (contract, id) => {
// 	const { isLoading, isError, data } = useQuery([`getChange_${id}`, id], () => getChange(contract, id));

// 	const [scoreChange, setScoreChange] = useState(undefined);

// 	useEffect(() => {
// 		if (!isLoading) {
// 			setScoreChange(data);
// 		}
// 	}, [data, isLoading]);

// 	return { scoreChange };
// };

export const useCoreContract = () => {
	const provider = useWeb3();

	const [contractCore, setContractCore] = useState(undefined);

	useEffect(() => {
		getContracts();
	}, [provider]);

	const getContracts = async () => {
		if (provider) {
			await setContractCore(new Contract(Addresses.Ethemerals, abis.Ethemerals, getSigner(provider)));
			console.log('GOT CORE CONTRACT');
		} else {
		}
	};

	return { contractCore };
};

export const useCore = () => {
	const { data, status, loaded } = useGQLQuery('core', GET_CORE, { id: Addresses.Ethemerals.toLowerCase() });
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
	const { data, status, loaded } = useGQLQuery('account_core', GET_CORE_ACCOUNT, { id: Addresses.Ethemerals.toLowerCase() });
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
