import NiceModal from '@ebay/nice-modal-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSendTx } from '../../../context/TxContext';

import { useCoreContract, useDelegates } from '../../../hooks/useCore';

import { useUserAccount } from '../../../hooks/useUser';

import ParseDelegates from '../../art/delegates/ParseDelegates';
import { modalRegistry } from '../../niceModals/RegisterModals';

const AllowDelegates = ({ toggle, toggleStake }) => {
	const { delegates } = useDelegates();
	const { account } = useUserAccount();
	const { contractCore } = useCoreContract();
	const sendTx = useSendTx();

	useEffect(() => {
		if (account) {
			if (account.allowDelegates) {
				toggleStake();
				toggle();
			}
		}
	}, [account, toggle, toggleStake]);

	const onSubmitAllowDelegates = async (allow) => {
		if (contractCore) {
			NiceModal.show(modalRegistry.waitingForSignature, { message: `Approve / disapprove Delegates` });
			try {
				const gasEstimate = await contractCore.estimateGas.setAllowDelegates(allow);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractCore.setAllowDelegates(allow, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, `${allow ? 'approve delegates' : 'disapprove delegates'}`, true, ['account', 'account_core', 'core_approvals']);
			} catch (error) {
				NiceModal.remove(modalRegistry.waitingForSignature);
				console.log(`${error.data} \n${error.message}`);
			}
		} else {
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
						<div className="py-2 mb-4">{delegates && delegates.map((delegate, index) => <ParseDelegates key={index} delegate={delegate} />)}</div>

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
		</>
	);
};

export default AllowDelegates;
