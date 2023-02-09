import NiceModal from '@ebay/nice-modal-react';
import { modalRegistry } from '../../components/niceModals/RegisterModals';

export const submitApprovedForAll = async (contract, operator, approved, type, sendTx) => {
	let message = `Approve ${type} - You'll only need to do this once. After confirmation try the action again`;
	if (!approved) {
		message = `Disallow ${type}`;
	}

	if (contract) {
		NiceModal.show(modalRegistry.waitingForSignature, { message });
		try {
			const gasEstimate = await contract.estimateGas.setApprovalForAll(operator, approved);
			const gasLimit = gasEstimate.add(gasEstimate.div(9));
			const tx = await contract.setApprovalForAll(operator, approved, { gasLimit });
			console.log(tx);
			sendTx(tx.hash, `${approved ? `approve ${type}` : `disapprove ${type}`}`, true);
		} catch (error) {
			console.log(`${error.data} \n${error.message}`);
			NiceModal.remove(modalRegistry.waitingForSignature);
		}
	} else {
		console.log('no wallet');
	}
};
