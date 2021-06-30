import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Contract } from '@ethersproject/contracts';
import axios from 'axios';

import { useWeb3 } from './Web3Context';

import getSigner from '../constants/Signer';
import abis from '../constants/contracts/abis';
import Addresses from '../constants/contracts/Addresses';

const getPriceAPI = async (id) => {
	const url = `${process.env.REACT_APP_API_URL}pricefeed/${id}`;
	const { data } = await axios.get(url);
	if (data.success) {
		return data.result;
	} else {
		return null;
	}
};

const getPrice = async (contract, priceFeed) => {
	if (contract) {
		try {
			const price = await contract.getPrice(priceFeed.id);
			return price.toString();
		} catch (error) {
			throw new Error('error');
		}
	} else {
		try {
			const price = await getPriceAPI(priceFeed.id);
			if (price) {
				return price;
			} else {
				throw new Error('error');
			}
		} catch (error) {
			console.log(error);
			throw new Error('error');
		}
	}
};

export const usePriceFeedPrice = (contract, priceFeed) => {
	const { isLoading, data } = useQuery([`priceFeed_${priceFeed.id}`, priceFeed.id], () => getPrice(contract, priceFeed));

	const [price, setPriceFeed] = useState(undefined);

	useEffect(() => {
		if (!isLoading) {
			setPriceFeed(data);
		}
	}, [data, isLoading]);

	return { price };
};

const getContracts = async (provider, setContractPriceFeed) => {
	if (provider) {
		await setContractPriceFeed(new Contract(Addresses.priceFeed, abis.priceFeed, getSigner(provider)));
		console.log('GOT PRICEFEED CONTRACTS');
	} else {
	}
};

export const usePriceFeedContract = () => {
	const provider = useWeb3();

	const [contractPriceFeed, setContractPriceFeed] = useState(undefined);

	useEffect(() => {
		getContracts(provider, setContractPriceFeed);
	}, [provider]);

	return { contractPriceFeed };
};
