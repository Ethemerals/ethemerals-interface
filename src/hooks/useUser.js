import Moralis from 'moralis';
import { useMemo, useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';

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

export const getUserPendingMerals = async (address) => {
	if (isAddress(address)) {
		try {
			const result = await Moralis.Cloud.run('getUserPendingMerals', { address });
			return result;
		} catch (error) {
			throw new Error('get account error');
		}
	} else {
		return { message: 'address not valid' };
	}
};

export const useUserPendingMerals = () => {
	const { address } = useUser();
	const [pendingNfts, setNfts] = useState(undefined);
	const { data, isLoading } = useQuery(`getUserPendingMerals`, () => getUserPendingMerals(address), { enabled: !!address, refetchOnMount: true }); // TODO

	useEffect(() => {
		if (data && !isLoading) {
			setNfts(data);
		}
	}, [data, isLoading]);

	return { pendingNfts };
};

export const getUserPortalMerals = async (address) => {
	if (isAddress(address)) {
		try {
			const result = await Moralis.Cloud.run('getUserProxyMerals', { address });
			return result;
		} catch (error) {
			throw new Error('get account error');
		}
	} else {
		return { message: 'address not valid' };
	}
};

export const useUserProxyMerals = () => {
	const { address } = useUser();
	const [proxyNfts, setNfts] = useState(undefined);
	const { data, isLoading } = useQuery(`getUserProxyMerals`, () => getUserPortalMerals(address), { enabled: !!address, refetchOnMount: true }); // TODO

	useEffect(() => {
		if (data && !isLoading) {
			setNfts(data);
		}
	}, [data, isLoading]);

	return { proxyNfts };
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

export const useUserAccount = () => {
	const { address } = useUser();
	const { isUserUpdating, user, setUserData } = useMoralis();
	const [autoTry, setAutoTry] = useState(0);

	const [account, setAccount] = useState(undefined);
	const [mainIndex, setMainIndex] = useState(undefined);
	const [userNFTs, setUserNFTs] = useState([]);

	const { data, isLoading } = useQuery(`account_${address}`, () => getUserAccount(address), { enabled: !!address, refetchOnMount: false }); // TODO

	useEffect(() => {
		if (data && !isLoading) {
			setAccount(data);
			setUserNFTs(data.merals);
		}
	}, [data, isLoading]);

	// GET MAIN
	useEffect(() => {
		if (user && account && !isUserUpdating) {
			let foundNFT = false;
			// FOUND USER
			if (user.attributes.meralMainId) {
				if (account && account.merals.length > 0) {
					account.merals.forEach((nft, index) => {
						if (nft.meralId === user.attributes.meralMainId) {
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
			if (!isUserUpdating && account.merals.length > 0) {
				// NEW USER
				if (!user.attributes.meralMainId) {
					setUserData({
						meralMainId: parseInt(account.merals[0].meralId),
					});
					console.log('new user');
				} else {
					// AUTO MAIN

					let foundNFT = false;

					account.merals.forEach((nft) => {
						if (nft.meralId === parseInt(user.attributes.meralMainId)) {
							foundNFT = true;
						}
					});

					if (foundNFT) {
						setAutoTry(0);
					}

					if (!foundNFT && autoTry < 5) {
						setUserData({
							meralMainId: parseInt(account.merals[0].meralId),
						});
						setMainIndex(0);
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
    account,
    mainIndex,
    userNFTs,
  };
};
