import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useChain } from 'react-moralis';
import { Addresses } from '../../../constants/contracts/Addresses';
import { useSendTx } from '../../../context/TxContext';
import { useMeralManagerContract, useRegisterMerals } from '../../../hooks/useMeralManager';

import { useUser, useUserAccount } from '../../../hooks/useUser';
import { getIsLayer2, getOtherLayerChainName } from '../../../utils/contracts/parseChainId';
import CloseButton from '../../niceModals/buttons/CloseButton';
import LoginButton from '../../niceModals/cards/LoginButton';

import SwitchNetworks from '../../niceModals/cards/SwitchNetworks';
import { modalRegistry } from '../../niceModals/RegisterModals';

import MeralList from '../cards/MeralList';
import MeralMainnetList from '../cards/MeralMainetList';

export default NiceModal.create(() => {
	const { address } = useUserAccount();
	const { availableMerals, pendingMerals, proxiedMerals } = useRegisterMerals();
	const { user } = useUser();
	const sendTx = useSendTx();
	const { contractMeralManager } = useMeralManagerContract();

	const modal = useModal();

	const { chainId } = useChain();
	let isLayer2 = getIsLayer2(chainId);

	const toggle = async () => {
		modal.remove();
	};

	const selectAndToggle = async (id) => {
		console.log('hi', id);
		await submitRegisterMeral(id);
		// TODO
	};

	const submitRegisterMeral = async (id) => {
		let _meral;
		availableMerals.forEach((meral) => {
			if (meral.tokenId === id) {
				_meral = meral;
			}
		});

		if (!_meral) {
			return;
		}

		if (contractMeralManager) {
			NiceModal.show(modalRegistry.waitingForSignature, { message: `Registering Meral for Polygon Proxy Mint` });
			try {
				const gasEstimate = await contractMeralManager.estimateGas.registerMeral(
					Addresses.Ethemerals,
					_meral.tokenId,
					_meral.hp,
					_meral.elf,
					_meral.atk,
					_meral.def,
					_meral.spd,
					_meral.element,
					_meral.subclass
				);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractMeralManager.registerMeral(Addresses.Ethemerals, _meral.tokenId, _meral.hp, _meral.elf, _meral.atk, _meral.def, _meral.spd, _meral.element, _meral.subclass, {
					gasLimit,
				});

				console.log(tx);
				sendTx(tx.hash, 'Register Meral', true, [
					`account_${address}`,
					`account_${address}_getAvailableMerals`,
					`account_${address}_getPendingMerals`,
					`account_${address}_getProxiedMerals`,
					`nft_${id}`,
				]);
			} catch (error) {
				NiceModal.remove(modalRegistry.waitingForSignature);
				console.log(`${error.data} \n${error.message}`);
			}
		} else {
			console.log('error');
		}
	};

	return (
		<>
			<div onClick={toggle} className="fixed left-0 top-0 w-screen h-screen bg-black bg-opacity-30 z-30"></div>
			<div
				style={{ minWidth: '512px', minHeight: '512px', maxWidth: '832px', maxheight: '90%' }}
				className=" w-4/5 h-5/6 absolute center animate-fadeOnFast z-40 rounded bg-white border border-gray-600 shadow-lg overflow-y-auto"
			>
				{/* CONTENT */}
				<div className="">
					<div className="p-4">
						<h2>Register and Mint Polygon Proxy Meral</h2>
						<div className="py-4">
							<div className="py-4">
								<p>Short description about Registering your meral and minting the proxy, gas free!</p>
								<p>Transend to Layer2... etc</p>
							</div>

							<div className="py-4">
								<h2>Available to Register:</h2>
								<div className="py-4">
									{!user && <LoginButton />}
									{!isLayer2 && <SwitchNetworks message={`Switch your Network to ${getOtherLayerChainName(chainId)}`} />}
								</div>
								{isLayer2 && availableMerals && <MeralMainnetList nfts={availableMerals} select={selectAndToggle} />}
							</div>
							<div className="py-4">
								<h2>Pending Validation:</h2>
								{pendingMerals && <MeralList nfts={pendingMerals} select={selectAndToggle} />}
							</div>
							<div className="py-4">
								<h2>Minted Proxied Merals:</h2>
								{proxiedMerals && <MeralList nfts={proxiedMerals} select={selectAndToggle} />}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
});
