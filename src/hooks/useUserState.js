import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

// TODO
// update on mint
// update on battle
// upate on send
const updateUser = async (userData) => {
	try {
		const { data } = await axios.post(process.env.REACT_APP_FIREBASE_URL, userData);
		return data;
	} catch (error) {
		throw new Error('error');
	}
};

const getUser = async (id) => {
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
};

const useUserState = (account) => {
	const queryClient = useQueryClient();
	const { isLoading, isError, data } = useQuery(['user', account.id], () => getUser(account.id));
	const mutateUser = useMutation(updateUser, { onSuccess: () => queryClient.invalidateQueries('user') });

	const [mainID, setMainID] = useState(undefined);
	const [mainIndex, setMainIndex] = useState(undefined);
	const [userNFTs, setUserNFTs] = useState([]);

	useEffect(() => {
		if (account && account.ethemerals.length > 0) {
			setUserNFTs(account.ethemerals);
		}
	}, [account]);

	useEffect(() => {
		// console.log(userNFTs);
	}, [userNFTs]);

	useEffect(() => {
		if (data && data.message === 'got entry' && data.data.main) {
			setMainID(data.data.main);
		}

		// NEW USER
		if (data && data.message === 'does not exist' && account && account.ethemerals.length > 0) {
			mutateUser.mutate({ address: account.id, main: account.ethemerals[0].id });
		}
	}, [data, account]);

	useEffect(() => {
		let found = false;
		if (mainID) {
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
	}, [mainID, account]);

	return { mainID, mainIndex, mutateUser, isLoading, userNFTs };
};

export default useUserState;
