import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Contract } from '@ethersproject/contracts';

import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_ETERNALBATTLE_ACCOUNT } from '../queries/Subgraph';

import { useSendTx } from './TxContext';
import { useWeb3, useAddress, useOnboard, useLogin, useContractCore, useContractToken, useReadyToTransact } from './Web3Context';

import getSigner from '../constants/Signer';
import abis from '../constants/contracts/abis';
import Addresses from '../constants/contracts/Addresses';

const getPrice = async (contract, index) => {
	if (contract) {
		try {
			const price = await contract.getPrice(index);
			return price.toString();
		} catch (error) {
			throw new Error('error');
		}
	} else {
		// connect access api
		console.log('no wallet');
		throw new Error('error');
	}
};

export const usePriceFeedPrice = (contract, id) => {
	const { isLoading, isError, data } = useQuery([`priceFeed_${id}`, id], () => getPrice(contract, id));

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
