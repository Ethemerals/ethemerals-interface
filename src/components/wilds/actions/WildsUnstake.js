import ReactTooltip from 'react-tooltip';
import { useState } from 'react';
import { useSendTx } from '../../../context/TxContext';
import ErrorDialogue from '../../modals/ErrorDialogue';
import WaitingConfirmation from '../../modals/WaitingConfirmation';

import SVGUnstake from '../svg/SVGUnstake';

const WildsUnstake = ({ contractWilds, landId, tokenId, canLeave }) => {
	const sendTx = useSendTx();

	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isErrorOpen, setIsErrorOpen] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const toggleConfirmation = () => {
		setIsConfirmationOpen(!isConfirmationOpen);
	};

	const toggleError = () => {
		setIsErrorOpen(!isErrorOpen);
	};

	const handleUnstake = async () => {
		if (contractWilds) {
			setIsConfirmationOpen(true);
			try {
				let id = tokenId;
				const gasEstimate = await contractWilds.estimateGas.unstake(id);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractWilds.unstake(id, { gasLimit });
				console.log(tx);

				sendTx(tx.hash, 'leave stake', true, [`land_${landId}`, `nft_${id}`, 'account', 'user', 'lands']);
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
			<button
				onClick={handleUnstake}
				data-tip
				data-for="ttUnstake"
				className={`mr-1 text-green-500 opacity-10 ${canLeave ? 'opacity-100 hover:text-green-700 cursor-pointer transition duration-300' : ''}`}
			>
				<SVGUnstake />
			</button>

			<ReactTooltip id="ttUnstake" type="success" effect="solid">
				<span>Leave Battle</span>
			</ReactTooltip>

			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message={`Leave ${tokenId} from Battle!`} />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</div>
	);
};

export default WildsUnstake;
