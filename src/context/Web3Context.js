import React, { useContext, useState, useEffect, createContext, useCallback } from 'react';
import axios from 'axios';

// CONTEXT
const Authenticated = createContext();
const Authenticating = createContext();
const AccessToken = createContext();
const RefreshToken = createContext();

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
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isAuthenticating, setIsAuthenticating] = useState(false);

	const [accessToken, setAccessToken] = useState(undefined);

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
		<AccessToken.Provider value={accessToken}>
			<RefreshToken.Provider value={refreshToken}>{children}</RefreshToken.Provider>
		</AccessToken.Provider>
	);
}
