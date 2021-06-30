import { useEffect, useState } from 'react';
import { GraphQLClient } from 'graphql-request';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

import { GET_ACCOUNT } from '../queries/Subgraph';
import { useAddress, useBalance } from '../hooks/Web3Context';
import { isAddress } from '../utils';

const updateUser = async (userData) => {
	try {
		const { data } = await axios.post(process.env.REACT_APP_FIREBASE_URL, userData);
		return data;
	} catch (error) {
		throw new Error('error');
	}
};

const getUser = async (id) => {
	if (isAddress(id)) {
		try {
			const { data } = await axios.get(`${process.env.REACT_APP_FIREBASE_URL}${id}`);
			if (data.message === 'does not exist') {
				return data;
			}
			if (data.message === 'got entry') {
				return data;
			}
			throw new Error('error');
		} catch (error) {
			throw new Error('error');
		}
	} else {
		return { message: 'address not valid' };
	}
};

export const getAccount = async (variables) => {
	if (isAddress(variables.id)) {
		try {
			let endpoint = 'https://api.thegraph.com/subgraphs/name/ethemerals/ethemerals';
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

const useUserAccount = () => {
	const address = useAddress();
	const balance = useBalance();
	const queryClient = useQueryClient();

	const { data, status, loaded } = useQuery(`account_${address}`, () => getAccount({ id: address }));
	const { isLoading: userIsLoading, data: userData } = useQuery(['user', address], () => getUser(address));
	const mutateUser = useMutation(updateUser, { onSuccess: () => queryClient.invalidateQueries('user') });

	const [account, setAccount] = useState(null);
	const [mainID, setMainID] = useState(undefined);
	const [mainIndex, setMainIndex] = useState(undefined);
	const [userNFTs, setUserNFTs] = useState([]);

	useEffect(() => {
		if (data && data.account !== null) {
			setAccount(data.account);
		}
	}, [data]);

	// LOCAL NFTS
	useEffect(() => {
		if (account && account.ethemerals.length > 0) {
			setUserNFTs(account.ethemerals);
		}
	}, [account]);

	// GET MAIN
	useEffect(() => {
		if (userData && userData.message === 'got entry' && userData.data.main) {
			setMainID(userData.data.main);
		}

		// NEW USER
		if (userData && userData.message === 'does not exist' && account && account.ethemerals.length > 0) {
			mutateUser.mutate({ address: account.id, main: account.ethemerals[0].id });
		}
	}, [userData, account, mutateUser]);

	// PARSE NFT CHANGES
	useEffect(() => {
		let found = false;
		if (mainID && account) {
			// ID to index
			account.ethemerals.forEach((nft, index) => {
				if (nft.id === mainID.toString()) {
					setMainIndex(index);
					found = true;
				}
			});

			// ID and index reset
			if (!found) {
				if (account.ethemerals.length > 0) {
					// sold but still has NFTS
					mutateUser.mutate({ address: account.id, main: account.ethemerals[0].id });
				} else {
					mutateUser.mutate({ address: account.id, main: -1 });
				}
				setUserNFTs(account.ethemerals);
			}
		}
	}, [mainID, account, mutateUser]);

	// prettier-ignore
	return {
    address,
    balance,
    account,
    loaded,
    status,
    userIsLoading,
    mutateUser,
    mainID,
    mainIndex,
    userNFTs };
};

export default useUserAccount;
