import { ethers, utils } from 'ethers';

class ContractCore {
	constructor(contract) {
		this.contract = contract;
	}

	async balanceOf(owner) {
		try {
			const value = await this.contract.balanceOf(owner);
			return parseInt(value);
		} catch (error) {}
	}

	async getApproved(id) {
		try {
			const value = await this.contract.getApproved(id);
			return value;
		} catch (error) {}
	}

	async isApprovedForAll(owner, operator) {
		try {
			const value = await this.contract.isApprovedForAll(owner, operator);
			return value.toString();
		} catch (error) {}
	}

	async ownerOf(id) {
		try {
			const value = await this.contract.ownerOf(id);
			return value;
		} catch (error) {}
	}

	async tokenURI(id) {
		try {
			const value = await this.contract.tokenURI(id);
			return value;
		} catch (error) {}
	}

	async getCoinById(id) {
		try {
			const value = await this.contract.getCoinById(id);
			return { id: value.id.toString(), rewards: utils.formatEther(value.rewards), score: parseInt(value.score) };
		} catch (error) {}
	}

	async getCoinScore(id) {
		try {
			const value = await this.contract.getCoinScore(id);
			return parseInt(value);
		} catch (error) {}
	}
}

function CoreMethods(contract) {
	return new ContractCore(contract);
}

export default CoreMethods;
