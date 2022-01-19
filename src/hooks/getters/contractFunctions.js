export const submitApprovedForAll = async (contract, operator, approved, type, sendTx) => {
	if (contract) {
		try {
			const gasEstimate = await contract.estimateGas.setApprovalForAll(operator, approved);
			const gasLimit = gasEstimate.add(gasEstimate.div(9));
			const tx = await contract.setApprovalForAll(operator, approved, { gasLimit });
			console.log(tx);
			sendTx(tx.hash, `${approved ? `approve ${type}` : `disapprove ${type}`}`, true);
		} catch (error) {
			console.log(`${error.data} \n${error.message}`);
		}
	} else {
		console.log('no wallet');
	}
};
