import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useChain } from 'react-moralis';
import abis from '../constants/contracts/abis';
import { Addresses } from '../constants/contracts/Addresses';
import { useWeb3 } from './useWeb3';
import { getContract } from '../utils/contracts/getContract';

const getLatestPrice = async (contract, priceFeed) => {
	try {
		const price = await contract.getLatestPrice(priceFeed.id);
		return price.toString();
	} catch (error) {
		throw new Error('error');
	}
};

export const usePriceFeedPriceL2 = (contract, priceFeed) => {
	const { isLoading, data } = useQuery([`priceFeedL2_${priceFeed.id}`, priceFeed.id], () => getLatestPrice(contract, priceFeed), { enabled: !!contract && !!priceFeed, refetchInterval: 30000 });

	const [price, setPriceFeed] = useState(undefined);

	useEffect(() => {
		if (!isLoading) {
			setPriceFeed(data);
		}
	}, [data, isLoading]);

	return { price, isLoading };
};

export const usePriceFeedContractL2 = () => {
	const { provider } = useWeb3();
	const { chainId } = useChain();

	const [contractPriceFeed, setContractPriceFeed] = useState(undefined);

	useEffect(() => {
		getContract(provider, Addresses.priceFeedL2.toLowerCase(), abis.priceFeedL2, setContractPriceFeed, 'PRICEFEEDPROVIDERL2');
	}, [provider, chainId]);

	return { contractPriceFeed };
};
