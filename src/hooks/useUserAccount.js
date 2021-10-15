import { useEffect, useState } from 'react';
import { GraphQLClient } from 'graphql-request';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

import { GET_ACCOUNT } from '../queries/Subgraph';
import { useAddress, useBalance } from '../hooks/Web3Context';
import { isAddress, shortenAddress } from '../utils';
import Links from '../constants/Links';

const signMessage = async (address) => {
	if (address && window.ethereum) {
		let exampleMessage = `Hi ${shortenAddress(address)} Please sign this GAS FREE message to prove this is you!`;
		try {
			let ethereum = window.ethereum;
			const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
			const sign = await ethereum.request({
				method: 'personal_sign',
				params: [msg, address, 'Example dfdffd'],
			});
			return sign;
		} catch (err) {
			console.log(err);
		}
	}
};

const updateUser = async (userData) => {
	let signed = await signMessage(userData.address);
	userData.signed = signed;
	if (isAddress(userData.address)) {
		try {
			const { data } = await axios.post(`${process.env.REACT_APP_API_ACCOUNTS}main`, userData);
			return data;
		} catch (error) {
			throw new Error('error');
		}
	} else {
		return { message: 'address not valid' };
	}
};

const getUser = async (id) => {
	if (isAddress(id)) {
		try {
			const { data } = await axios.get(`${process.env.REACT_APP_API_ACCOUNTS}main/${id}`);
			if (data.message === 'got entry' || data.message === 'does not exist') {
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

const useUserAccount = () => {
	const address = useAddress();
	const balance = useBalance();
	const queryClient = useQueryClient();

	const [account, setAccount] = useState(null);
	const [mainIndex, setMainIndex] = useState(0);
	const [userNFTs, setUserNFTs] = useState([]);

	const { data, status, loaded } = useQuery(`account`, () => getAccount({ id: address }), { enabled: !!address, refetchOnMount: true }); // TODO

	const userId = data?.account?.id;

	const { isLoading: userIsLoading, data: userData } = useQuery(['user', address], () => getUser(address), { enabled: !!userId });
	const mutateUser = useMutation(updateUser, { onSuccess: async () => queryClient.invalidateQueries('user') });

	useEffect(() => {
		if (data && data.account !== null) {
			setAccount(data.account);

			// LOCAL NFTS
			setUserNFTs(data.account.ethemerals);
		}
	}, [data]);

	// GET MAIN
	useEffect(() => {
		if (account) {
			let foundNFT = false;
			// FOUND USER
			if (userData && userData.message === 'got entry' && userData.data.main) {
				if (account && account.ethemerals.length > 0) {
					account.ethemerals.forEach((nft, index) => {
						if (nft.id === userData.data.main) {
							setMainIndex(index);
							foundNFT = true;
						}
					});
					// FOUND USER BUT NO MAIN
					if (!foundNFT) {
						setMainIndex(0);
					}
				}
			}
		}
	}, [userData, account]);

	// prettier-ignore
	return {
    address,
    balance,
    account,
    loaded,
    status,
    userIsLoading,
    mainIndex,
    mutateUser,
    userData,
    userNFTs };
};

export default useUserAccount;
