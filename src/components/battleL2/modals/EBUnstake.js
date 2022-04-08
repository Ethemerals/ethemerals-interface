import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Links } from '../../../constants/Links';
import { useUser } from '../../../hooks/useUser';
import MeralThumbnail from '../../ethemerals/cards/MeralThumbnail';
import { modalRegistry } from '../../niceModals/RegisterModals';
import CloseButton from './CloseButton';

import { useEternalBattleL2Contract, useEternalBattleL2GetChange } from '../../../hooks/useEternalBattleL2';
import { useSendTx } from '../../../context/TxContext';
import { useGetLayerDetails } from '../../../hooks/useWeb3';
import { clamp, formatPrice } from '../../../utils';

export default NiceModal.create(({ priceFeed, stake, timeAgo, scoreCalculated, rewardsCalculated }) => {
	const meral = stake.meral;

	const { address } = useUser();
	const { contractBattle } = useEternalBattleL2Contract();
	const { isLayer2, otherLayerName } = useGetLayerDetails();
	const { scoreChange, isLoading } = useEternalBattleL2GetChange(meral.meralId);

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
		toggle();
	};

	const onSubmitUnstake = async () => {
		if (address && contractBattle) {
			NiceModal.show(modalRegistry.waitingForSignature, { message: `Retrieve ${stake.meral.name ? stake.meral.name : `#${stake.meral.tokenId}`} from Battle!` });
			try {
				let id = meral.meralId;
				const gasEstimate = await contractBattle.estimateGas.cancelStake(id);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractBattle.cancelStake(id, { gasLimit });
				console.log(tx);

				sendTx(tx.hash, 'Retrieve Meral', true, [`nft_${id}`, `getActiveStakes_${priceFeed.id}`, `account_${address}`, `account_${address}_subgraphL2`]);
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
					<p className="text-4xl font-light">Leave The Battle</p>
					<p className="text-xs text-blue-400 hover:text-blue-600 cursor-pointer">
						<a href={Links.DISCORD} target="blank" rel="noreferrer">
							Need Help? Join our discord for more information
						</a>
					</p>
				</div>

				{/* CONTENT */}
				<div style={{ bottom: '-36px' }} className="h-96 w-full absolute">
					<h2 className="text-sm text-gray-800 px-4">
						RETRIEVE <span className="uppercase">{meral && meral.name ? meral.name : meral.tokenId}</span>
					</h2>
					<div style={{ borderTop: '1px solid skyblue' }} className="h-80 overflow-auto bg-blue-50 pt-2">
						<div className="flex justify-center my-4">
							<div className="mx-6">{meral && <MeralThumbnail key={meral.meralId} nft={meral} select={selectAndToggle} />}</div>
							<div className="w-60 text-base leading-5 text-gray-500">
								<div>
									<span className="text-xs">ENTRY PRICE: </span>
									<span className="pl-1 text-black"> {formatPrice(parseFloat(stake.startingPrice) / 10 ** priceFeed.decimals, 2)}</span>
								</div>
								<div>
									<span className="text-xs">POSITION SIZE: </span>
									<span className="pl-1 text-black"> {stake.positionSize}</span>
								</div>
								<div className="flex items-baseline">
									<span className="text-xs">STAKED: </span>
									<span className="pl-1 text-black">{timeAgo}</span>
								</div>
							</div>
						</div>

						<div className="text-center text-sm text-gray-800">
							<p className="text-blue-700">These results will be written to the history books!</p>
							<div className="flex items-center justify-center space-x-1 mt-1 text-base">
								{scoreCalculated ? (
									<>
										<span className="text-black">HP {`${clamp(scoreCalculated, 0, meral.maxHp)} `}</span>
										{scoreChange && (
											<span className={`${scoreChange.win ? 'text-green-800' : 'text-red-800'}`}>{scoreChange.win ? `(+${parseInt(scoreChange.score)})` : `(-${parseInt(scoreChange.score)})`}</span>
										)}
									</>
								) : (
									<span>...</span>
								)}
								<span className="w-2"></span>
								{rewardsCalculated ? (
									<>
										<span className="text-black">ELF {`${clamp(rewardsCalculated, 0, 100000000)} `}</span>
										{scoreChange && <span className={`${scoreChange.win ? 'text-green-800' : 'text-red-800'}`}>{scoreChange.win ? `(+${parseInt(scoreChange.rewards)})` : `(+0)`}</span>}
									</>
								) : (
									<span>...</span>
								)}
							</div>
							{isLayer2 && (
								<button
									onClick={onSubmitUnstake}
									className={'bg-yellow-100 border-yellow-200 text-yellow-900	transition duration-300 hover:bg-white shadow border rounded-lg px-6 py-1 mt-4 text-lg uppercase'}
								>
									RETRIEVE {meral.name ? meral.name : `#${meral.tokenId}`}
								</button>
							)}
							{!isLayer2 && (
								<button
									onClick={onSwitchNetwork}
									className={'bg-yellow-100 border-yellow-200 text-yellow-900	transition duration-300 hover:bg-white shadow border rounded-lg px-6 py-1 mt-4 text-lg uppercase'}
								>
									SWITCH NETWORK TO {otherLayerName}
								</button>
							)}
						</div>
					</div>
					<div style={{ backgroundColor: 'skyblue', height: '44px' }}></div>
				</div>
			</div>
		</>
	);
});
