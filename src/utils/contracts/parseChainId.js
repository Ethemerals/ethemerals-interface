export const getIsLayer2 = (chainId) => {
	if (chainId === '0x4' || chainId === '0x1') {
		return false;
	}
	if (chainId === '0x89' || chainId === '0x13881') {
		return true;
	}
	return false;
};
