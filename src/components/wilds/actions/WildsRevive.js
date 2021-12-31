import ReactTooltip from 'react-tooltip';
import { useState, useEffect } from 'react';
import { useSendTx } from '../../../context/TxContext';
import { useWildsContract } from '../../../hooks/useWilds';
import ErrorDialogue from '../../modals/ErrorDialogue';
import WaitingConfirmation from '../../modals/WaitingConfirmation';

import SVGUnstake from '../svg/SVGUnstake';
import SVGRevive from '../svg/SVGRevive';
import useUserAccount from '../../../hooks/useUserAccount';

const WildsRevive = ({ contractWilds, landId, tokenId, canKiss }) => {
	const { mainIndex, userNFTs, account } = useUserAccount();
	const sendTx = useSendTx();

	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isErrorOpen, setIsErrorOpen] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const [userNFT, setUserNFT] = useState(undefined);

	useEffect(() => {
		if (userNFTs && userNFTs.length > 0 && mainIndex >= 0) {
			let _userNFT = userNFTs[mainIndex];
			setUserNFT(_userNFT);
		}
	}, [userNFTs, mainIndex]);

	const toggleConfirmation = () => {
		setIsConfirmationOpen(!isConfirmationOpen);
	};

	const toggleError = () => {
		setIsErrorOpen(!isErrorOpen);
	};

	const handleDeathKiss = async () => {
		if (contractWilds) {
			setIsConfirmationOpen(true);
			try {
				let id = tokenId;
				let deathId = userNFT.id;

				const gasEstimate = await contractWilds.estimateGas.deathKiss(id, deathId);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractWilds.deathKiss(id, deathId, { gasLimit });
				console.log(tx);

				sendTx(tx.hash, 'death kiss', true, [`land_${landId}`, `nft_${id}`, `nft_${deathId}`, 'account', 'lands']);
			} catch (error) {
				setIsErrorOpen(true);
				setErrorMsg('Transfer transaction rejected from user wallet');
				console.log(`${error.data} \n${error.message}`);
			}
			setIsConfirmationOpen(false);
			// toggle();
		} else {
			// connect
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

			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message={`Leave ${tokenId} from Battle!`} />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</div>
	);
};

export default WildsRevive;
