import { useState, useEffect } from 'react';

import { useSendTx } from '../context/TxContext';

import { useEscrowL1Contract } from '../hooks/useEscrowL1';

import WaitingConfirmation from '../components/modals/WaitingConfirmation';
import ErrorDialogue from '../components/modals/ErrorDialogue';

import { useUser, useUserAccount } from '../hooks/useUser';
import PortalCard from '../components/portal/PortalCard';
import { useCoreContract } from '../hooks/useCore';
import EnterPortalButton from '../components/portal/buttons/EnterPortalButton';

const Portal = () => {
	const { mainIndex, userNFTs } = useUserAccount();
	const { contractCore } = useCoreContract();
	const { contractEscrowL1 } = useEscrowL1Contract();
	const { login, user } = useUser();

	const sendTx = useSendTx();

	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isErrorOpen, setIsErrorOpen] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const [userNFT, setUserNFT] = useState(undefined);
	useEffect(() => {
		if (userNFTs && userNFTs.length > 0 && mainIndex >= 0) {
			let _userNFT = userNFTs[mainIndex];
			setUserNFT(_userNFT);
		}
	}, [userNFTs, mainIndex]);

	const toggleConfirmation = () => {
		setIsConfirmationOpen(!isConfirmationOpen);
	};

	const toggleError = () => {
		setIsErrorOpen(!isErrorOpen);
	};

	const handleDeposit = async () => {
		if (!user || !contractEscrowL1) {
			login();
		}
		// if (contractEscrowL1 && userNFT) {
		// 	setIsConfirmationOpen(true);
		// 	try {
		// 		let id = userNFT.id;
		// 		const gasEstimate = await contractEscrowL1.estimateGas.deposit(id);
		// 		const gasLimit = gasEstimate.add(gasEstimate.div(9));
		// 		const tx = await contractEscrowL1.deposit(id, { gasLimit });
		// 		console.log(tx);

		// 		sendTx(tx.hash, 'enter portal', true, ['account', `nft_${id}`, 'account_escrow_l1']);
		// 	} catch (error) {
		// 		setIsErrorOpen(true);
		// 		setErrorMsg('Transfer transaction rejected from user wallet');
		// 		console.log(`${error.data} \n${error.message}`);
		// 	}
		// 	setIsConfirmationOpen(false);
		// 	// toggle();
		// } else {
		// 	// connect
		// 	console.log('no wallet');
		// }
	};

	const onSubmitAllowDelegates = async (allow = true) => {
		if (contractCore) {
			setIsConfirmationOpen(true);
			try {
				const gasEstimate = await contractCore.estimateGas.setAllowDelegates(allow);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractCore.setAllowDelegates(allow, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, `${allow ? 'approve delegates' : 'disapprove delegates'}`, true, ['account', 'account_core', 'core_approvals']);
			} catch (error) {
				setIsErrorOpen(true);
				setErrorMsg('approve delegates transaction rejected from user wallet');
				console.log(`${error.data} \n${error.message}`);
			}
			setIsConfirmationOpen(false);
		} else {
			// connect
			console.log('no wallet');
		}
	};

	return (
		<div>
			<div style={{ maxWidth: '500px' }} className="my-8 w-11/12 sm:my-10 sm:w-full mx-auto bg-white p-6 pt-20 pb-10 rounded-lg bg-opacity-80">
				<EnterPortalButton />
			</div>
			<PortalCard />
			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message="Enter The portal to Polygon" />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</div>
	);
};

export default Portal;
