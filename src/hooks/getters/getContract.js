import { Contract } from '@ethersproject/contracts';
import { isAddress } from '../../utils';
import { getSigner } from './getSigner';

export const getContract = async (provider, address, abi, setContract, type) => {
	if (provider && isAddress(address)) {
		await setContract(new Contract(address, abi, getSigner(provider)));
		console.log(`GOT ${type} CONTRACT`);
	} else {
		setContract(undefined);
	}
};

export const getIsApprovedForAll = async (contract, _owner, _operator) => {
	if (contract) {
		try {
			let approved = false;
			const value = await contract.isApprovedForAll(_owner, _operator);
			if (value.toString() === 'true') {
				approved = true;
			}
			return approved;
		} catch (error) {}
	}
};
