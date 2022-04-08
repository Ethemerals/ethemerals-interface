import NiceModal from '@ebay/nice-modal-react';
import { useState } from 'react';
import { useSendTx } from '../../../context/TxContext';

import { useEquipableContract } from '../../../hooks/useEquipable';
import { useUserAccount } from '../../../hooks/useUser';

import { useGetLayerDetails } from '../../../hooks/useWeb3';
import { modalRegistry } from '../../niceModals/RegisterModals';

const SpinnerSVG = () => (
	<svg className=" animate-spin-slow text-brandColor" width="50" height="50" viewBox="0 0 304 304" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g opacity="1">
			<path
				d="M152 304C68.0527 304 0 235.947 0 152C0 68.0527 68.0527 0 152 0L152 10.6431C73.9306 10.6431 10.6429 73.9308 10.6429 152C10.6429 230.069 73.9306 293.357 152 293.357C230.069 293.357 293.357 230.069 293.357 152L304 152C304 235.947 235.947 304 152 304Z"
				fill="currentColor"
			/>
		</g>
	</svg>
);

const SummonPet = ({ toggle, nft }) => {
	const { isLayer2, otherLayerName } = useGetLayerDetails();
	const { contractEquipable } = useEquipableContract();
	const sendTx = useSendTx();
	const { address } = useUserAccount();

	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

	const onSwitchNetwork = () => {
		NiceModal.show(modalRegistry.chooseNetworks);
	};

	const onSubmitSummon = async () => {
		if (contractEquipable) {
			setIsConfirmationOpen(true);
			try {
				let id = nft.tokenId;
				const gasEstimate = await contractEquipable.estimateGas.redeemPet(id);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractEquipable.redeemPet(id, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, `Summoned pet ${id}`, true, [`nft_${id}`, `account_${address}`], true, id);
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
			<div className="w-full h-full flex justify-center fixed top-0 left-0 z-10 text-black">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 z-20 bg-opacity-40 bg-black"></div>
				<div className=" w-11/12 max-w-420 h-96 center border-gray-400 bg-opacity-100 rounded overflow-hidden z-30 tracking-wide shadow-xl bg-white">
					<div className="flex justify-end">
						<span onClick={toggle} className="cursor-pointer p-4 text-black hover:text-gray-500">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
								<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
							</svg>
						</span>
					</div>
					<div className="text-center px-4">
						<p className="text-2xl mb-4">{`Summon Pet`} </p>
						<p className="text-base text-black">{`You are about to Mint #${nft.tokenId.toString().padStart(4, '0')} ${
							nft.name
						}'s Pet. Which most likely be a little worthless slime, but... you never know 😊`}</p>

						{!isConfirmationOpen ? (
							<>
								<p className="text-sm text-gray-500 mt-4">
									This action can only happen once, as once the pet is summoned. This Ethemeral can no longer summon another. The Pet belongs to the user who owns this Ethemeral and can be freely
									traded
								</p>

								{isLayer2 && (
									<button onClick={onSwitchNetwork} className="bg-yellow-400 text-xl text-bold px-4 py-2 my-2 rounded-lg shadow-lg hover:bg-yellow-300 transition duration-300">
										Switch Network to {otherLayerName}
									</button>
								)}
								{!isLayer2 && (
									<button onClick={onSubmitSummon} className="bg-yellow-400 text-xl text-bold px-4 py-2 my-2 rounded-lg shadow-lg hover:bg-yellow-300 transition duration-300">
										Mint for Free <span className="text-xs">(plus gas)</span>
									</button>
								)}
							</>
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
					</div>
				</div>
			</div>
		</>
	);
};

export default SummonPet;
