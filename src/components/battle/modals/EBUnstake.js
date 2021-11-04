import { useState, useEffect } from 'react';
import TimeAgo from 'react-timeago';
import { useEternalBattleGetChange, useEternalBattleGetStake } from '../../../hooks/useEternalBattle';

import { useNFTUtils } from '../../../hooks/useNFTUtils';
import Spinner from '../../Spinner';
import NFTInventoryCard from '../../NFTInventoryCard';

import { useSendTx } from '../../../hooks/TxContext';
import { useReadyToTransact } from '../../../hooks/Web3Context';

import WaitingConfirmation from '../../modals/WaitingConfirmation';
import ErrorDialogue from '../../modals/ErrorDialogue';

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export const formatPrice = (price) => {
	const formatConfig = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	});

	return formatConfig.format(price);
};

const EBUnstake = ({ nft, toggle, contractBattle, priceFeed }) => {
	const { scoreChange } = useEternalBattleGetChange(contractBattle, nft.id);
	const { stake } = useEternalBattleGetStake(contractBattle, nft.id);

	const { getSubclassBonus } = useNFTUtils();

	const [scoreCalculated, setScoreCalculated] = useState(undefined);
	const [rewardsCalculated, setRewardsCalculated] = useState(undefined);

	const sendTx = useSendTx();
	const readyToTransact = useReadyToTransact();

	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isErrorOpen, setIsErrorOpen] = useState(false);

	const [errorMsg, setErrorMsg] = useState('');

	let statBonus = getSubclassBonus(nft.metadata.subClass);
	let baseStats = [nft.atk - nft.atkBonus - statBonus[0], nft.def - nft.defBonus - statBonus[1], nft.spd - nft.spdBonus - statBonus[2]];

	useEffect(() => {
		if (scoreChange) {
			let currentScore = parseInt(nft.score);
			let changeScore = parseInt(scoreChange.score);
			let resultScore = scoreChange.win ? currentScore + changeScore : currentScore - changeScore;
			setScoreCalculated(resultScore);

			let currentRewards = parseInt(nft.rewards);
			let changeRewards = parseInt(scoreChange.rewards);
			let resultRewards = scoreChange.win ? currentRewards + changeRewards : currentRewards;
			setRewardsCalculated(resultRewards);
		}
	}, [scoreChange, nft]);

	const toggleConfirmation = () => {
		setIsConfirmationOpen(!isConfirmationOpen);
	};

	const toggleError = () => {
		setIsErrorOpen(!isErrorOpen);
	};

	const onSubmitUnStake = async () => {
		if (contractBattle && readyToTransact()) {
			setIsConfirmationOpen(true);

			try {
				let id = nft.id;
				const gasEstimate = await contractBattle.estimateGas.cancelStake(id);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractBattle.cancelStake(id, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'cancel stake', true, [`nft_${id}`, 'account_eternalBattle', 'account', 'core']);
			} catch (error) {
				setIsErrorOpen(true);
				setErrorMsg('Transfer transaction rejected from user wallet');
				console.log(`${error.data} \n${error.message}`);
			}
			setIsConfirmationOpen(false);
			toggle();
		} else {
			// connect
			console.log('no wallet');
		}
	};

	return (
		<>
			<div className="w-full h-full fixed flex justify-center z-30 top-0 left-0">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 bg-opacity-50 bg-black"></div>
				<div className="w-96 h-96 center border-gray-400 rounded tracking-wide shadow-xl bg-gray-50 text-black">
					<div className="flex items-center justify-end">
						<span onClick={toggle} className="cursor-pointer px-4 py-2 text-gray-900 hover:text-gray-600">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
								<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
							</svg>
						</span>
					</div>
					<NFTInventoryCard nft={nft} stats={baseStats} showBase={true} showChange={false} />

					<div className="text-black w-full p-2 flex items-end text-center justify-center text-sm">
						{stake && scoreChange ? (
							<div>
								<h4 className="text-lg font-bold mt-2">Entry Details</h4>

								<p>
									<span>{nft.actions[0].long ? 'LONG @ ' : 'SHORT @ '} </span>
									{(parseFloat(stake.startingPrice) / 10 ** priceFeed.decimals).toFixed(priceFeed.decimalPlaces)}
								</p>
								<p>
									<span>{`Staked ${stake.positionSize} HP `}</span>
									<TimeAgo date={new Date(nft.actions[0].timestamp * 1000).toLocaleString()} />
								</p>

								<h4 className="text-lg font-bold mt-2">Results</h4>
								<p>
									<span>HP:</span>
									<span className="pl-1">{`${clamp(scoreCalculated, 0, 1000)} `}</span>
									<span className={`text-xs ${scoreChange.win ? 'text-green-800' : 'text-red-800'}`}>
										{scoreChange.win ? `(+${parseInt(scoreChange.score)})` : `(-${parseInt(scoreChange.score)})`}
									</span>
								</p>
								<p>
									<span>ELF:</span>
									<span className="pl-1">{`${clamp(rewardsCalculated, 0, 100000000)} `}</span>
									<span className={`text-xs ${scoreChange.win ? 'text-green-800' : 'text-red-800'}`}>{scoreChange.win ? `(+${parseInt(scoreChange.rewards)})` : ``}</span>
								</p>
							</div>
						) : (
							<Spinner color="text-gray-300" size="h-24 w-24" margin="py-2" />
						)}
					</div>

					<button
						onClick={onSubmitUnStake}
						className="flex justify-center mt-2 mx-auto bg-green-700 text-white text-lg text-bold px-4 py-1 rounded-lg shadow-lg hover:bg-green-500 transition duration-300"
					>
						Leave the Battle
					</button>
				</div>
			</div>
			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message={`Return ${nft.metadata.coin} from Battle!`} />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</>
	);
};

export default EBUnstake;
