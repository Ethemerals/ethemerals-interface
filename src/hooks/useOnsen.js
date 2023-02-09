import { useEffect, useState } from 'react';
import { getUnixTime } from 'date-fns';
import abis from '../constants/contracts/abis';
import { Addresses } from '../constants/contracts/Addresses';

import { useWeb3 } from './useWeb3';
import { useChain } from 'react-moralis';
import { getContract } from '../utils/contracts/getContract';
import { getAccount } from '../utils/contracts/getAccount';
import { useQuery } from 'react-query';
import { safeScale } from '../components/wilds/utils';

export const useOnsenContract = () => {
	const { provider } = useWeb3();
	const { chainId } = useChain();

	const [contractOnsen, setOnsenContract] = useState(undefined);

	useEffect(() => {
		getContract(provider, Addresses.Onsen.toLowerCase(), abis.Onsen, setOnsenContract, 'ONSEN');
	}, [provider, chainId]);

	return { contractOnsen };
};

export const useOnsenAccount = () => {
	const [onsenAccount, setAccount] = useState(undefined);
	const [onsenNFTs, setNFTs] = useState([]);
	let address = Addresses.Onsen;
	const { data, isLoading } = useQuery(`account_${address}`, () => getAccount(address), { enabled: !!address, refetchOnMount: true, refetchInterval: 20000 }); // TODO

	useEffect(() => {
		if (data && !isLoading) {
			setAccount(data);
			setNFTs(data.pMerals);
		}
	}, [data, isLoading]);

	return {
		onsenAccount,
		onsenNFTs,
	};
};

export const getOnsenChange = (meral) => {
	let xp = 0;
	let hp = 0;
	let elf = 0;

	if (meral && meral.transferTimestamp) {
		let start = getUnixTime(new Date(meral.transferTimestamp));
		let now = getUnixTime(new Date());
		xp = getXp(now, start);
		hp = getHp(now, start, meral.spd);
		elf = getElf(now, start);
	}

	return { xp, hp, elf };
};

const getXp = (now, start) => {
	return parseInt((now - start) / 7200);
};

const getHp = (now, start, stat) => {
	let scaled = safeScale(stat, 2000, 14, 22);
	return parseInt(((now - start) * parseInt(scaled)) / 10000);
};

const getElf = (now, start) => {
	return parseInt((now - start) / 10000);
};
