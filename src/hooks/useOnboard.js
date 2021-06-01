import React, { useContext, useState, useEffect } from 'react';
import { ethers, utils } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';

import { isAddress } from '../utils';

// ONBOARD
import { initOnboard } from '../constants/Wallets';
import getSigner from '../constants/Signer';

import abis from '../constants/contracts/abis';
import Addresses from '../constants/contracts/Addresses';

export default function useOnboard() {
	//ONBOARD
	const [address, setAddress] = useState(null);
	const [balance, setBalance] = useState(null);
	const [wallet, setWallet] = useState({});
	const [onboard, setOnboard] = useState(null);

	//ETHERS
	const [provider, setProvider] = useState(null);

	//USER
	const [previousAddress, setPreviousAddress] = useState(null);

	useEffect(() => {
		const onboard = initOnboard({
			address: setAddress,
			balance: setBalance,
			wallet: (wallet) => {
				if (wallet.provider) {
					setWallet(wallet);
					const ethersProvider = new ethers.providers.Web3Provider(wallet.provider);
					setProvider(ethersProvider);
				} else {
					setProvider(null);
					setWallet({});
				}
			},
		});

		setOnboard(onboard);
	}, []);

	useEffect(() => {
		console.log('ADDRESS CHANGED', address);
		if (address !== null && previousAddress !== null && address !== previousAddress) {
			if (onboard && provider) {
				accountDidChange();
			}
		}
		if (address !== null && isAddress(address)) {
			setPreviousAddress(address);
		}
	}, [address]);

	useEffect(() => {
		console.log('BALANCE CHANGED', balance);
	}, [balance]);

	// useEffect(() => {
	// 	console.log('wallet CHANGED', wallet);
	// }, [wallet]);

	const accountDidChange = async () => {
		console.log('re login');
		if (onboard) {
			onboard.walletReset();
			if (typeof window !== 'undefined') {
				window.location.reload();
			}
		}
	};

	return [onboard, provider, address, balance];
}
