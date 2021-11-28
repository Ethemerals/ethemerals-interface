import React, { useContext, useState, useEffect, createContext, useCallback } from 'react';
import { ethers } from 'ethers';

import axios from 'axios';

// ONBOARD
// import { initOnboard } from '../constants/Wallets';

// CONTEXT
const Web3Context = createContext();
const SignerContext = createContext();
const AddressContext = createContext();
const LoginContext = createContext();
const Authenticated = createContext();
const Authenticating = createContext();
const AccessToken = createContext();
const RefreshToken = createContext();

// PROVIDER
export function useWeb3() {
	return useContext(Web3Context);
}

export function useSigner() {
	return useContext(SignerContext);
}

export function useAddress() {
	return useContext(AddressContext);
}

export function useLogin() {
	return useContext(LoginContext);
}

export function useAuthenticated() {
	return useContext(Authenticated);
}

export function useAuthenticating() {
	return useContext(Authenticating);
}

export function useAccessToken() {
	return useContext(AccessToken);
}

export function useRefreshToken() {
	return useContext(RefreshToken);
}

const verifyRequest = async (address, signature, nonce) => {
	try {
		const url = `${process.env.REACT_APP_API_ACCOUNTS}verify`;
		const { data } = await axios.get(`${url}?address=${address}&signature=${signature}&nonce=${nonce}`);
		return data;
	} catch (error) {
		return false;
	}
};

const authRequest = async (address, signer) => {
	const signingMessage = 'Sign this Message To authenticate and signin. [';
	try {
		const url = `${process.env.REACT_APP_API_ACCOUNTS}auth`;
		const { data } = await axios.get(`${url}?address=${address}`);
		const signature = await signer.signMessage(`${signingMessage}${data.data}]`);
		const { authenticated, accessToken } = await verifyRequest(address, signature, data.data);
		return { accessToken, authenticated };
	} catch (error) {
		return false;
	}
};

// PROVIDER
export default function Web3ContextProvider({ children }) {
	const [address, setAddress] = useState(null);

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isAuthenticating, setIsAuthenticating] = useState(false);

	const [accessToken, setAccessToken] = useState(undefined);

	//USER
	const [previousAddress, setPreviousAddress] = useState(null);

	const addressChanged = useCallback(() => {
		console.log('ADDRESS CHANGED', address);
		if (address !== null && previousAddress !== null && address !== previousAddress) {
		}
	}, [address, previousAddress]);

	useEffect(() => {
		setPreviousAddress(address);
		addressChanged();
	}, [address, addressChanged]);

	const login = async () => {
		const { ethereum } = window;
		try {
			if (ethereum) {
				const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

				const _provider = new ethers.providers.Web3Provider(ethereum);
				const _signer = _provider.getSigner();

				setAddress(accounts[0]);
				setProvider(_provider);
				setSigner(_signer);

				setIsAuthenticating(true);
				refreshToken(accounts[0], _signer);
			} else {
				console.log('no wallet detected');
				alert('No wallet detected, Download Metamask');
			}
		} catch (error) {
			console.log(error);
		}
	};

	const refreshToken = async (address, signer) => {
		if (address) {
			try {
				setIsAuthenticating(true);
				const authData = await authRequest(address, signer);

				if (authData && authData.authenticated === true) {
					setIsAuthenticated(true);
					setAccessToken(authData.accessToken);
					setIsAuthenticating(false);
					return authData.accessToken;
				} else {
					setIsAuthenticated(false);
				}
				setIsAuthenticating(false);
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<Web3Context.Provider value={provider}>
			<SignerContext.Provider value={signer}>
				<Authenticated.Provider value={isAuthenticated}>
					<Authenticating.Provider value={isAuthenticating}>
						<AccessToken.Provider value={accessToken}>
							<RefreshToken.Provider value={refreshToken}>
								<AddressContext.Provider value={address}>
									<LoginContext.Provider value={login}>{children}</LoginContext.Provider>
								</AddressContext.Provider>
							</RefreshToken.Provider>
						</AccessToken.Provider>
					</Authenticating.Provider>
				</Authenticated.Provider>
			</SignerContext.Provider>
		</Web3Context.Provider>
	);
}
