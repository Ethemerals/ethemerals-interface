import { useEffect, useState } from 'react';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

import { isAddress, shortenAddress } from '../utils';

const getWinners = async (id) => {
	try {
		const url = `${process.env.REACT_APP_API_ART}getwinners?id=${id}&network=${process.env.REACT_APP_API_NETWORK}`;
		const { data } = await axios.get(url);
		return data;
	} catch (error) {
		throw new Error('get artHunt error');
	}
};

const submitCheckAnswer = async (answerData) => {
	try {
		const { data } = await axios.post(`${process.env.REACT_APP_API_ART}checkanswer`, answerData);
		return data;
	} catch (error) {
		throw new Error('get artHunt error');
	}
};

export const useArtGetWinners = (id) => {
	let [winners, setWinners] = useState(undefined);
	const { isLoading, data } = useQuery([`${id}_arthunter_winners`], () => getWinners(id), { refetchOnMount: true });

	useEffect(() => {
		if (data && !isLoading) {
			setWinners(data.data);
		}
	}, [data, isLoading]);

	// prettier-ignore
	return {
    winners
  };
};

export const useArtCheckAnswer = () => {
	let [answerIsUpdating, setAnswerIsUpdating] = useState(false);
	const mutateCheckAnswer = useMutation(submitCheckAnswer);

	useEffect(() => {
		if (mutateCheckAnswer.status === 'loading') {
			setAnswerIsUpdating(true);
		} else {
			setAnswerIsUpdating(false);
		}
	}, [mutateCheckAnswer]);

	const checkAnswer = async (meralsIds, petsIds, tokenId) => {
		try {
			const result = await mutateCheckAnswer.mutateAsync({ meralsIds, petsIds, tokenId, network: process.env.REACT_APP_API_NETWORK });
			return result;
		} catch (error) {
			console.log(error);
		}
	};

	return {
		checkAnswer,
		answerIsUpdating,
	};
};
