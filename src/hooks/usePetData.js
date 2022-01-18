import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Moralis from 'moralis';
import { getPetDataById } from './dataObjects/PetData';

export const getPetsFiltered = async (filters, order, page, firstEditions = false) => {
	try {
		const result = await Moralis.Cloud.run('petsFiltered', { ...filters, ...order, page, firstEditions });
		return result;
	} catch (error) {
		throw new Error('get account error');
	}
};

export const usePetDataById = (tokenId) => {
	const [petData, setPetData] = useState(undefined);
	const { isLoading, data } = useQuery([`petData_${tokenId}`], () => getPetDataById(tokenId), { refetchOnMount: false });

	useEffect(() => {
		if (data && !isLoading) {
			setPetData(data);
		}
	}, [data, isLoading]);

	return { petData, isLoading };
};

export const getPetBorderColor = (rarity) => {
	if (rarity === 5) {
		return 'hsla(280, 40%, 60%, 1)';
	}
	if (rarity === 4) {
		return 'hsla(24, 40%, 60%, 1)';
	}
	if (rarity === 3) {
		return 'hsla(223, 40%, 60%, 1)';
	}
	if (rarity === 2) {
		return 'hsla(129, 40%, 60%, 1)';
	}

	return 'hsla(225, 10%, 60%, 1)';
};

export const getPetTypePallet = (subclass) => {
	let palette;
	if (subclass === 0) {
		palette = 'hsla(360,80%,40%,1)';
	}
	if (subclass === 1) {
		palette = 'hsla(220,80%,40%,1)';
	}
	if (subclass === 2) {
		palette = 'hsla(160,80%,40%,1)';
	}
	return palette;
};
