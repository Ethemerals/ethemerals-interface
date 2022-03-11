import NiceModal, { useModal } from '@ebay/nice-modal-react';

import { useState, useEffect } from 'react';
import { Addresses } from '../../../constants/contracts/Addresses';

import { useSendTx } from '../../../context/TxContext';
import { useCoreContract } from '../../../hooks/useCore';
import { getIdFromType } from '../../../hooks/useMeralUtils';

import { useUserAccount } from '../../../hooks/useUser';

import NFTInventoryCard from '../../ethemerals/cards/NFTInventoryCard';
import { modalRegistry } from '../../niceModals/RegisterModals';

export default NiceModal.create(({}) => {
	const modal = useModal();
	const { mainIndex, userMerals, account, address } = useUserAccount();
	const { contractCore } = useCoreContract();

	const sendTx = useSendTx();
	const [baseStats, setBaseStats] = useState([0, 0, 0]);
	const [userNFT, setUserNFT] = useState(undefined);

	useEffect(() => {
		if (userMerals && userMerals.length > 0 && mainIndex >= 0) {
			let _userNFT = userMerals[mainIndex];
			setUserNFT(_userNFT);
			setBaseStats([_userNFT.atk, _userNFT.def, _userNFT.spd]);
		}
	}, [userMerals, mainIndex]);

	const toggle = async () => {
		modal.remove();
	};

	const onSubmitBurn = async () => {
		if (contractCore) {
			NiceModal.show(modalRegistry.waitingForSignature, { message: `Send ${userNFT.coin} to be reborn as a Gen2 Meral!` });
			try {
				let id = userNFT.id;
				let toAddress = Addresses.EthemeralBurner;
				const gasEstimate = await contractCore.estimateGas['safeTransferFrom(address,address,uint256)'](address, toAddress, id);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractCore['safeTransferFrom(address,address,uint256)'](address, toAddress, id, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'rebirth meral', true, [`nft_${getIdFromType(1, id)}`, `account_${address}`]);
			} catch (error) {
				console.log(error);
				NiceModal.remove(modalRegistry.waitingForSignature);
			}
			toggle();
		} else {
			console.log('no wallet');
		}
	};

	return (
		<>
			<div className="w-full h-full fixed flex justify-center z-30 top-0 left-0">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 bg-opacity-50 bg-black"></div>
				<div className=" w-11/12 max-w-420 h-500 center border-gray-400 rounded tracking-wide shadow-xl bg-gray-50 text-black">
					<div className="flex items-center justify-end">
						<span onClick={toggle} className="cursor-pointer px-4 py-2 text-gray-900 hover:text-gray-600">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
								<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
							</svg>
						</span>
					</div>

					{/* MAIN */}

					<div className="text-center">
						{account && userNFT && (
							<div>
								<NFTInventoryCard nft={userNFT} stats={baseStats} showBase={false} />

								<div className="px-4 pt-12">
									<p className="my-3">Send your Gen1 Meral to be reborn. You will mint a random Gen2 Meral at zero cost (plus gas)</p>
									<p className="text-sm pb-2">Warning: Rebirth is not reversable. You will be reducing the Gen1 Meral edition count</p>

									<button onClick={onSubmitBurn} className={`mt-2 mb-4 bg-gray-600 text-white px-4 py-1 m-2 shadow hover:shadow-lg transition duration-300`}>
										REBIRTH <strong className="uppercase">{userNFT && userNFT.coin}</strong>
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
});
