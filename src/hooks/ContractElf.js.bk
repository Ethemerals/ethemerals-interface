import { utils } from 'ethers';

class ContractToken {
	constructor(contract) {
		this.contract = contract;
	}

	async balanceOf(owner) {
		try {
			const value = await this.contract.balanceOf(owner);
			return value;
		} catch (error) {}
	}
}

function TokenMethods(contract) {
	return new ContractToken(contract);
}

export default TokenMethods;
