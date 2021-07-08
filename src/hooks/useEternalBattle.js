import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Contract } from '@ethersproject/contracts';

import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_ETERNALBATTLE_ACCOUNT } from '../queries/Subgraph';

import { useWeb3 } from './Web3Context';

import getSigner from '../constants/Signer';
import abis from '../constants/contracts/abis';
import Addresses from '../constants/contracts/Addresses';

const getContracts = async (provider, setContractBattle) => {
	if (provider) {
		await setContractBattle(new Contract(Addresses.EternalBattle, abis.EternalBattle, getSigner(provider)));
		console.log('GOT BATTLE CONTRACTS');
	} else {
	}
};

const getChange = async (contract, id) => {
	if (contract) {
		try {
			const value = await contract.getChange(id);

			if (value[0].toString() === '0') {
				return 0;
			}

			return parseInt(value[0]) * (value[1] ? 1 : -1);
		} catch (error) {
			throw new Error('error');
		}
	} else {
		// connect
		console.log('no wallet');
		throw new Error('error');
	}
};

export const useExternalBattleGetChange = (contract, id) => {
	const { isLoading, data } = useQuery([`getChange_${id}`, id], () => getChange(contract, id), { refetchInterval: 30000 });

	const [scoreChange, setScoreChange] = useState(undefined);

	useEffect(() => {
		if (!isLoading) {
			setScoreChange(data);
		}
	}, [data, isLoading]);

	return { scoreChange };
};

export const useEternalBattleContract = () => {
	const provider = useWeb3();

	const [contractBattle, setContractBattle] = useState(undefined);

	useEffect(() => {
		getContracts(provider, setContractBattle);
	}, [provider]);

	return { contractBattle };
};

export const useEternalBattleAccount = () => {
	const { data } = useGQLQuery('account_eternalBattle', GET_ETERNALBATTLE_ACCOUNT, { id: Addresses.EternalBattle.toLowerCase() }, { refetchOnMount: true });
	const [accountEternalBattle, setAccountEternalBattle] = useState(null);

	useEffect(() => {
		if (data && data.account !== null) {
			setAccountEternalBattle(data.account);
		}
	}, [data]);

	return {
		accountEternalBattle,
	};
};
