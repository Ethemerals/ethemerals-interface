import { useEffect, useState } from 'react';
import { GraphQLClient } from 'graphql-request';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

import { GET_ACCOUNT } from '../queries/Subgraph';

import { isAddress } from '../utils';
import { Links } from '../constants/Links';
import { useAccessToken, useAddress, useAuthenticated, useWeb3 } from '../context/Web3Context';

const updateUser = async (userData) => {
	if (isAddress(userData.address)) {
		try {
			const { data } = await axios.post(`${process.env.REACT_APP_API_ACCOUNTS}update`, userData, {
				headers: { authorization: `Bearer ${userData.accessToken}` },
			});
			return data;
		} catch (error) {
			throw new Error('error');
		}
	} else {
		return { message: 'address not valid' };
	}
};

const getUser = async (id, accessToken) => {
	if (isAddress(id)) {
		try {
			const { data } = await axios.get(`${process.env.REACT_APP_API_ACCOUNTS}user/${id}`, {
				headers: { authorization: `Bearer ${accessToken}` },
			});
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
			const endpoint = Links.SUBGRAPH_ENDPOINT;
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

const getBalance = async (provider, address) => {
	try {
		const value = await provider.getBalance(address);
		return value.toString();
	} catch (error) {
		console.log(error);
	}
};

const useUserAccount = () => {
	const address = useAddress();
	const provider = useWeb3();

	const isAuthenticated = useAuthenticated();
	const accessToken = useAccessToken();

	const queryClient = useQueryClient();

	const [balance, setBalance] = useState(null);
	const [account, setAccount] = useState(undefined);
	const [mainIndex, setMainIndex] = useState(undefined);
	const [userNFTs, setUserNFTs] = useState([]);
	const [user, setUser] = useState(undefined);
	const [userIsUpdating, setUserIsUpdating] = useState(false);

	const { data, status, loaded } = useQuery(`account`, () => getAccount({ id: address }), { enabled: !!address, refetchOnMount: true }); // TODO

	const userId = data?.account?.id;

	const { isLoading: userIsLoading, data: userData } = useQuery(['user', address], () => getUser(address, accessToken), { enabled: !!userId && !!isAuthenticated && !!accessToken });
	const { data: userBalance } = useQuery('user_balance', () => getBalance(provider, address), { enabled: !!provider && !!address, refetchOnMount: true });
	const mutateUser = useMutation(updateUser, { onSuccess: async () => queryClient.invalidateQueries('user') });

	useEffect(() => {
		if (data && data.account !== null) {
			setAccount(data.account);
			// LOCAL NFTS
			setUserNFTs(data.account.ethemerals);
		}
	}, [data]);

	useEffect(() => {
		if (userBalance) {
			setBalance(userBalance);
		}
	}, [userBalance]);

	useEffect(() => {
		if (mutateUser.status === 'loading') {
			setUserIsUpdating(true);
		} else {
			setUserIsUpdating(false);
		}
	}, [mutateUser]);

	// GET MAIN
	useEffect(() => {
		if (userData && account && !userIsLoading) {
			let foundNFT = false;
			// FOUND USER
			if (userData && userData.data && userData.data.meralMainId) {
				setUser(userData.data);
				if (account && account.ethemerals.length > 0) {
					account.ethemerals.forEach((nft, index) => {
						if (nft.id === userData.data.meralMainId) {
							setMainIndex(index);
							foundNFT = true;
						}
					});
					// FOUND USER BUT NO MAIN
					if (!foundNFT) {
						setMainIndex(undefined);
					}
				}
			}
		}
	}, [userData, account, userIsLoading, user]);

	useEffect(() => {
		if (!mutateUser.isLoading && mutateUser.isIdle) {
			if (account && !userIsLoading && userData) {
				// NEW USER
				if (userData.message === 'does not exist') {
					if (account.ethemerals.length > 0) {
						mutateUser.mutateAsync({ address: account.id, updates: { meralMainId: account.ethemerals[0].id }, accessToken });
						console.log('new user');
					}
				} else {
					// AUTO MAIN
					if (account.ethemerals.length > 0) {
						let foundNFT = false;

						account.ethemerals.forEach((nft) => {
							if (nft.id === userData.data.meralMainId) {
								foundNFT = true;
							}
						});

						if (!foundNFT) {
							mutateUser.mutateAsync({ address: account.id, updates: { meralMainId: account.ethemerals[0].id }, accessToken });
							console.log('auto main');
						}
					}
				}
			}
		}
	}, [userData, userIsLoading, mutateUser, account, accessToken]);

	const setUserData = async (updates) => {
		try {
			await mutateUser.mutateAsync({ address, updates, accessToken });
			console.log('updated');
		} catch (error) {
			console.log(error);
		}
	};

	// prettier-ignore
	return {
    address,
    balance,
    account,
    loaded,
    status,
    mainIndex,
    userNFTs,
    user,
    userIsLoading,
    userIsUpdating,
    setUserData
  };
};

export default useUserAccount;
