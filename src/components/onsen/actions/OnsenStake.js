import { useState, useEffect } from 'react';
import { useSendTx } from '../../../context/TxContext';
import ErrorDialogue from '../../modals/ErrorDialogue';
import WaitingConfirmation from '../../modals/WaitingConfirmation';

import { useUserAccount } from '../../../hooks/useUser';

const OnsenStake = ({ contractOnsen }) => {
	const { mainIndex, userNFTs } = useUserAccount();

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

	const handleStake = async () => {
		if (contractOnsen && userNFT) {
			setIsConfirmationOpen(true);
			try {
				let id = userNFT.id;
				console.log(id);
				const gasEstimate = await contractOnsen.estimateGas.stake(id);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractOnsen.stake(id, { gasLimit });
				console.log(tx);

				sendTx(tx.hash, 'enter onsen', true, ['account', `nft_${id}`, 'account_onsen']);
			} catch (error) {
				setIsErrorOpen(true);
				setErrorMsg('Transfer transaction rejected from user wallet');
				console.log(`${error.data} \n${error.message}`);
			}
			setIsConfirmationOpen(false);
			// toggle();
		} else {
			// connect
			console.log('no wallet');
		}
	};

	return (
		<div>
			<button onClick={handleStake} className=" bg-gray-600 px-2 shadow text-white py-1 hover:bg-green-600 hover:shadow-lg transition duration-300">
				Enter Onsen
			</button>

			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message={`Leave ${userNFT.id} from Onsen!`} />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</div>
	);
};

export default OnsenStake;
