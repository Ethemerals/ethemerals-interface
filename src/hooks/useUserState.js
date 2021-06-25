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
			return { main: -1 };
		}
		if (data.message === 'got entry') {
			return data.data;
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

	useEffect(() => {
		if (data && data.main !== -1) {
			setMainID(data.main);
		}
	}, [data]);

	useEffect(() => {
		if (mainID) {
			let found = false;
			account.ethemerals.forEach((nft, index) => {
				if (nft.id === mainID.toString()) {
					setMainIndex(index);
					found = true;
				}
			});
			if (!found && account.ethemerals > 0) {
				mutateUser.mutate({ address: account.id, main: account.ethemerals[0].id });
			}
		}
	}, [mainID]);

	return { mainID, mainIndex, mutateUser, isLoading };
};

export default useUserState;
