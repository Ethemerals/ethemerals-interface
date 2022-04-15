import { useEffect, useState } from 'react';
import abis from '../constants/contracts/abis';
import { Addresses } from '../constants/contracts/Addresses';

import { useWeb3 } from './useWeb3';
import { useChain } from 'react-moralis';
import { getContract } from '../utils/contracts/getContract';
import { useQuery } from 'react-query';
import { GET_MERALS_BY_VERIFIEDOWNER, GET_PENDING_MERALS, GET_PROXY_MERALS } from '../queries/SubgraphPoly';
import { gql, GraphQLClient } from 'graphql-request';
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
				dataVerifiedMerals.merals.forEach((meral) => {
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
	}, [dataAvailMerals, dataVerifiedMerals]);

	useEffect(() => {
		if (dataPendingMerals && dataPendingMerals.account !== null) {
			setPendingMerals(dataPendingMerals.account.merals);
		}
	}, [dataPendingMerals]);

	useEffect(() => {
		if (dataProxiedMerals && dataProxiedMerals.account !== null) {
			setProxiedMerals(dataProxiedMerals.account.merals);
		}
	}, [dataProxiedMerals]);

	return {
		availableMerals,
		pendingMerals,
		proxiedMerals,
	};
};

// TODO

const GET_MERALS_BY_ID = gql`
	query ($first: Int!, $ids: [String]) {
		merals(first: $first, where: { burnt: false, status: "2", id_in: $ids }) {
			id
			type
			tokenId
			meralId
			timestamp
			hp
			elf
			xp
			atk
			def
			spd
			element
			cmId
			coin
			subclass
			mainclass
		}
	}
`;

const getMeralsById = async (variables) => {
	if (variables.ids && variables.ids.length > 0) {
		try {
			const endpoint = Links.SUBGRAPH_ENDPOINT_L2;
			const graphQLClient = new GraphQLClient(endpoint);
			const fetchData = await graphQLClient.request(GET_MERALS_BY_ID, variables);
			return fetchData;
		} catch (error) {
			throw new Error('get account error');
		}
	} else {
		return { message: 'address not valid' };
	}
};

const getSyncedMerals = (meralsL1, meralsL2) => {
	let syncedMerals = [];
	for (let i = 0; i < meralsL1.length; i++) {
		let meralL1 = meralsL1[i];
		meralL1.proxy = false;
		for (let j = 0; j < meralsL2.length; j++) {
			let meralL2 = meralsL2[j];
			if (meralL1.meralId === meralL2.meralId) {
				console.log('sync it');
				meralL1.hp = meralL2.hp;
				meralL1.xp = meralL2.xp;
				meralL1.elf = meralL2.elf;
				meralL1.atk = meralL2.atk;
				meralL1.def = meralL2.def;
				meralL1.spd = meralL2.spd;
				meralL1.element = meralL2.element;
				meralL1.proxy = true;
			}
		}
		syncedMerals.push(meralL1);
	}
	return syncedMerals;
};

export const useSyncedMerals = (meralIds, nfts) => {
	const [meralsL2ById, setMeralsL2ById] = useState(undefined);
	const [syncedMerals, setSyncedMerals] = useState(undefined);
	const { data, isLoading: isLoadingL2 } = useQuery([`getMeralsById`, meralIds], () => getMeralsById({ ids: meralIds, first: 50 }), { enabled: !!meralIds, refetchOnMount: true });

	useEffect(() => {
		if (data) {
			setMeralsL2ById(data.merals);
			console.log(data);
		}
	}, [data]);

	useEffect(() => {
		if (nfts) {
			if (meralsL2ById && meralsL2ById.length > 0) {
				setSyncedMerals(getSyncedMerals(nfts, meralsL2ById));
			} else {
				setSyncedMerals(nfts);
			}
		}
	}, [nfts, meralsL2ById]);

	return {
		meralsL2ById,
		isLoadingL2,
		syncedMerals,
	};
};
