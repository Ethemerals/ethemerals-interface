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

	const onSubmitChoose = async () => {
		NiceModal.show(modalRegistry.changeCollection);
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
			NiceModal.show(modalRegistry.waitingForSignature, { message: `Virtualizating Meral for Polygon Mint` });
			try {
				const gasEstimate = await contractMeralManager.estimateGas.registerMeral(
					Addresses.Ethemerals,
					_meral.tokenId,
					_meral.cmId,
					_meral.elf,
					_meral.hp,
					_meral.atk,
					_meral.def,
					_meral.spd,
					_meral.element,
					_meral.subclass
				);
				const gasLimit = gasEstimate.add(gasEstimate.div(8));

				const tx = await contractMeralManager.registerMeral(
					Addresses.Ethemerals,
					_meral.tokenId,
					_meral.cmId,
					_meral.elf,
					_meral.hp,
					_meral.atk,
					_meral.def,
					_meral.spd,
					_meral.element,
					_meral.subclass,
					{
						gasLimit,
						maxFeePerGas: BigNumber.from('30000000000'),
						maxPriorityFeePerGas: BigNumber.from('30000000000'),
					}
				);

				console.log(tx);
				sendTx(tx.hash, 'Register Meral', true, [
					`account_${address}`,
					`account_${address}_getAvailableMerals`,
					`account_${address}_getPendingMerals`,
					`account_${address}_getProxiedMerals`,
					`account_${address}_getVerifiedMerals`,
					`nft_${id}`,
					`meral_${id}`,
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
			<h2 style={{ textShadow: '1px 1px 0px slateblue' }} className="mt-8 pb-0 text-base font-bold text-white p-4">
				AVAILABLE TO BE VIRTUALIZED:
			</h2>
			<div style={styleBoxshadow} className="bg-white p-4 pb-8 rounded-md">
				<div className="flex items-baseline pb-2">
					<h3 className="text-4xl">ETHEMERALS</h3>
					<span className="flex-grow"></span>

					<div
						onClick={onSubmitChoose}
						style={{ transform: 'translate(0px, -8px)', paddingTop: '3px', paddingBottom: '3px' }}
						className="px-4 text-xs font-bold flex items-center shadow cursor-pointer relative rounded-md border-blue-400 border text-blue-400 hover:text-blue-600 transition 300"
					>
						<span>CHANGE COLLECTION</span>
						<div style={{ top: '-4px', right: '-4px' }} className="animate-ping bg-blue-500 rounded-full w-2 h-2 absolute"></div>
						<div style={{ top: '-4px', right: '-4px' }} className="bg-blue-500 rounded-full w-2 h-2 absolute"></div>
					</div>
					{/* <span className="text-xs text-blue-600 hover:text-blue-400 cursor-pointer">Missing a collection? Send an integration request here</span> */}
				</div>

				<div className="bg-gray-100 rounded-md py-4">
					{user && isLayer2 && availableMerals && (
						<>
							<p className="text-sm text-gray-700 pb-4 text-center">Select a NFT to Virtualize (transform into a Meral):</p>
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
				{user && !isLayer2 && (
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
