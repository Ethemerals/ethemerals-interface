import { useMemo, useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import Moralis from 'moralis';

import { useQuery } from 'react-query';

import { isAddress } from '../utils';

import { Addresses } from '../constants/contracts/Addresses';
import { useCoreContract } from './useCore';
// import { getAccount } from './dataObjects/Account';

export const useUser = () => {
	const { authenticate, isAuthenticated, isAuthenticating, isUnauthenticated, authError, logout, user, setUserData, isUserUpdating } = useMoralis();

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
	};
};

const getAccount = async (address) => {
	if (isAddress(address)) {
		try {
			const result = await Moralis.Cloud.run('getAccount', { address });
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

	const { data, isLoading } = useQuery(`account_${address}`, () => getAccount(address), { enabled: !!address, refetchOnMount: false }); // TODO

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

const getIsApprovedForAll = async (contract, _owner, _operator) => {
	if (contract) {
		try {
			let approved = false;
			const value = await contract.isApprovedForAll(_owner, _operator);
			if (value.toString() === 'true') {
				approved = true;
			}
			return approved;
		} catch (error) {
			console.log(error);
			throw new Error('error');
		}
	} else {
		console.log('no wallet');
		throw new Error('error');
	}
};

export const useEternalBattleApproval = () => {
	const { address: owner } = useUser();
	const operator = Addresses.EternalBattle;
	const { contractCore } = useCoreContract();
	const [isApproved, setIsApproved] = useState(null);
	const { isLoading, data } = useQuery([`eternalBattle_approvals`], () => getIsApprovedForAll(contractCore, owner, operator), {
		enabled: !!owner && !!contractCore && !!operator,
		refetchInterval: 30000,
	});

	useEffect(() => {
		if (!isLoading) {
			setIsApproved(data);
		}
	}, [data, isLoading]);

	return {
		isApproved,
		data,
		isLoading,
	};
};

export const useEscrowL1Approval = () => {
	const { address: owner } = useUser();
	const operator = Addresses.EscrowL1;
	const { contractCore } = useCoreContract();
	const [isApproved, setIsApproved] = useState(null);
	const { isLoading, data } = useQuery([`eternalBattle_approvals`], () => getIsApprovedForAll(contractCore, owner, operator), {
		enabled: !!owner && !!contractCore && !!operator,
		refetchInterval: 30000,
	});

	useEffect(() => {
		if (!isLoading) {
			setIsApproved(data);
		}
	}, [data, isLoading]);

	return {
		isApproved,
		data,
		isLoading,
	};
};
