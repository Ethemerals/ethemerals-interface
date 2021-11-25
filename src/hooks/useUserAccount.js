import { useEffect, useState } from 'react';
import { GraphQLClient } from 'graphql-request';

import { useQuery } from 'react-query';

import { GET_ACCOUNT } from '../queries/Subgraph';
import { useUser } from './useUser';
import { isAddress } from '../utils';
import Links from '../constants/Links';

import { useMoralis } from 'react-moralis';

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

const useUserAccount = () => {
	const { address, balance } = useUser();
	const { isUserUpdating, user, setUserData } = useMoralis();

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
			if (!isUserUpdating) {
				// NEW USER
				if (!user.attributes.meralMainId) {
					if (account.ethemerals.length > 0) {
						setUserData({
							meralMainId: account.ethemerals[0].id,
						});
						console.log('new user');
					}
				} else {
					// AUTO MAIN
					if (account.ethemerals.length > 0) {
						let foundNFT = false;

						account.ethemerals.forEach((nft) => {
							if (nft.id === user.attributes.meralMainId) {
								foundNFT = true;
							}
						});

						if (!foundNFT) {
							setUserData({
								meralMainId: account.ethemerals[0].id,
							});
							console.log('auto main');
						}
					}
				}
			}
		}
	}, [account, isUserUpdating, setUserData, user]);

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

export default useUserAccount;
