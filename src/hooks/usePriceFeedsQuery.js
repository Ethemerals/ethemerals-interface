import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';

const getPrice = async (contract, index) => {
	try {
		const price = await contract.getPrice(index);
		return price.toString();
	} catch (error) {
		throw new Error('error');
	}
};

const usePriceFeedsQuery = (contract, index) => {
	const { isLoading, isError, data } = useQuery([`priceFeed${index}`, index], () => getPrice(contract, index));
	return { isLoading, isError, data };
};

export default usePriceFeedsQuery;
