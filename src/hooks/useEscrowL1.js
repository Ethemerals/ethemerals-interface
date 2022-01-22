import { useEffect, useState } from 'react';
import abis from '../constants/contracts/abis';
import { useWeb3 } from './useWeb3';

import { getContract } from '../utils/contracts/getContract';
import { useQuery } from 'react-query';
import { getAccount } from '../utils/contracts/getAccount';
import { Addresses } from '../constants/contracts/Addresses';
import { useChain } from 'react-moralis';

export const useEscrowL1Contract = () => {
	const { provider } = useWeb3();
	const { chainId } = useChain();

	const [contractEscrowL1, setContractEscrow] = useState(undefined);

	useEffect(() => {
		getContract(provider, Addresses.EscrowL1, abis.EscrowL1, setContractEscrow, 'ESCROWL1');
	}, [provider, chainId]);

	return { contractEscrowL1 };
};

export const useEscrowL1Account = () => {
	const [escrowL1Account, setAccount] = useState(undefined);
	const [escrowL1NFTs, setNFTs] = useState([]);
	let address = Addresses.EscrowL1;
	console.log(address);
	const { data, isLoading } = useQuery(`account_${address}`, () => getAccount(address), { enabled: !!address, refetchOnMount: true, refetchInterval: 10000 }); // TODO

	useEffect(() => {
		if (data && !isLoading) {
			setAccount(data);
			setNFTs(data.merals);
		}
	}, [data, isLoading]);

	return {
		escrowL1NFTs,
		escrowL1Account,
	};
};
