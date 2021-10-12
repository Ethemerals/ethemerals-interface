import React, { useContext, useState, useEffect, createContext, useCallback } from 'react';
import { ethers } from 'ethers';

// ONBOARD
import { initOnboard } from '../constants/Wallets';

// CONTEXT
const Web3Context = createContext();
const OnboardContext = createContext();
const AddressContext = createContext();
const BalanceContext = createContext();
const LoginContext = createContext();

const ReadyToTransactContext = createContext();

// PROVIDER
export function useWeb3() {
	return useContext(Web3Context);
}

export function useOnboard() {
	return useContext(OnboardContext);
}

export function useAddress() {
	return useContext(AddressContext);
}

export function useBalance() {
	return useContext(BalanceContext);
}

export function useLogin() {
	return useContext(LoginContext);
}

export function useReadyToTransact() {
	return useContext(ReadyToTransactContext);
}

const getBalance = async (provider, address, setBalance) => {
	try {
		const value = await provider.getBalance(address);
		setBalance(value.toString());
		console.log('get balance manually');
	} catch (error) {
		console.log(error);
	}
};

// PROVIDER
export default function Web3ContextProvider({ children }) {
	//ONBOARD
	const [address, setAddress] = useState(null);
	const [balance, setBalance] = useState(null);
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
					const ethersProvider = new ethers.providers.Web3Provider(wallet.provider);
					setProvider(ethersProvider);
				} else {
					setProvider(null);
					// setWallet({});
				}
			},
		});

		setOnboard(onboard);
	}, []);

	useEffect(() => {
		if (provider) {
			setProvider(provider);
		}
	}, [provider]);

	const addressChanged = useCallback(() => {
		console.log('ADDRESS CHANGED', address);
		if (address !== null && previousAddress !== null && address !== previousAddress) {
			if (onboard && provider) {
				if (onboard) {
					onboard.walletReset();
					if (typeof window !== 'undefined') {
						window.location.reload();
					}
				}
			}
		}
	}, [onboard, provider, address, previousAddress]);

	const balanceChanged = useCallback(() => {
		console.log('BALANCE CHANGED', balance);
		if (!balance && provider && address) {
			getBalance(provider, address, setBalance);
		}
	}, [balance, provider, address]);

	useEffect(() => {
		setPreviousAddress(address);
		addressChanged();
	}, [address, addressChanged]);

	useEffect(() => {
		balanceChanged();
	}, [balance, balanceChanged]);

	const login = async () => {
		if (onboard) {
			const selected = await onboard.walletSelect();
			if (selected) {
				await onboard.walletCheck();
			}
		}
	};

	async function readyToTransact() {
		if (!provider) {
			const walletSelected = await onboard.walletSelect();
			if (!walletSelected) return false;
		}

		const ready = await onboard.walletCheck();
		console.log('ready', ready);
		return ready;
	}

	return (
		<Web3Context.Provider value={provider}>
			<OnboardContext.Provider value={onboard}>
				<BalanceContext.Provider value={balance}>
					<AddressContext.Provider value={address}>
						<LoginContext.Provider value={login}>
							<ReadyToTransactContext.Provider value={readyToTransact}>{children}</ReadyToTransactContext.Provider>
						</LoginContext.Provider>
					</AddressContext.Provider>
				</BalanceContext.Provider>
			</OnboardContext.Provider>
		</Web3Context.Provider>
	);
}
