import { useEffect, useState } from 'react';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

import { isAddress, shortenAddress } from '../utils';

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

const submitArtHuntAnswer = async (artHuntData) => {
	if (artHuntData.address) {
		let signed = await signMessage(artHuntData.address);
		artHuntData.signed = signed;
	}

	try {
		const { data } = await axios.post(`${process.env.REACT_APP_API_ART}answers`, artHuntData);
		return data;
	} catch (error) {
		throw new Error('error');
	}
};

const getArtHunt = async (id) => {
	try {
		const { data } = await axios.get(`${process.env.REACT_APP_API_ART}tokens/${id}`);
		return data;
	} catch (error) {
		throw new Error('get artHunt error');
	}
};

export const useArtHunt = (id) => {
	let [artHunt, setArtHunt] = useState(undefined);
	const { isLoading, data } = useQuery([`${id}_artHunt`], () => getArtHunt(id), { refetchOnMount: true });

	useEffect(() => {
		if (data && !isLoading) {
			setArtHunt(data.data);
		}
	}, [data, isLoading]);

	// prettier-ignore
	return {
    artHunt
  };
};

export const useMutateArtHuntAnswer = () => {
	const mutateArtHuntAnswer = useMutation(submitArtHuntAnswer);
	return { mutateArtHuntAnswer };
};
