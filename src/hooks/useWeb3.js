import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useChain, useMoralis } from 'react-moralis';

export const useWeb3 = () => {
	const { web3, enableWeb3, isWeb3Enabled } = useMoralis();
	const { chainId } = useChain();
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
	}, [web3, chainId]);

	return { provider };
};

export const getIsLayer2 = (chainId) => {
	if (chainId === '0x4' || chainId === '0x1') {
		return false;
	}
	if (chainId === '0x89' || chainId === '0x13881') {
		return true;
	}
	return false;
};

export const getIsLayer1 = (chainId) => {
	if (chainId === '0x4' || chainId === '0x1') {
		return true;
	}
	if (chainId === '0x89' || chainId === '0x13881') {
		return false;
	}
	return false;
};

const getChainName = (chainId) => {
	if (chainId === '0x4') {
		return 'Rinkeby';
	}
	if (chainId === '0x1') {
		return 'Ethereum';
	}
	if (chainId === '0x13881') {
		return 'Mumbai';
	}
	if (chainId === '0x89') {
		return 'Polygon';
	}
	return '';
};

const getOtherLayerChainName = (chainId) => {
	if (chainId === '0x4') {
		return 'Mumbai';
	}
	if (chainId === '0x1') {
		return 'Polygon';
	}
	if (chainId === '0x13881') {
		return 'Rinkeby';
	}
	if (chainId === '0x89') {
		return 'Ethereum';
	}
	return '';
};

export const useGetLayerDetails = () => {
	const { chainId } = useChain();
	const [isLayer2, setIsLayer2] = useState(false);
	const [isLayer1, setIsLayer1] = useState(false);
	const [chainName, setChainName] = useState(undefined);
	const [otherLayerName, setOtherLayerName] = useState(undefined);

	useEffect(() => {
		setIsLayer2(getIsLayer2(chainId));
		setIsLayer1(getIsLayer1(chainId));
		setOtherLayerName(getOtherLayerChainName(chainId));
		setChainName(getChainName(chainId));
	}, [chainId]);

	return { isLayer2, isLayer1, otherLayerName, chainName };
};
