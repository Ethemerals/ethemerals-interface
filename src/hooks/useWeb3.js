import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useMoralis } from 'react-moralis';

export const useWeb3 = () => {
	const { web3, enableWeb3, isWeb3Enabled } = useMoralis();
	const [provider, setProvider] = useState(null);

	useEffect(() => {
		if (!isWeb3Enabled) {
			enableWeb3();
		}
	}, [isWeb3Enabled, enableWeb3]);

	useEffect(() => {
		if (web3.givenProvider) {
			const ethersProvider = new ethers.providers.Web3Provider(web3.givenProvider);
			setProvider(ethersProvider);
		}
	}, [web3]);

	return { provider };
};
