import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSendTx } from '../../../context/TxContext';

import { useCore, useCoreContract } from '../../../hooks/useCore';

import WaitingConfirmation from '../WaitingConfirmation';
import ErrorDialogue from '../ErrorDialogue';
import useUserAccount from '../../../hooks/useUserAccount';

import Addresses from '../../../constants/contracts/Addresses';
import { shortenAddress } from '../../../utils';
import Links from '../../../constants/Links';

const AllowDelegates = ({ toggle, toggleStake, EBApproved }) => {
	const { delegates } = useCore();
	const { account } = useUserAccount();
	const { contractCore } = useCoreContract();
	const sendTx = useSendTx();

	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isErrorOpen, setIsErrorOpen] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	useEffect(() => {
		if (account) {
			if (account.allowDelegates) {
				toggleStake();
				toggle();
			}
		}
	}, [account, EBApproved, toggle, toggleStake]);

	const toggleConfirmation = () => {
		setIsConfirmationOpen(!isConfirmationOpen);
	};

	const toggleError = () => {
		setIsErrorOpen(!isErrorOpen);
	};

	const onSubmitAllowDelegates = async (allow) => {
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
		<>
			<div className="w-full h-full fixed flex justify-center z-20 top-0 left-0">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 z-20 bg-opacity-50 bg-black"></div>
				<div className=" w-11/12 max-w-420 center border-gray-400 rounded z-30 tracking-wide shadow-xl bg-indigo-100 text-black">
					<div className="flex items-center justify-end">
						<span onClick={toggle} className="cursor-pointer px-4 py-2 text-gray-900 hover:text-gray-600">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
								<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
							</svg>
						</span>
					</div>

					{/* MAIN */}
					<div className="text-center px-2">
						<p className="text-sm">Before Joining Battle Contracts you need to allow contracts to transfer your Merals on your behalf</p>
						<p className="text-center mt-4">
							<strong>Status: {account && account.allowDelegates ? <span className="text-green-700">Approved</span> : <span className="text-red-700">Not Approved</span>}</strong>
						</p>

						{contractCore && account && !account.allowDelegates && (
							<div
								onClick={() => onSubmitAllowDelegates(true)}
								className="text-center mx-auto shadow-md mt-2 py-2 cursor-pointer rounded-lg font-bold text-lg bg-blue-400 hover:bg-yellow-400 text-white transition duration-300"
							>
								Approve All Delegates
							</div>
						)}

						<h3 className="mt-8">List of Ecosystem Contracts (Delegates)</h3>
						<div className="py-2 mb-4">
							{delegates &&
								delegates.map((delegate) => {
									if (delegate.active) {
										let etherscanLink = `${Links.ETHERSCAN_URL}address/${delegate.id}`;
										return (
											<div key={delegate.id} className="px-2 py-1 text-center bg-white mb-2">
												<p>
													{shortenAddress(delegate.id)}{' '}
													<span>
														{delegate.id.toLowerCase() === Addresses.EternalBattle.toLowerCase() && '- Eternal Battle Contract'}
														{delegate.id.toLowerCase() === Addresses.changeScoreAndRewards.toLowerCase() && '- HP and ELF Rewarder'}
													</span>
												</p>
												<a href={etherscanLink} target="_blank" rel="noreferrer" className="text-xs justify-center flex items-center text-blue-600 hover:text-blue-400">
													View verified contract on etherscan
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="12"
														height="12"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="3"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<polyline points="15 3 21 3 21 9"></polyline>
														<line x1="10" y1="14" x2="21" y2="3"></line>
													</svg>
												</a>
											</div>
										);
									} else {
										return null;
									}
								})}
						</div>

						<hr></hr>
						<p className="px-4 pb-10">
							Alternatively you can approve single Contracts, find out more in the
							<span className="text-blue-600 hover:text-blue-400 cursor-pointer">
								<Link exact="true" to="/dashboard">
									{` Dashboard`}
								</Link>
							</span>
						</p>
					</div>
				</div>
			</div>
			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message="Approve / disapprove Delegates" />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</>
	);
};

export default AllowDelegates;
