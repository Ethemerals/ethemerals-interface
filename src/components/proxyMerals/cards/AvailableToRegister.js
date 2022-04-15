import NiceModal from '@ebay/nice-modal-react';
import { BigNumber } from 'ethers';

import { Addresses } from '../../../constants/contracts/Addresses';
import { useSendTx } from '../../../context/TxContext';
import { useMeralManagerContract, useRegisterMerals } from '../../../hooks/useMeralManager';

import { useUser, useUserAccount } from '../../../hooks/useUser';
import { useGetLayerDetails } from '../../../hooks/useWeb3';

import ConnectButton from '../../navigation/ConnectButton';

import { modalRegistry } from '../../niceModals/RegisterModals';

import MeralList from './MeralList';

const AvailableToRegister = () => {
	const { address } = useUserAccount();
	const { availableMerals } = useRegisterMerals();
	const { user } = useUser();
	const sendTx = useSendTx();
	const { contractMeralManager } = useMeralManagerContract();

	const { isLayer2, otherLayerName } = useGetLayerDetails();

	const selectAndToggle = async (id) => {
		console.log('hi', id);
		await submitRegisterMeral(id);
		// TODO
	};

	const onSwitchNetwork = () => {
		NiceModal.show(modalRegistry.chooseNetworks);
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
					`account_${address}_getVerifiedMerals`,
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

	const styleBoxshadow = {
		boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.4)',
	};

	return (
		<div className="text-black w-full">
			<h2 className="mt-8 pb-2 text-xl text-white p-4">AVAILABLE TO REGISTER</h2>

			<div style={styleBoxshadow} className="bg-white p-4 pb-8 rounded-md">
				<div className="flex items-center py-2 pb-8">
					<span className="mr-4">NFT Collections:</span>
					<span className="mr-4 bg-blue-100 hover:bg-blue-50 text-blue-900 hover:text-blue-700 px-4 rounded-lg py-1 border-2 border-blue-400 cursor-pointer">Ethemerals</span>
					<span className="flex-grow"></span>
					<span className=" text-xs text-blue-600 hover:text-blue-400 cursor-pointer">Missing a collection? Send an integration request here</span>
				</div>
				<div className="bg-gray-100 rounded-md py-4">
					{user && isLayer2 && availableMerals && (
						<>
							<p className="text-xs text-center text-gray-600 pb-4">Click a NFT to register:</p>
							<MeralList nfts={availableMerals} select={selectAndToggle} />
						</>
					)}
					{user && isLayer2 && !availableMerals && <p className="text-xs text-center text-gray-600 pb-4">Found none</p>}
				</div>
				{!user && (
					<div className="py-4 max-w-max mx-auto">
						<ConnectButton />
					</div>
				)}
				{!isLayer2 && (
					<div className="py-4 max-w-max mx-auto">
						<button onClick={onSwitchNetwork} className="py-2 px-6 text-lg bg-brandColor hover:bg-yellow-400 text-white rounded-lg transition duration-300 flex items-center justify-center">
							Switch Network to {otherLayerName}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default AvailableToRegister;
