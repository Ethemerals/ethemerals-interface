import { useEffect, useState } from 'react';
import abis from '../constants/contracts/abis';
import { Addresses } from '../constants/contracts/Addresses';

import { useWeb3 } from './useWeb3';
import { useChain } from 'react-moralis';
import { getContract } from '../utils/contracts/getContract';
import { useQuery } from 'react-query';
import { GET_MERALS_BY_VERIFIEDOWNER, GET_PENDING_MERALS, GET_PROXY_MERALS } from '../queries/SubgraphPoly';
import { GraphQLClient } from 'graphql-request';
import { isAddress } from '../utils';
import { GET_ACCOUNT } from '../queries/Subgraph';
import { Links } from '../constants/Links';
import { useUser } from './useUser';

export const useMeralManagerContract = () => {
	const { provider } = useWeb3();
	const { chainId } = useChain();

	const [contractMeralManager, setMeralManagerContract] = useState(undefined);

	useEffect(() => {
		getContract(provider, Addresses.MeralManager.toLowerCase(), abis.MeralManager, setMeralManagerContract, 'MERALMANAGER');
	}, [provider, chainId]);

	return { contractMeralManager };
};

const getAvailableMerals = async (variables) => {
	if (isAddress(variables.id)) {
		try {
			const endpoint = Links.SUBGRAPH_ENDPOINT_L1;
			const graphQLClient = new GraphQLClient(endpoint);
			const fetchData = await graphQLClient.request(GET_ACCOUNT, variables);
			return fetchData;
		} catch (error) {
			throw new Error('get account error');
		}
	} else {
		return { message: 'address not valid' };
	}
};

const getPendingMerals = async (variables) => {
	if (isAddress(variables.id)) {
		try {
			const endpoint = Links.SUBGRAPH_ENDPOINT_L2;
			const graphQLClient = new GraphQLClient(endpoint);
			const fetchData = await graphQLClient.request(GET_PENDING_MERALS, variables);
			return fetchData;
		} catch (error) {
			throw new Error('get account error');
		}
	} else {
		return { message: 'address not valid' };
	}
};

const getProxiedMerals = async (variables) => {
	if (isAddress(variables.id)) {
		try {
			const endpoint = Links.SUBGRAPH_ENDPOINT_L2;
			const graphQLClient = new GraphQLClient(endpoint);
			const fetchData = await graphQLClient.request(GET_PROXY_MERALS, variables);
			return fetchData;
		} catch (error) {
			throw new Error('get account error');
		}
	} else {
		return { message: 'address not valid' };
	}
};

const getVerifiedMerals = async (variables) => {
	if (isAddress(variables.id)) {
		try {
			const endpoint = Links.SUBGRAPH_ENDPOINT_L2;
			const graphQLClient = new GraphQLClient(endpoint);
			const fetchData = await graphQLClient.request(GET_MERALS_BY_VERIFIEDOWNER, variables);
			return fetchData;
		} catch (error) {
			throw new Error('get account error');
		}
	} else {
		return { message: 'address not valid' };
	}
};

export const useRegisterMerals = () => {
	const { address } = useUser();
	const [availableMerals, setAvailableMerals] = useState([]);
	const [pendingMerals, setPendingMerals] = useState([]);
	const [verifiedMerals, setVerifiedMerals] = useState([]);
	const [proxiedMerals, setProxiedMerals] = useState([]);

	const { data: dataAvailMerals } = useQuery(`account_${address}_getAvailableMerals`, () => getAvailableMerals({ id: address }), { enabled: !!address, refetchOnMount: true, refetchInterval: 10000 });
	const { data: dataPendingMerals } = useQuery(`account_${address}_getPendingMerals`, () => getPendingMerals({ id: address }), { enabled: !!address, refetchOnMount: true, refetchInterval: 10000 });
	const { data: dataProxiedMerals } = useQuery(`account_${address}_getProxiedMerals`, () => getProxiedMerals({ id: address }), { enabled: !!address, refetchOnMount: true, refetchInterval: 10000 });
	const { data: dataVerifiedMerals } = useQuery(`account_${address}_getVerifiedMerals`, () => getVerifiedMerals({ id: address }), { enabled: !!address, refetchOnMount: true, refetchInterval: 10000 });

	useEffect(() => {
		if (dataAvailMerals && dataAvailMerals.account !== null) {
			let idsToRemove = [];
			let _availableMerals = [];

			if (dataVerifiedMerals && dataVerifiedMerals.merals !== null) {
				setVerifiedMerals(dataVerifiedMerals.merals);
				dataVerifiedMerals.merals.forEach((meral) => {
					idsToRemove.push(meral.id);
				});
			}

			if (dataPendingMerals && dataPendingMerals.account !== null) {
				setPendingMerals(dataPendingMerals.account.merals);
				dataPendingMerals.account.merals.forEach((meral) => {
					idsToRemove.push(meral.id);
				});
			}

			dataAvailMerals.account.merals.forEach((meral) => {
				if (idsToRemove.indexOf(meral.meralId) === -1) {
					_availableMerals.push(meral);
				}
			});

			setAvailableMerals(_availableMerals);
		}
	}, [dataAvailMerals, dataVerifiedMerals, dataPendingMerals]);

	useEffect(() => {
		if (dataProxiedMerals && dataProxiedMerals.account !== null) {
			setProxiedMerals(dataProxiedMerals.account.merals);
		}
	}, [dataProxiedMerals]);

	return {
		availableMerals,
		pendingMerals,
		proxiedMerals,
		verifiedMerals,
	};
};

// TODO
