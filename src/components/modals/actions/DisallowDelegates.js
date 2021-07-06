import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSendTx } from '../../../hooks/TxContext';
import { useReadyToTransact } from '../../../hooks/Web3Context';
import { useCoreContract } from '../../../hooks/useCore';

import WaitingConfirmation from '../WaitingConfirmation';
import ErrorDialogue from '../ErrorDialogue';
import useUserAccount from '../../../hooks/useUserAccount';

import Addresses from '../../../constants/contracts/Addresses';
import { shortenAddress } from '../../../utils';
import Links from '../../../constants/Links';

const DisallowDelegates = ({ toggle }) => {
	const { account } = useUserAccount();
	const { contractCore } = useCoreContract();
	const sendTx = useSendTx();
	const readyToTransact = useReadyToTransact();

	const [disallowed, setDisallowed] = useState(false);
	const [loading, setLoading] = useState(true);
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isErrorOpen, setIsErrorOpen] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	useEffect(() => {
		if (account) {
			if (account.disallowDelegates) {
				setDisallowed(true);
			} else {
				setDisallowed(false);
			}
			setLoading(false);
		} else {
			setLoading(true);
		}
	}, [account]);

	const toggleConfirmation = () => {
		setIsConfirmationOpen(!isConfirmationOpen);
	};

	const toggleError = () => {
		setIsErrorOpen(!isErrorOpen);
	};

	const onSubmitDisallowDelegates = async (disallow) => {
		if (contractCore && readyToTransact()) {
			setIsConfirmationOpen(true);
			try {
				const gasEstimate = await contractCore.estimateGas.setDisallowDelegates(disallow);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractCore.setDisallowDelegates(disallow, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'Allow/Disallow Delegates', true, ['account']);
			} catch (error) {
				setIsErrorOpen(true);
				setErrorMsg('Allow / Disallow Delegates transaction rejected from user wallet');
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
						<p className="text-2xl">Allow / Disallow Delegates</p>
						<p className="text-sm text-gray-200">Before Joining Battle Contracts you need to allow delegates to transfer your Ethemerals on your behalf</p>
						<p className="py-4">
							You currently have Allow Delegates set to <span className="uppercase">{`${!disallowed.toString()}`}</span> Please allow confirmation time after change
						</p>
						{!loading &&
							(disallowed ? (
								<button onClick={() => onSubmitDisallowDelegates(false)} className="bg-brandColor text-lg text-bold px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
									Allow Delegates
								</button>
							) : (
								<button onClick={() => onSubmitDisallowDelegates(true)} className="bg-brandColor text-lg text-bold px-4 py-2 ounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
									Disallow Delegates
								</button>
							))}
						<p className="mt-8 text-sm text-gray-600 uppercase text-left">Active Delegates:</p>
						<p className="text-left">
							<a href={`${Links.ETHERSCAN_URL}address/${Addresses.EternalBattle}`} target="_blank" rel="noreferrer" className="flex items-center hover:text-blue-400 text-gray-400">
								Eternal Battle Contract: {shortenAddress(Addresses.EternalBattle)}
								<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
									<polyline points="15 3 21 3 21 9"></polyline>
									<line x1="10" y1="14" x2="21" y2="3"></line>
								</svg>
							</a>
						</p>
						<Link exact="true" to="/dashboard">
							<p className="text-sm text-gray-600 text-left mt-4 hover:text-blue-400">Alternatively Set Approval Per Contract</p>
						</Link>
					</div>
				</div>
			</div>
			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message="Setting Allow / Disallow Delegates" />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</>
	);
};

export default DisallowDelegates;
