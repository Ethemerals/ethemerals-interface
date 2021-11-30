import { useEffect, useState } from 'react';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

import { isAddress } from '../utils';
import { useAccessToken, useAddress } from '../context/Web3Context';

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
	// meralsIds, petsIds, tokenId, address, network
	try {
		const { data } = await axios.post(`${process.env.REACT_APP_API_ART}checkanswer`, answerData);
		return data;
	} catch (error) {
		throw new Error('get artHunt error');
	}
};

const submitClaimReward = async (answerData) => {
	if (isAddress(answerData.address)) {
		try {
			const { data } = await axios.post(`${process.env.REACT_APP_API_ART}claimreward`, answerData, {
				headers: { authorization: `Bearer ${answerData.accessToken}` },
			});
			return data;
		} catch (error) {
			throw new Error('get artHunt error');
		}
	} else {
		throw new Error('get artHunt error');
	}
};

export const useArtGetWinners = (id) => {
	let [winners, setWinners] = useState(undefined);
	const { isLoading, data } = useQuery([`arthunter_winners`], () => getWinners(id), { refetchOnMount: true });

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

export const useClaimReward = () => {
	const address = useAddress();
	const accessToken = useAccessToken();
	const queryClient = useQueryClient();

	let [claimIsUpdating, setClaimIsUpdating] = useState(false);
	const mutateClaimReward = useMutation(submitClaimReward, { onSuccess: async () => queryClient.invalidateQueries(['arthunter_winners']) });

	useEffect(() => {
		if (mutateClaimReward.status === 'loading') {
			setClaimIsUpdating(true);
		} else {
			setClaimIsUpdating(false);
		}
	}, [mutateClaimReward]);

	const claimReward = async (meralsIds, petsIds, tokenId) => {
		try {
			const result = await mutateClaimReward.mutateAsync({ meralsIds, petsIds, tokenId, address, accessToken, network: process.env.REACT_APP_API_NETWORK });
			return result;
		} catch (error) {
			console.log(error);
		}
	};

	return {
		claimReward,
		claimIsUpdating,
	};
};
