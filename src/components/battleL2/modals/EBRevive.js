import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Links } from '../../../constants/Links';
import { useUser } from '../../../hooks/useUser';
import MeralThumbnail from '../../ethemerals/cards/MeralThumbnail';
import { modalRegistry } from '../../niceModals/RegisterModals';
import CloseButton from './CloseButton';

import ReviveWings from '../svg/SVGReviveWings';
import { useEternalBattleL2Contract } from '../../../hooks/useEternalBattleL2';
import { useSendTx } from '../../../context/TxContext';
import { useGetLayerDetails } from '../../../hooks/useWeb3';
import { useGetGasprice } from '../../../hooks/useGetGas';

export default NiceModal.create(({ meral, priceFeed, stake }) => {
	const { address } = useUser();
	const { contractBattle } = useEternalBattleL2Contract();
	const { isLayer2, otherLayerName } = useGetLayerDetails();
	const { maxPriorityFeePerGas, maxFeePerGas } = useGetGasprice(true);
	const sendTx = useSendTx();

	const modal = useModal();

	const toggle = () => {
		modal.remove();
	};

	const selectAndToggle = async (id) => {
		console.log(id);
	};

	const onSwitchNetwork = () => {
		NiceModal.show(modalRegistry.chooseNetworks);
	};

	const onSubmitRevive = async () => {
		if (address && contractBattle) {
			NiceModal.show(modalRegistry.waitingForSignature, { message: `Revive ${stake.meral.name ? stake.meral.name : `#${stake.meral.tokenId}`} from Battle!` });
			try {
				let id = stake.meral.meralId;
				let userTokenId = meral.meralId;
				const gasEstimate = await contractBattle.estimateGas.reviveToken(id, userTokenId);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractBattle.reviveToken(id, userTokenId, { gasLimit, maxPriorityFeePerGas, maxFeePerGas });
				console.log(tx);

				sendTx(tx.hash, 'Revived Meral', true, [
					`nft_${id}`,
					`meral_${id}`,
					`getActiveStakes_${priceFeed.id}`,
					`account_${address}`,
					`account_${address}_subgraphL2`,
					`getHistoryStakes_${priceFeed.id}`,
				]);
			} catch (error) {
				NiceModal.remove(modalRegistry.waitingForSignature);
				console.log(`${error.data} \n${error.message}`);
			}
			toggle();
		} else {
			console.log('no wallet');
		}
	};

	return (
		<>
			<div onClick={toggle} className="fixed left-0 top-0 w-screen h-screen bg-black bg-opacity-30 z-30"></div>
			<div className="w-512 h-512 fixed center rounded-xl shadow-xl bg-white z-50 overflow-hidden">
				<div className="flex justify-end">
					<CloseButton toggle={toggle} />
				</div>

				{/* HEADER */}
				<div className="px-4">
					<p className="text-4xl font-light">Revive Meral</p>
					<p className="text-xs text-blue-400 hover:text-blue-600 cursor-pointer">
						<a href={Links.DISCORD} target="blank" rel="noreferrer">
							Need Help? Join our discord for more information
						</a>
					</p>
				</div>

				{/* CONTENT */}
				<div style={{ bottom: '-36px' }} className="h-96 w-full absolute">
					<h2 className="text-sm text-gray-800 px-4">
						REVIVE <span className="uppercase">{stake && stake.meral.name ? stake.meral.name : stake.meral.tokenId}</span> FROM BATTLE!
					</h2>
					<div style={{ borderTop: '1px solid skyblue' }} className="h-80 overflow-auto bg-blue-50 pt-2">
						<div className="flex justify-center my-4 mx-2">
							<div className="mx-6">{stake && stake.meral && <MeralThumbnail key={stake.meral.meralId} nft={stake.meral} select={selectAndToggle} />}</div>
							<ReviveWings />
							<div className="mx-6">{meral && <MeralThumbnail key={meral.meralId} nft={meral} select={selectAndToggle} />}</div>
						</div>
						{stake && meral && (
							<div className="text-center text-sm text-gray-800">
								<p>{`${stake.meral.name ? stake.meral.name : `#${stake.meral.tokenId}`} has collapsed in Battle! Use ${meral.name ? meral.name : `#${meral.tokenId}`} to revive her.`}</p>
								<p>{`Your Meral will extract 500 ELF from ${stake.meral.name ? stake.meral.name : `#${stake.meral.tokenId}`}... as a reward 🥰`}</p>
								{isLayer2 && (
									<button
										onClick={onSubmitRevive}
										className={'bg-yellow-100 border-yellow-200 text-yellow-900	transition duration-300 hover:bg-white shadow border rounded-lg px-6 py-1 mt-8 text-lg uppercase'}
									>
										REVIVE {stake.meral.name ? stake.meral.name : `#${stake.meral.tokenId}`}
									</button>
								)}
								{!isLayer2 && (
									<button
										onClick={onSwitchNetwork}
										className={'bg-yellow-100 border-yellow-200 text-yellow-900	transition duration-300 hover:bg-white shadow border rounded-lg px-6 py-1 mt-8 text-lg uppercase'}
									>
										SWITCH NETWORK TO {otherLayerName}
									</button>
								)}
							</div>
						)}
					</div>
					<div style={{ backgroundColor: 'skyblue', height: '44px' }}></div>
				</div>
			</div>
		</>
	);
});
