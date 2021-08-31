import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSendTx } from '../../../hooks/TxContext';
import { useAddress, useReadyToTransact } from '../../../hooks/Web3Context';
import { useCoreContract } from '../../../hooks/useCore';

import FunctionTx from '../../../constants/FunctionTx';

const SpinnerSVG = () => (
	<svg className=" animate-spin-slow text-brandColor" width="80" height="80" viewBox="0 0 304 304" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g opacity="1">
			<path
				d="M152 304C68.0527 304 0 235.947 0 152C0 68.0527 68.0527 0 152 0L152 10.6431C73.9306 10.6431 10.6429 73.9308 10.6429 152C10.6429 230.069 73.9306 293.357 152 293.357C230.069 293.357 293.357 230.069 293.357 152L304 152C304 235.947 235.947 304 152 304Z"
				fill="currentColor"
			/>
		</g>
	</svg>
);

const Gift = ({ toggle, nft }) => {
	const { register, handleSubmit } = useForm();

	const address = useAddress();
	const { contractCore } = useCoreContract();
	const sendTx = useSendTx();
	const readyToTransact = useReadyToTransact();

	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

	const onSubmitGift = async (data) => {
		if (contractCore && readyToTransact()) {
			setIsConfirmationOpen(true);
			try {
				let toAddress = data.address;
				let id = nft.id;
				const gasEstimate = await contractCore.estimateGas.transferFrom(address, toAddress, id);
				const gasLimit = gasEstimate.add(gasEstimate.div(FunctionTx.transferFrom.gasDiv));
				const tx = await contractCore.transferFrom(address, toAddress, id, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, FunctionTx.transferFrom.receiptMsg, true, [`nft_${id}`, 'account']);
			} catch (error) {
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
			<div className="w-full h-full flex justify-center fixed top-0 left-0 z-20 text-black">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 z-30 bg-opacity-40 bg-black"></div>
				<div className=" w-11/12 max-w-420 h-96 center border-gray-400 bg-opacity-100 rounded-2xl overflow-hidden z-30 tracking-wide shadow-xl bg-blue-200">
					<div className="flex justify-end">
						<span onClick={toggle} className="cursor-pointer p-4 text-black hover:text-gray-500">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
								<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
							</svg>
						</span>
					</div>
					<div className="text-center px-4">
						<p className="text-2xl mb-4">Gift Ethemeral</p>
						<p className="text-sm text-gray-700">{`You are about to gift #${nft.id.padStart(4, '0')} ${nft.metadata.coin} to another wallet, enter receiver's Ethereum wallet address to continue:`}</p>
						<form className="p-4">
							<input className="w-full text-black" {...register('address')} />
							{!isConfirmationOpen ? (
								<button onClick={handleSubmit(onSubmitGift)} className="bg-yellow-400 text-xl text-bold px-4 py-2 my-10 rounded-lg shadow-lg hover:bg-yellow-300 transition duration-300">
									Gift
								</button>
							) : (
								<>
									<div className="mt-6 mb-4 flex justify-center">
										<SpinnerSVG />
									</div>
									<div className="">
										<p className="text-lg">Waiting for Confirmation</p>
										<p className="text-sm text-brandColor">Confirm this transaction in your wallet</p>
									</div>
								</>
							)}
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default Gift;
