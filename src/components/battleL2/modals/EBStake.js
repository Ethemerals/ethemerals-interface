import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { BigNumber } from 'ethers';
import { useSendTx } from '../../../context/TxContext';
import { useEternalBattleL2Contract } from '../../../hooks/useEternalBattleL2';
import { useUser } from '../../../hooks/useUser';
import MeralThumbnail from '../../ethemerals/cards/MeralThumbnail';
import { modalRegistry } from '../../niceModals/RegisterModals';
import CloseButton from './CloseButton';

export default NiceModal.create(({ meral, priceFeed, long }) => {
	const { address } = useUser();
	const { contractBattle } = useEternalBattleL2Contract();
	const sendTx = useSendTx();

	const modal = useModal();

	const toggle = () => {
		modal.remove();
	};

	const selectAndToggle = async (id) => {
		await onSubmitStake(id);
	};

	const onSubmitStake = async (id) => {
		if (address && contractBattle) {
			NiceModal.show(modalRegistry.waitingForSignature, { message: `Send ${meral.name} to Battle! ${long ? 'LONG' : 'SHORT'}  ${priceFeed.ticker}` });
			try {
				let pricefeedId = priceFeed.id;
				let position = 1000;

				const gasEstimate = await contractBattle.estimateGas.createStake(id, pricefeedId.toString(), position.toString(), long);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractBattle.createStake(id, pricefeedId, position, long, { gasLimit, maxFeePerGas: BigNumber.from('30000000000'), maxPriorityFeePerGas: BigNumber.from('30000000000') });
				console.log(tx);

				sendTx(tx.hash, 'create stake', true, [`nft_${id}`, `account_${address}`, `account_${address}_subgraphL2`]);
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

				{/* STAKE */}
				<div className="px-4">
					<p className="text-4xl font-light">Enter the Battle</p>
					{meral && <MeralThumbnail key={meral.meralId} nft={meral} select={selectAndToggle} />}
				</div>
			</div>
		</>
	);
});
