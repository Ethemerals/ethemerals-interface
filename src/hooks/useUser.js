import { useMemo, useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { useNativeBalance } from 'react-moralis';

import { GraphQLClient } from 'graphql-request';
import { useQuery } from 'react-query';

import { GET_ACCOUNT } from '../queries/Subgraph';

import { isAddress } from '../utils';
import { Links } from '../constants/Links';

export const useUser = () => {
	const { authenticate, isAuthenticated, isAuthenticating, isUnauthenticated, authError, logout, user, setUserData, isUserUpdating } = useMoralis();
	const { data: balance } = useNativeBalance();

	const address = useMemo(() => user?.attributes.ethAddress, [user]);

	const login = () => {
		if (!user) {
			authenticate({ signingMessage: 'Ethemerals Authentication' });
		} else {
			logout();
		}
	};

	return {
		login,
		isAuthenticated,
		isAuthenticating,
		isUnauthenticated,
		authError,
		logout,
		user,
		setUserData,
		isUserUpdating,
		address,
		balance: balance ? balance.balance : null,
	};
};

const getAccount = async (variables) => {
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

export const useUserAccount = () => {
	const { address, balance } = useUser();
	const { isUserUpdating, user, setUserData } = useMoralis();
	const [autoTry, setAutoTry] = useState(0);

	const [account, setAccount] = useState(undefined);
	const [mainIndex, setMainIndex] = useState(undefined);
	const [userNFTs, setUserNFTs] = useState([]);

	const { data, status, loaded } = useQuery(`account`, () => getAccount({ id: address }), { enabled: !!address, refetchOnMount: true }); // TODO

	useEffect(() => {
		if (data && data.account !== null) {
			setAccount(data.account);
			// LOCAL NFTS
			setUserNFTs(data.account.ethemerals);
		}
	}, [data]);

	// GET MAIN
	useEffect(() => {
		if (user && account && !isUserUpdating) {
			let foundNFT = false;
			// FOUND USER
			if (user.attributes.meralMainId) {
				if (account && account.ethemerals.length > 0) {
					account.ethemerals.forEach((nft, index) => {
						if (nft.id === user.attributes.meralMainId) {
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
	}, [user, account, isUserUpdating]);

	// SET MAIN
	useEffect(() => {
		if (account && user) {
			if (!isUserUpdating && account.ethemerals.length > 0) {
				// NEW USER
				if (!user.attributes.meralMainId) {
					setUserData({
						meralMainId: account.ethemerals[0].id,
					});
					console.log('new user');
				} else {
					// AUTO MAIN

					let foundNFT = false;

					account.ethemerals.forEach((nft) => {
						if (nft.id === user.attributes.meralMainId) {
							foundNFT = true;
						}
					});

					if (foundNFT) {
						setAutoTry(0);
					}

					if (!foundNFT && autoTry < 5) {
						setUserData({
							meralMainId: account.ethemerals[0].id,
						});
						console.log('auto main');
						setAutoTry((at) => at + 1);
					}
				}
			}
		}
	}, [account, isUserUpdating, setUserData, user, autoTry]);

	// prettier-ignore
	return {
    address,
    balance,
    account,
    loaded,
    status,
    mainIndex,
    userNFTs,
  };
};
