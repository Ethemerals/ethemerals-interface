import NiceModal from '@ebay/nice-modal-react';
import ReactTooltip from 'react-tooltip';
import { useState, useEffect } from 'react';
import { useSendTx } from '../../../context/TxContext';

import SVGRevive from '../svg/SVGRevive';
import { useUserAccount } from '../../../hooks/useUser';
import { modalRegistry } from '../../niceModals/RegisterModals';

const WildsRevive = ({ contractWilds, landId, tokenId, canKiss }) => {
	const { mainIndex, userNFTs } = useUserAccount();
	const sendTx = useSendTx();

	const [userNFT, setUserNFT] = useState(undefined);

	useEffect(() => {
		if (userNFTs && userNFTs.length > 0 && mainIndex >= 0) {
			let _userNFT = userNFTs[mainIndex];
			setUserNFT(_userNFT);
		}
	}, [userNFTs, mainIndex]);

	const handleDeathKiss = async () => {
		if (contractWilds) {
			NiceModal.show(modalRegistry.waitingForSignature, { message: `Leave ${tokenId} from Battle!` });
			try {
				let id = tokenId;
				let deathId = userNFT.id;

				const gasEstimate = await contractWilds.estimateGas.deathKiss(id, deathId);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractWilds.deathKiss(id, deathId, { gasLimit });
				console.log(tx);

				sendTx(tx.hash, 'death kiss', true, [`land_${landId}`, `nft_${id}`, `nft_${deathId}`, 'account', 'lands']);
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
			<button onClick={handleDeathKiss} data-tip data-for="ttRevive" className={`text-yellow-500 mr-1 opacity-10 ${canKiss ? 'opacity-100 cursor-pointer transition duration-300' : ''}`}>
				<SVGRevive />
			</button>

			<ReactTooltip id="ttRevive" type="warning" effect="solid">
				<span>Revive Meral!</span>
			</ReactTooltip>
		</div>
	);
};

export default WildsRevive;
