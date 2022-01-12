import { useEffect, useState } from 'react';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

import { isAddress } from '../utils';
import { useAccessToken } from '../context/Web3Context';
import { useUser } from './useUser';

const updateMeralColor = async (meralData) => {
	if (isAddress(meralData.address)) {
		meralData.network = parseInt(process.env.REACT_APP_NETWORK);
		try {
			const { data } = await axios.post(`${process.env.REACT_APP_API_MERALS}colors`, meralData, {
				headers: { authorization: `Bearer ${meralData.accessToken}` },
			});
			return data;
		} catch (error) {
			throw new Error('error');
		}
	} else {
		return { message: 'update meral color error' };
	}
};

const getMeralColor = async (id) => {
	try {
		const { data } = await axios.get(`${process.env.REACT_APP_API_MERALS}colors/${id}`);
		return data;
	} catch (error) {
		throw new Error('get meralColor error');
	}
};

export const refreshMetadata = async (id) => {
	let baseUrl = `https://api.opensea.io/api/v1/asset/${process.env.REACT_APP_ETHEMERALS_ADDRESS}/`;
	if (process.env.REACT_APP_NETWORK === '4') {
		baseUrl = `https://rinkeby-api.opensea.io/api/v1/asset/${process.env.REACT_APP_ETHEMERALS_ADDRESS}/`;
	}
	let apiBaseUrl = `${process.env.REACT_APP_API_URL}`;

	try {
		// update image
		await axios.get(`${apiBaseUrl}image/${id}`);
		const response = await axios.get(`${baseUrl}${id}/?force_update=true`);
		console.log('here');
		if (response.data) {
			return { success: true, data: response.data };
		}
	} catch (error) {
		return { success: false, data: null };
	}
};

export const useMeralColor = (id) => {
	let [meralColor, setMeralColor] = useState(undefined);
	const { isLoading, data } = useQuery([`${id}_colors`], () => getMeralColor(id), { refetchOnMount: true });

	useEffect(() => {
		if (data && !isLoading) {
			setMeralColor(data.data);
		}
	}, [data, isLoading]);

	// prettier-ignore
	return {
    meralColor
  };
};

export const useUpdateMeralColor = () => {
	const { address } = useUser();
	const accessToken = useAccessToken();

	const queryClient = useQueryClient();
	const mutateMeralColor = useMutation(updateMeralColor, { onSuccess: async () => queryClient.invalidateQueries(['allColors']) });

	const setMeralColor = async (tokenId, selected) => {
		try {
			await mutateMeralColor.mutateAsync({ address, tokenId, selected, accessToken });
			console.log('updated');
		} catch (error) {
			console.log(error);
		}
	};
	return { mutateMeralColor, setMeralColor };
};
