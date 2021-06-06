import React, { useContext, useState, useEffect, createContext } from 'react';
import { useQueryClient } from 'react-query';
import { ethers, utils } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';

import { isAddress } from '../utils';

// ONBOARD
import { initOnboard } from '../constants/Wallets';
import getSigner from '../constants/Signer';

import abis from '../constants/contracts/abis';
import Addresses from '../constants/contracts/Addresses';

// CONTEXT
const Web3Context = createContext();
const OnboardContext = createContext();
const AddressContext = createContext();
const BalanceContext = createContext();
const LoginContext = createContext();
const ReadyToTransactContext = createContext();

const ContractCoreContext = createContext();
const RehydrateContext = createContext();

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

// CONTRACTS
export function useContractCore() {
	return useContext(ContractCoreContext);
}

// QUERIES
export function useRehydrate() {
	return useContext(RehydrateContext);
}

// PROVIDER
export default function Web3ContextProvider({ children }) {
	// HOOKS
	const queryClient = useQueryClient();

	//ONBOARD
	const [address, setAddress] = useState(null);
	const [balance, setBalance] = useState(null);
	const [wallet, setWallet] = useState({});
	const [onboard, setOnboard] = useState(null);

	//CONTRACTS
	const [contractCore, setContractCore] = useState(undefined);

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
					getContracts(ethersProvider);
				} else {
					setProvider(null);
					setWallet({});
				}
			},
		});

		setOnboard(onboard);
	}, []);

	useEffect(() => {
		if (provider) {
			// console.log('PROVIDER', provider);
			setProvider(provider);
		}
	}, [provider]);

	useEffect(() => {
		console.log('ADDRESS CHANGED', address);
		if (address !== null && previousAddress !== null && address !== previousAddress) {
			if (onboard && provider) {
				console.log('re login');
				if (onboard) {
					onboard.walletReset();
					if (typeof window !== 'undefined') {
						window.location.reload();
					}
				}
			}
		}
		if (address !== null && isAddress(address)) {
			setPreviousAddress(address);
			setTimeout(() => rehydrate('account'), 3000);
		}
	}, [address]);

	useEffect(() => {
		console.log('BALANCE CHANGED', balance);
		setTimeout(() => rehydrate('account'), 4000);
	}, [balance]);

	// useEffect(() => {
	// 	console.log('wallet CHANGED', wallet);
	// }, [wallet]);

	const getContracts = async (ethersProvider) => {
		if (ethersProvider) {
			await setContractCore(new Contract(Addresses.Ethemerals, abis.Ethemerals, getSigner(ethersProvider)));
			// await setContractToken(new Contract(Addresses.EthemeralLifeForce, abis.EthemeralLifeForce, getSigner(ethersProvider)));
			console.log('GOT CONTRACTS');
		} else {
		}
	};

	const rehydrate = (queryKey = 'account') => {
		console.log('rehydrate', queryKey);
		queryClient.invalidateQueries(queryKey);
	};

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
		console.log(ready);
		return ready;
	}

	return (
		<Web3Context.Provider value={provider}>
			<OnboardContext.Provider value={onboard}>
				<BalanceContext.Provider value={balance}>
					<AddressContext.Provider value={address}>
						<ContractCoreContext.Provider value={contractCore}>
							<LoginContext.Provider value={login}>
								<ReadyToTransactContext.Provider value={readyToTransact}>
									<RehydrateContext.Provider value={rehydrate}>{children}</RehydrateContext.Provider>
								</ReadyToTransactContext.Provider>
							</LoginContext.Provider>
						</ContractCoreContext.Provider>
					</AddressContext.Provider>
				</BalanceContext.Provider>
			</OnboardContext.Provider>
		</Web3Context.Provider>
	);
}
