export const getIsLayer2 = (chainId) => {
	if (chainId === '0x4' || chainId === '0x1') {
		return false;
	}
	if (chainId === '0x89' || chainId === '0x13881') {
		return true;
	}
	return false;
};

export const getChainName = (chainId) => {
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

export const getOtherLayerChainName = (chainId) => {
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
