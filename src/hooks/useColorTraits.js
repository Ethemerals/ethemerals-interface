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

const updateMeralColor = async (meralData) => {
	let signed = await signMessage(meralData.address);
	meralData.signed = signed;
	if (isAddress(meralData.address)) {
		try {
			const { data } = await axios.post(`${process.env.REACT_APP_API_MERALS}colors`, meralData);
			return data;
		} catch (error) {
			throw new Error('error');
		}
	} else {
		return { message: 'update meral color error' };
	}
};

const getAllColors = async (set) => {
	try {
		const { data } = await axios.get(`${process.env.REACT_APP_API_MERALS}allcolors/${set}`);
		return data;
	} catch (error) {
		throw new Error('get allColors error');
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
	if (process.env.REACT_APP_CHAIN_ID === '4') {
		baseUrl = `https://rinkeby-api.opensea.io/api/v1/asset/${process.env.REACT_APP_ETHEMERALS_ADDRESS}/`;
	}

	try {
		const response = await axios.get(`${baseUrl}${id}/?force_update=true`);
		if (response.data) {
			console.log(response.data);
			return { success: true, data: response.data };
		}
	} catch (error) {
		return { success: false, data: null };
	}
};

export const useAllColors = (set = 0) => {
	let [allColors, setAllColors] = useState(undefined);
	const { isLoading, data } = useQuery(['allColors'], () => getAllColors(set), { refetchOnMount: false });

	useEffect(() => {
		if (data && !isLoading) {
			setAllColors(data.data.currentColor);
		}
	}, [data]);

	// prettier-ignore
	return {
    allColors
  };
};

export const useMeralColor = (id) => {
	let [meralColor, setMeralColor] = useState(undefined);
	const { isLoading, data } = useQuery([`${id}_colors`], () => getMeralColor(id), { refetchOnMount: true });

	useEffect(() => {
		if (data && !isLoading) {
			setMeralColor(data.data);
		}
	}, [data]);

	// prettier-ignore
	return {
    meralColor
  };
};

export const useMutateMeralColor = () => {
	const queryClient = useQueryClient();
	const mutateMeralColor = useMutation(updateMeralColor, { onSuccess: async () => queryClient.invalidateQueries(['allColors']) });
	return { mutateMeralColor };
};
