import Moralis from 'moralis';
import { GraphQLClient } from 'graphql-request';
import { Links } from '../constants/Links';
import { useMemo, useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { GET_ACCOUNT } from '../queries/Subgraph';
import { useQuery } from 'react-query';
import { isAddress } from '../utils';

export const useUser = () => {
	const { authenticate, isAuthenticated, isAuthenticating, isUnauthenticated, authError, logout, user, setUserData, isUserUpdating } = useMoralis();

	const address = useMemo(() => user?.attributes.ethAddress, [user]);

	const login = async () => {
		if (!user) {
			await authenticate({ signingMessage: 'Sign to Authenticate - Kingdom of the Ethemerals' });
		} else {
			// logout();
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
	};
};

export const getUserAccount = async (address) => {
	if (isAddress(address)) {
		try {
			const result = await Moralis.Cloud.run('getUserAccount', { address });
			return result;
		} catch (error) {
			throw new Error('get account error');
		}
	} else {
		return { message: 'address not valid' };
	}
};

const getL1Merals = async (variables) => {
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

export const useUserAccount = () => {
	const { address } = useUser();
	const { isUserUpdating, user, setUserData } = useMoralis();
	const [autoTry, setAutoTry] = useState(0);

	const [account, setAccount] = useState(undefined);
	const [mainIndex, setMainIndex] = useState(undefined);
	const [userMerals, setUserMerals] = useState([]);
	const [userPets, setUserPets] = useState([]);
	const [userActions, setUserActions] = useState([]);
	const [userPMerals, setUserPMerals] = useState([]);
	const [allowDelegates, setAllowDelegates] = useState(false);

	const { data, isLoading } = useQuery(`account_${address}`, () => getUserAccount(address), { enabled: !!address, refetchOnMount: true }); // TODO
	const { data: dataSubgraph } = useQuery(`account_${address}_subgraph`, () => getL1Merals({ id: address }), { enabled: !!address, refetchOnMount: true }); // TODO

	useEffect(() => {
		if (data && !isLoading) {
			setAccount(data);
			setUserPMerals(data.pMerals);
		}
	}, [data, isLoading]);

	useEffect(() => {
		if (dataSubgraph && dataSubgraph.account !== null) {
			setUserMerals(dataSubgraph.account.merals);
			setUserPets(dataSubgraph.account.pets);
			setUserActions(dataSubgraph.account.actions);
			setAllowDelegates(dataSubgraph.account.allowDelegates);
		}
	}, [dataSubgraph]);

	// GET MAIN
	useEffect(() => {
		if (user && userMerals && !isUserUpdating) {
			let foundNFT = false;
			// FOUND USER
			if (user.attributes.meralMainId) {
				if (userMerals && userMerals.length > 0) {
					userMerals.forEach((meral, index) => {
						if (parseInt(meral.meralId) === user.attributes.meralMainId) {
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
	}, [user, isUserUpdating, userMerals]);

	// SET MAIN
	useEffect(() => {
		if (userMerals && user) {
			if (!isUserUpdating && userMerals.length > 0) {
				// NEW USER
				if (!user.attributes.meralMainId && autoTry < 10) {
					setUserData({
						meralMainId: parseInt(userMerals[0].meralId),
					});
					console.log('new user');
					setAutoTry((at) => at + 1);
				} else {
					// AUTO MAIN

					let foundNFT = false;

					userMerals.forEach((meral) => {
						if (parseInt(meral.meralId) === parseInt(user.attributes.meralMainId)) {
							foundNFT = true;
						}
					});

					if (foundNFT) {
						setAutoTry(0);
					}

					if (!foundNFT && autoTry < 5) {
						setUserData({
							meralMainId: parseInt(userMerals[0].meralId),
						});
						setMainIndex(0);
						console.log('auto main');
						setAutoTry((at) => at + 1);
					}
				}
			}
		}
	}, [isUserUpdating, setUserData, user, autoTry, userMerals]);

	// prettier-ignore
	return {
    address,
    account,
    mainIndex,
    userPMerals,
    userMerals,
    userPets,
    userActions,
    allowDelegates
  };
};
