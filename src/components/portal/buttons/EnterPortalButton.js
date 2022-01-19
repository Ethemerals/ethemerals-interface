import { useState } from 'react';
import { useMiningStatus, useSendTx } from '../../../context/TxContext';
import { submitApprovedForAll } from '../../../hooks/getters/contractFunctions';
import { getIsApprovedForAll } from '../../../hooks/getters/getContract';
import { useCoreContract } from '../../../hooks/useCore';
import { useEscrowL1Contract } from '../../../hooks/useEscrowL1';
import { getIdFromType, getTokenIdFromId, getTypeFromId } from '../../../hooks/useMeralUtils';
import { useUser, useUserAccount } from '../../../hooks/useUser';

const Spinner = () => (
	<svg className="animate-spin 'h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
		<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
		<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
	</svg>
);

const EnterPortalButton = () => {
	let buttonTextInit = 'Enter The Portal';

	const mining = useMiningStatus();
	const { mainIndex, userNFTs } = useUserAccount();
	const { contractCore } = useCoreContract();
	const { contractEscrowL1 } = useEscrowL1Contract();
	const { login, user, address } = useUser();
	const sendTx = useSendTx();

	const [buttonText, setButtonText] = useState(buttonTextInit);
	const [showApproval, setShowApproval] = useState(false);

	const checkApproval = async () => {
		console.log(contractEscrowL1.address, address);
		let _isApproved = await getIsApprovedForAll(contractCore, address, contractEscrowL1.address);
		return _isApproved;
	};

	const handleDeposit = async () => {
		if (!user || contractEscrowL1) {
			setButtonText('Sign In');
			await login();
			setButtonText(buttonTextInit);
		}

		if (user && contractEscrowL1 && contractCore) {
			let _isApproved = await checkApproval();
			if (!_isApproved) {
				setButtonText('Approve');
				setShowApproval(true);
				await submitApprovedForAll(contractCore, contractEscrowL1.address, true, 'portal', sendTx);
				setShowApproval(false);
				setButtonText(buttonTextInit);
			} else {
				submitDeposit();
			}
			console.log(_isApproved);
			console.log('do it');
		}
	};

	const submitDeposit = async () => {
		if (contractEscrowL1 && userNFTs) {
			try {
				let nft = userNFTs[mainIndex];
				let tokenId = nft.tokenId;
				let type = getTypeFromId(nft.meralId);
				console.log(type, tokenId, contractEscrowL1.address, contractCore.address);
				const gasEstimate = await contractEscrowL1.estimateGas.deposit(type, tokenId);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractEscrowL1.deposit(type, tokenId, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'enter portal', true, [`account_${address}`, `nft_${nft.meralId}`]);
			} catch (error) {
				alert('Transfer transaction rejected from user wallet');
				console.log(`${error.data} \n${error.message}`);
			}
		} else {
			// connect
			console.log('error');
		}
	};

	const disapprove = async () => {
		await submitApprovedForAll(contractCore, contractEscrowL1.address, false, 'portal', sendTx);
	};

	return (
		<>
			<div className="relative">
				<button disabled={mining} onClick={handleDeposit} className="w-44 h-10 px-4 py-2 bg-blue-100 rounded hover:bg-yellow-100">
					<span className="flex justify-center">
						{!mining && buttonText}
						{mining && <Spinner />}
					</span>
				</button>
				{showApproval && <div className="w-44 h-24 bg-yellow-50 absolute text-center p-4 text-xs shadow">Approve Contract to transfer (you only need to do this the first time)</div>}
			</div>
			<button onClick={disapprove}>disapprove</button>
		</>
	);
};

export default EnterPortalButton;
