import Moralis from 'moralis';
import { GraphQLClient } from 'graphql-request';
import { Links } from '../constants/Links';
import { useMemo, useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { GET_ACCOUNT } from '../queries/Subgraph';
import { useQuery } from 'react-query';
import { isAddress } from '../utils';
import { GET_ACCOUNT_L2 } from '../queries/SubgraphPoly';
import { useRegisterMerals } from './useMeralManager';

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

const getL2Merals = async (variables) => {
	if (isAddress(variables.id)) {
		try {
			const endpoint = Links.SUBGRAPH_ENDPOINT_L2;
			const graphQLClient = new GraphQLClient(endpoint);
			const fetchData = await graphQLClient.request(GET_ACCOUNT_L2, variables);
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
	const { verifiedMerals } = useRegisterMerals();
	const [autoTry, setAutoTry] = useState(0);

	const [account, setAccount] = useState(undefined);
	const [mainIndex, setMainIndex] = useState(undefined);
	const [userMerals, setUserMerals] = useState([]);
	const [userPMerals, setUserPMerals] = useState([]);
	const [allMerals, setAllMerals] = useState([]);
	const [stakedMerals, setStakedMerals] = useState([]);
	const [userPets, setUserPets] = useState([]);
	const [userActions, setUserActions] = useState([]);
	const [userL1Actions, setUserL1Actions] = useState([]);
	const [userL2Actions, setUserL2Actions] = useState([]);
	const [allowDelegates, setAllowDelegates] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { data, isLoading: isLoadingAccount } = useQuery(`account_${address}`, () => getUserAccount(address), { enabled: !!address, refetchOnMount: true }); // TODO
	const { data: dataSubgraph, isLoading: isLoadingL1 } = useQuery(`account_${address}_subgraph`, () => getL1Merals({ id: address }), { enabled: !!address, refetchOnMount: true }); // TODO
	const { data: dataSubgraphL2, isLoading: isLoadingL2 } = useQuery(`account_${address}_subgraphL2`, () => getL2Merals({ id: address }), { enabled: !!address, refetchOnMount: true }); // TODO

	useEffect(() => {
		if (data && !isLoadingAccount) {
			setAccount(data);
		}
	}, [data, isLoadingAccount]);

	useEffect(() => {
		if (isLoadingAccount || isLoadingL1 || isLoadingL2) {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [isLoadingAccount, isLoadingL1, isLoadingL2]);

	useEffect(() => {
		if (dataSubgraph && dataSubgraph.account !== null) {
			setUserMerals(dataSubgraph.account.merals);
			setUserPets(dataSubgraph.account.pets);
			setUserL1Actions(dataSubgraph.account.actions);
			setAllowDelegates(dataSubgraph.account.allowDelegates);
		}
	}, [dataSubgraph]);

	useEffect(() => {
		if (dataSubgraphL2 && dataSubgraphL2.account !== null) {
			setUserPMerals(dataSubgraphL2.account.merals);
			setUserL2Actions(dataSubgraphL2.account.actions);
		}
	}, [dataSubgraphL2]);

	useEffect(() => {
		setUserActions(syncAccountsActions(userL1Actions, userL2Actions));
	}, [userL1Actions, userL2Actions]);

	useEffect(() => {
		const { _allMerals, _stakedMerals } = syncMerals(userMerals, userPMerals, verifiedMerals);
		setAllMerals(_allMerals);
		setStakedMerals(_stakedMerals);
	}, [userMerals, userPMerals, verifiedMerals]);

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
    allMerals,
    stakedMerals,
    userPets,
    userActions,
    allowDelegates,
    isLoading
  };
};

const syncAccountsActions = (actionsL1, actionsL2) => {
	let allActions = [];

	actionsL1.forEach((action) => {
		action.isLayer2 = false;
		allActions.push(action);
	});

	actionsL2.forEach((action) => {
		action.isLayer2 = true;
		allActions.push(action);
	});

	allActions.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));

	return allActions;
};

const syncMerals = (meralsL1, meralsL2, verifiedMerals) => {
	let _allMerals = [];
	let _stakedMerals = [];

	meralsL1.forEach((meral) => {
		let isProxy = false;

		meralsL2.forEach((meralL2) => {
			if (parseInt(meral.meralId) === parseInt(meralL2.meralId)) {
				isProxy = true;
				_allMerals.push(meralL2);
			}
		});

		if (!isProxy) {
			_allMerals.push(meral);
		}
	});

	verifiedMerals.forEach((meral) => {
		let isStaked = true;
		meralsL2.forEach((meralL2) => {
			if (parseInt(meral.meralId) === parseInt(meralL2.meralId)) {
				isStaked = false;
			}
		});
		if (isStaked) {
			_stakedMerals.push(meral);
		}
	});

	return { _allMerals, _stakedMerals };
};
