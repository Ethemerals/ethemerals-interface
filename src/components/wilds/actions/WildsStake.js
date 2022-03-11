import NiceModal from '@ebay/nice-modal-react';
import { useState, useEffect } from 'react';
import { useSendTx } from '../../../context/TxContext';

import { useUserAccount } from '../../../hooks/useUser';
import { modalRegistry } from '../../niceModals/RegisterModals';

const WildsStake = ({ contractWilds, landId }) => {
	const { mainIndex, userNFTs } = useUserAccount();

	const sendTx = useSendTx();

	const [userNFT, setUserNFT] = useState(undefined);

	useEffect(() => {
		if (userNFTs && userNFTs.length > 0 && mainIndex >= 0) {
			let _userNFT = userNFTs[mainIndex];
			setUserNFT(_userNFT);
		}
	}, [userNFTs, mainIndex]);

	const handleStake = async (stakeAction) => {
		if (contractWilds) {
			NiceModal.show(modalRegistry.waitingForSignature, { message: `Send ${userNFT.metadata.coin} to Battle!` });
			try {
				let id = userNFT.id;

				const gasEstimate = await contractWilds.estimateGas.stake(landId, id, stakeAction);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractWilds.stake(landId, id, stakeAction, { gasLimit });
				console.log(tx);

				sendTx(tx.hash, 'create stake', true, [`nft_${id}`, 'account', 'user', `land_${landId}`, 'lands']);
			} catch (error) {
				NiceModal.remove(modalRegistry.waitingForSignature);
				console.log(`${error.data} \n${error.message}`);
			}
			setIsConfirmationOpen(false);
		} else {
			console.log('no wallet');
		}
	};

	return (
		<>
			<h4 className="font-bold">Land Actions:</h4>
			<div className="flex space-x-3 text-sm">
				<button onClick={() => handleStake(1)} className=" bg-gray-600 px-2 shadow text-white py-1 hover:bg-green-600 hover:shadow-lg transition duration-300">
					SETUP CAMP
				</button>
				<button onClick={() => handleStake(2)} className=" bg-gray-600 px-2 shadow text-white py-1 hover:bg-green-600 hover:shadow-lg transition duration-300">
					LOOT
				</button>
				<button onClick={() => handleStake(3)} className=" bg-gray-600 px-2 shadow text-white py-1 hover:bg-green-600 hover:shadow-lg transition duration-300">
					BIRTH EGGS
				</button>
				<button onClick={() => handleStake(4)} className=" bg-gray-600 px-2 shadow text-white py-1 hover:bg-green-600 hover:shadow-lg transition duration-300">
					RAID
				</button>
			</div>
		</>
	);
};

export default WildsStake;
