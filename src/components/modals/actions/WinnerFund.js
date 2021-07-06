import { useState } from 'react';
import { useSendTx } from '../../../hooks/TxContext';
import { useReadyToTransact } from '../../../hooks/Web3Context';
import { useCoreContract, useCore } from '../../../hooks/useCore';

import WaitingConfirmation from '../WaitingConfirmation';
import ErrorDialogue from '../ErrorDialogue';

import { formatELF } from '../../../utils';

const Gift = ({ toggle, nft }) => {
	const { core } = useCore();
	const { contractCore } = useCoreContract();
	const sendTx = useSendTx();
	const readyToTransact = useReadyToTransact();

	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isErrorOpen, setIsErrorOpen] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const toggleConfirmation = () => {
		setIsConfirmationOpen(!isConfirmationOpen);
	};

	const toggleError = () => {
		setIsErrorOpen(!isErrorOpen);
	};

	const onSubmitRedeemWinnerFunds = async () => {
		if (contractCore && readyToTransact()) {
			setIsConfirmationOpen(true);
			try {
				let id = nft.id;
				const gasEstimate = await contractCore.estimateGas.redeemWinnerFunds(id);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractCore.redeemWinnerFunds(id, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'Claim Highest Honor', true, [`nft_${id}`, 'account', 'core']);
			} catch (error) {
				setIsErrorOpen(true);
				setErrorMsg('Claim Highest Honor rejected from user wallet');
				console.log(`${error.data} \n${error.message}`);
			}
			setIsConfirmationOpen(false);
			toggle();
		} else {
			// connect
			console.log('no wallet');
		}
	};

	return (
		<>
			<div className="w-full h-full flex justify-center fixed top-0 left-0">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 z-20 bg-opacity-50 bg-black"></div>
				<div className=" w-11/12 max-w-420 h-96 center border-gray-400 bg-opacity-100 rounded-2xl overflow-hidden z-30 tracking-wide shadow-xl bg-gray-900">
					<div className="flex justify-end">
						<span onClick={toggle} className="cursor-pointer p-4 text-gray-300 hover:text-gray-100">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
								<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
							</svg>
						</span>
					</div>
					<div className="text-center p-4">
						<p className="text-2xl">Claim Honor Fund</p>
						<p className="text-sm text-gray-200">You are about to claim the highest honor fund:</p>
						{core && (
							<>
								<p>{`${formatELF(core.winnerFunds)} ELF`}</p>
								<p>For owning the winning Ethemeral:</p>
								<p>{`#${nft.id} ${nft.metadata.coin}`}</p>
								<p className="text-sm">{`note: claiming will reset the rewards share percentage multiplier back to 1% (currently: ${core.winnerMult}%)`}</p>
							</>
						)}

						<button onClick={onSubmitRedeemWinnerFunds} className="bg-brandColor text-xl text-bold px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
							Claim
						</button>
					</div>
				</div>
			</div>
			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message="Claim the highest honor fund, Queen!" />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</>
	);
};

export default Gift;
