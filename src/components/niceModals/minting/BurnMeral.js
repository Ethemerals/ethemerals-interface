import NiceModal, { useModal } from '@ebay/nice-modal-react';

import { useState, useEffect } from 'react';
import { useChain } from 'react-moralis';
import { Addresses } from '../../../constants/contracts/Addresses';
import { Links } from '../../../constants/Links';

import { useSendTx } from '../../../context/TxContext';
import { useCore, useCoreContract } from '../../../hooks/useCore';
import { getIdFromType } from '../../../hooks/useMeralsUtils';

import { useUserAccount } from '../../../hooks/useUser';
import { getIsLayer2, getOtherLayerChainName } from '../../../utils/contracts/parseChainId';

import NFTInventoryCard from '../../ethemerals/cards/NFTInventoryCard';
import NetworksButton from '../../navigation/NetworksButton';
import { modalRegistry } from '../../niceModals/RegisterModals';

export default NiceModal.create(() => {
	const { chainId } = useChain();
	let isLayer2 = getIsLayer2(chainId);

	const modal = useModal();
	const { core } = useCore();
	const { mainIndex, userMerals, account, address } = useUserAccount();
	const { contractCore } = useCoreContract();

	const sendTx = useSendTx();
	const [userNFT, setUserNFT] = useState(undefined);

	const [isBurnable, setIsBurnable] = useState(false);

	useEffect(() => {
		if (userMerals && userMerals.length > 0 && mainIndex >= 0) {
			let _userNFT = userMerals[mainIndex];
			setUserNFT(_userNFT);
		}
	}, [userMerals, mainIndex]);

	useEffect(() => {
		if (core && userNFT) {
			if (core.burnCount < core.burnLimit) {
				if (userNFT.tokenId <= core.burnMaxId) {
					setIsBurnable(true);
				}
			}
		}
	}, [core, userNFT]);

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
				sendTx(tx.hash, 'Rebirth meral', true, [`nft_${getIdFromType(1, id)}`, `account_${address}`, 'core']);
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
			<div className="w-full h-full fixed flex justify-center z-10 top-0 left-0">
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
						<div>
							{(!userNFT || !account) && (
								<>
									<p className="px-10 mt-10 mb-4">You need to have an Ethemeral to reborn</p>
									<a href={`${Links.OPENSEAS_COLLECTION}`} target="blank" rel="noreferrer">
										<p className="bg-blue-400 text-white text-lg text-bold px-4 py-1 m-8 mb-16 rounded shadow-lg hover:bg-yellow-400 transition duration-300">Buy Gen1 Merals on Opensea</p>
									</a>
								</>
							)}

							{account && userNFT && (
								<>
									<NFTInventoryCard nft={userNFT} />

									<div className="px-4 pt-6">
										{isLayer2 && (
											<div className="flex items-center space-x-2 mt-4 mb-10 justify-center">
												<div className="">{`Switch your Network to ${getOtherLayerChainName(chainId)}`}</div>
												<NetworksButton />
											</div>
										)}
										{!isLayer2 && (
											<>
												{isBurnable ? (
													<button onClick={onSubmitBurn} className={`mt-2 mb-8 bg-brandColor text-white px-4 py-1 m-2 shadow rounded hover:shadow-lg transition duration-300`}>
														REBIRTH <strong className="uppercase">{userNFT && userNFT.coin}</strong>
													</button>
												) : (
													<button disabled={true} className={`mt-2 mb-8 bg-gray-600 text-white px-4 py-1 m-2 shadow rounded hover:shadow-lg transition duration-300`}>
														<strong className="uppercase">{userNFT && userNFT.coin} Cannot be Reborn</strong>
													</button>
												)}
											</>
										)}
									</div>
								</>
							)}

							<div className="px-4 border border-gray-200 border-b-0 border-l-0 border-r-0">
								<p className="my-3 text-sm">Send your Gen1 Meral to be reborn. You will receive a random Gen2 Meral at zero cost (plus gas)</p>
								<p className="text-sm pb-2 text-red-800">Warning: Rebirth is irreversible</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
});
