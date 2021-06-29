import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Contract } from '@ethersproject/contracts';
import axios from 'axios';

import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_ETERNALBATTLE_ACCOUNT } from '../queries/Subgraph';

import { useSendTx } from './TxContext';
import { useWeb3, useAddress, useOnboard, useLogin, useContractCore, useContractToken, useReadyToTransact } from './Web3Context';

import getSigner from '../constants/Signer';
import abis from '../constants/contracts/abis';
import Addresses from '../constants/contracts/Addresses';

const getPriceAPI = async (id) => {
	const url = `${process.env.REACT_APP_API_URL}pricefeed/${id}`;
	console.log(url);
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
	const { isLoading, isError, data } = useQuery([`priceFeed_${priceFeed.id}`, priceFeed.id], () => getPrice(contract, priceFeed));

	const [price, setPriceFeed] = useState(undefined);

	useEffect(() => {
		if (!isLoading) {
			setPriceFeed(data);
		}
	}, [data, isLoading]);

	return { price };
};

export const usePriceFeedContract = () => {
	const provider = useWeb3();

	const [contractPriceFeed, setContractPriceFeed] = useState(undefined);

	useEffect(() => {
		getContracts();
	}, [provider]);

	const getContracts = async () => {
		if (provider) {
			await setContractPriceFeed(new Contract(Addresses.priceFeed, abis.priceFeed, getSigner(provider)));
			console.log('GOT PRICEFEED CONTRACTS');
		} else {
		}
	};

	return { contractPriceFeed };
};
