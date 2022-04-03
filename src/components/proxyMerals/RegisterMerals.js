import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { BigNumber, ethers } from 'ethers';
import { useChain } from 'react-moralis';
import { Addresses } from '../../constants/contracts/Addresses';
import { useSendTx } from '../../context/TxContext';
import { useMeralManagerContract, useRegisterMerals } from '../../hooks/useMeralManager';

import { useUser, useUserAccount } from '../../hooks/useUser';
import { getIsLayer2, getOtherLayerChainName } from '../../utils/contracts/parseChainId';

import LoginButton from '../niceModals/cards/LoginButton';

import SwitchNetworks from '../niceModals/cards/SwitchNetworks';
import { modalRegistry } from '../niceModals/RegisterModals';

import MeralList from './cards/MeralList';

const RegisterMerals = () => {
	const { address } = useUserAccount();
	const { availableMerals, pendingMerals, proxiedMerals } = useRegisterMerals();
	const { user } = useUser();
	const sendTx = useSendTx();
	const { contractMeralManager } = useMeralManagerContract();

	const { chainId } = useChain();
	let isLayer2 = getIsLayer2(chainId);

	const toggle = async () => {
		// modal.remove();
	};

	const selectAndToggle = async (id) => {
		console.log('hi', id);
		await submitRegisterMeral(id);
		// TODO
	};

	const submitRegisterMeral = async (id) => {
		let _meral;
		availableMerals.forEach((meral) => {
			if (meral.meralId === id) {
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
					maxFeePerGas: BigNumber.from('30000000000'),
					maxPriorityFeePerGas: BigNumber.from('30000000000'),
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

	const styleBG = {
		backgroundColor: 'black',
		backgroundImage: "url('https://ethemerals-media.s3.amazonaws.com/webapp/portal_bg.jpg'",
		backgroundRepeat: 'no-repeat',
		backgroundAttachment: 'fixed',
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		position: 'fixed',
		width: '100vw',
		height: '100vh',
		zIndex: '-1',
	};

	return (
		<>
			<div style={styleBG}></div>
			<div style={{ minWidth: '512px', maxWidth: '832px' }} className="pt-24 mb-96 w-4/5 mx-auto text-black">
				<div className="p-4">
					<h2 className="bg-white bg-opacity-50">Register and Mint Polygon Proxy Meral</h2>
					<div className="py-4">
						<div className="py-4 bg-white bg-opacity-50">
							<p>Short description about Registering your meral and minting the proxy, gas free!</p>
							<p>Transend to Layer2... etc</p>
						</div>

						<div className="my-2 py-2 bg-white bg-opacity-50">
							<h2 className="">Available to Register:</h2>
							{isLayer2 && availableMerals && <MeralList nfts={availableMerals} select={selectAndToggle} />}
							<div className="py-4">
								{!user && <LoginButton />}
								{!isLayer2 && <SwitchNetworks message={`Switch your Network to ${getOtherLayerChainName(chainId)}`} />}
							</div>
						</div>
						<div className="my-2 py-2 bg-white bg-opacity-50">
							<h2>Pending Validation:</h2>
							{pendingMerals && <MeralList nfts={pendingMerals} select={selectAndToggle} />}
						</div>
						<div className="my-2 py-2 bg-white bg-opacity-50">
							<h2>Minted Proxied Merals:</h2>
							{proxiedMerals && <MeralList nfts={proxiedMerals} select={selectAndToggle} />}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default RegisterMerals;
