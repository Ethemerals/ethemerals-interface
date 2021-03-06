// import { Contract } from '@ethersproject/contracts';
import { getAddress } from '@ethersproject/address';
// import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from '@ethersproject/bignumber';

import { utils } from 'ethers';

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value) {
	try {
		return getAddress(value);
	} catch {
		return false;
	}
}

const ETHERSCAN_PREFIXES = {
	1: '',
	4: 'rinkeby.',
	42: 'kovan.',
};

export function getEtherscanLink(chainId, data, type) {
	const prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`;

	switch (type) {
		case 'transaction': {
			return `${prefix}/tx/${data}`;
		}
		case 'token': {
			return `${prefix}/token/${data}`;
		}
		case 'block': {
			return `${prefix}/block/${data}`;
		}
		case 'address':
		default: {
			return `${prefix}/address/${data}`;
		}
	}
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address, chars = 4) {
	const parsed = isAddress(address);
	if (!parsed) {
		console.log(`Invalid 'address' parameter '${address}'.`);
	}
	return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

// add 10%
export function calculateGasMargin(value) {
	return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000));
}

export function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function formatELF(value, asInt = true) {
	const balance = utils.formatEther(value);
	return asInt ? parseInt(balance) : balance;
}

export function formatETH(value, fixedAmount = 3) {
	const balance = utils.formatEther(value);
	return parseFloat(balance).toFixed(fixedAmount);
}

export const formatPrice = (price, decimals = 2) => {
	const formatConfig = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: decimals,
	});

	return formatConfig.format(price);
};

// FILTERING

export const formatFilters = (filters) => {
	let _filters = [];

	for (const key in filters) {
		_filters.push(`${key}: ${JSON.stringify(filters[key])}`);
	}
	return `{${_filters}}`;
};

// MATHS

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
