import convert from 'ether-converter';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { BigNumber } from 'ethers';

const getGasprice = async () => {
	const url = 'https://gasstation-mainnet.matic.network/v2';
	try {
		const result = await axios.get(url);
		return result.data;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export const useGetGasprice = (fast = false) => {
	const [gasprice, setGasprice] = useState(undefined);
	const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = useState(undefined);
	const [maxFeePerGas, setMaxFeePerGas] = useState(undefined);
	const { isLoading: isLoadingGasprice, data } = useQuery(`getGasPrice`, () => getGasprice(), { refetchOnMount: true, refetchInterval: 20000 });

	useEffect(() => {
		if (data && !isLoadingGasprice) {
			setGasprice(data);

			let maxPF = data.standard.maxPriorityFee;
			let maxF = data.standard.maxFee;

			if (fast) {
				maxPF = data.fast.maxPriorityFee;
				maxF = data.fast.maxFee;
			}

			const { wei: maxPriorityFee } = convert(maxPF, 'gwei');
			const { wei: maxFee } = convert(maxF, 'gwei');
			let _maxPriorityFeePerGas = BigNumber.from(maxPriorityFee.split('.')[0]);
			let _maxFeePerGas = BigNumber.from(maxFee.split('.')[0]);
			// _maxPriorityFeePerGas = _maxPriorityFeePerGas.mul(10);
			// _maxFeePerGas = _maxFeePerGas.mul(10);
			setMaxPriorityFeePerGas(_maxPriorityFeePerGas);
			setMaxFeePerGas(_maxFeePerGas);
		}
	}, [data, isLoadingGasprice, fast]);

	return { gasprice, isLoadingGasprice, maxPriorityFeePerGas, maxFeePerGas };
};
