import NiceModal from '@ebay/nice-modal-react';
import ReactTooltip from 'react-tooltip';
import { useSendTx } from '../../../context/TxContext';
import { modalRegistry } from '../../niceModals/RegisterModals';

import SVGUnstake from '../svg/SVGUnstake';

const WildsUnstake = ({ contractWilds, landId, tokenId, canLeave }) => {
	const sendTx = useSendTx();

	const handleUnstake = async () => {
		if (contractWilds) {
			NiceModal.show(modalRegistry.waitingForSignature, { message: `Leave ${tokenId} from Battle!` });
			try {
				let id = tokenId;
				const gasEstimate = await contractWilds.estimateGas.unstake(id);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractWilds.unstake(id, { gasLimit });
				console.log(tx);

				sendTx(tx.hash, 'leave stake', true, [`land_${landId}`, `meral_${id}`, `nft_${id}`, 'account', 'user', 'lands']);
			} catch (error) {
				NiceModal.remove(modalRegistry.waitingForSignature);
				console.log(`${error.data} \n${error.message}`);
			}
		} else {
			console.log('no wallet');
		}
	};

	return (
		<div>
			<button
				onClick={handleUnstake}
				data-tip
				data-for="ttUnstake"
				className={`mr-1 text-green-500 opacity-10 ${canLeave ? 'opacity-100 hover:text-green-700 cursor-pointer transition duration-300' : ''}`}
			>
				<SVGUnstake />
			</button>

			<ReactTooltip id="ttUnstake" type="success" effect="solid">
				<span>Leave Battle</span>
			</ReactTooltip>
		</div>
	);
};

export default WildsUnstake;
