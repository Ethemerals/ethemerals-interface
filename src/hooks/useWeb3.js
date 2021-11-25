import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useMoralis } from 'react-moralis';

export const useWeb3 = () => {
	const { web3 } = useMoralis();
	const [provider, setProvider] = useState(null);

	useEffect(() => {
		if (web3.givenProvider) {
			const ethersProvider = new ethers.providers.Web3Provider(web3.givenProvider);
			setProvider(ethersProvider);
		}
	}, [web3]);

	return { provider };
};
