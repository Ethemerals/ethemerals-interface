import { useState, useEffect } from 'react';
import TimeAgo from 'react-timeago';
import { useEternalBattleGetChange, useEternalBattleGetStake } from '../../../hooks/useEternalBattle';

import { useNFTUtils } from '../../../hooks/useNFTUtils';
import Spinner from '../../Spinner';
import NFTInventoryCard from '../../NFTInventoryCard';

import { useMeralImagePaths } from '../../../hooks/useMeralImagePaths';

import { useSendTx } from '../../../hooks/TxContext';
import { useReadyToTransact } from '../../../hooks/Web3Context';
import { shortenAddress } from '../../../utils';

import useUserAccount from '../../../hooks/useUserAccount';
import WaitingConfirmation from '../../modals/WaitingConfirmation';
import ErrorDialogue from '../../modals/ErrorDialogue';

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const MeralThumbnail = ({ nft }) => {
	const { meralImagePaths } = useMeralImagePaths(nft.id);

	if (!meralImagePaths) {
		return null;
	}
	const bgImg = meralImagePaths.thumbnail;
	return <img width="74" height="74" src={bgImg} alt="meral thumbnail" />;
};

const EBDetails = ({ nft, toggle, contractBattle, priceFeed, isOwned }) => {
	const { mainIndex, userNFTs, account } = useUserAccount();
	const { scoreChange } = useEternalBattleGetChange(contractBattle, nft.id);
	const { stake } = useEternalBattleGetStake(contractBattle, nft.id);

	const { getSubclassBonus } = useNFTUtils();

	const [scoreCalculated, setScoreCalculated] = useState(undefined);
	const [rewardsCalculated, setRewardsCalculated] = useState(undefined);
	const [dead, setDead] = useState(false);

	const [reviverNFT, setReviverNFT] = useState(undefined);

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

			if (resultScore <= 25) {
				setDead(true);
			}
		}
	}, [scoreChange, nft]);

	useEffect(() => {
		if (userNFTs && userNFTs.length > 0) {
			setReviverNFT(userNFTs[mainIndex]);
		}
	}, [userNFTs, mainIndex]);

	const toggleConfirmation = () => {
		setIsConfirmationOpen(!isConfirmationOpen);
	};

	const toggleError = () => {
		setIsErrorOpen(!isErrorOpen);
	};

	const onSubmitRevive = async () => {
		if (contractBattle && readyToTransact()) {
			setIsConfirmationOpen(true);
			try {
				let id = nft.id;
				let userTokenId = userNFTs[mainIndex].id;
				const gasEstimate = await contractBattle.estimateGas.reviveToken(id, userTokenId);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractBattle.reviveToken(id, userTokenId, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, `Revived #${id} Ethemeral`, true, [`nft_${id}`, 'account_eternalBattle', 'account', 'core']);
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
				<div className="w-420 center border-gray-400 rounded tracking-wide shadow-xl bg-gray-50 text-black">
					<div className="flex items-center justify-end">
						<span onClick={toggle} className="cursor-pointer px-4 py-2 text-gray-900 hover:text-gray-600">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
								<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
							</svg>
						</span>
					</div>
					<NFTInventoryCard nft={nft} stats={baseStats} showBase={true} showChange={false} />

					{/* DETAILS */}

					{stake && scoreChange ? (
						<div className="text-black w-full h-28 justify-center text-sm grid grid-cols-2 m-6">
							<div className="">
								<h4 className="text-gray-500">ENTRY DETAILS</h4>
								<p className="">Owner: {shortenAddress(nft.previousOwner.id, 3)}</p>
								<p>Pair: {priceFeed.ticker}</p>
								<p>
									<span>{nft.actions[0].long ? 'LONG @ ' : 'SHORT @ '} </span>
									{(parseFloat(stake.startingPrice) / 10 ** priceFeed.decimals).toFixed(priceFeed.decimalPlaces)}
								</p>

								<p>
									<TimeAgo date={new Date(nft.actions[0].timestamp * 1000).toLocaleString()} />
								</p>
							</div>
							<div>
								<h4 className="text-gray-500">CURRENT RESULT</h4>
								<p>
									<span>{`Staked ${stake.positionSize} HP `}</span>
								</p>
								<p>
									<span>HP:</span>
									<span className="pl-1">{`${clamp(scoreCalculated, 0, 1000)} `}</span>
									<span className={`text-xs ${scoreChange.win ? 'text-green-800' : 'text-red-800'}`}>
										{scoreChange.win ? `(+${parseInt(scoreChange.score)})` : `(-${parseInt(scoreChange.score)})`}
									</span>
								</p>
								<p>
									<span>ELF:</span>
									<span className="pl-1">{`${clamp(rewardsCalculated, 0, 1000000)} `}</span>
									<span className={`text-xs ${scoreChange.win ? 'text-green-800' : 'text-red-800'}`}>{scoreChange.win ? `(+${parseInt(scoreChange.rewards)})` : ``}</span>
								</p>
							</div>
						</div>
					) : (
						<div className="flex justify-center w-full h-28 my-6">
							<Spinner color="text-gray-300" size="h-24 w-24" margin="py-2" />
						</div>
					)}

					{/* REVIVE */}
					{dead && !isOwned && (
						<>
							<div style={{ borderWidth: '0 0 1px 0' }} className="border-0 border-black w-full"></div>
							<div className="m-6 text-sm h-36">
								{account && userNFTs && userNFTs.length > 0 && reviverNFT ? (
									<>
										<div className="flex items-start">
											<div>
												<p>
													<strong>{nft.metadata.coin}</strong> has collapsed in Battle! <br></br>
													Use your <strong>{reviverNFT.metadata.coin}</strong> Meral to revive her.
												</p>

												<p className="text-gray-600 text-xs my-2">Your Meral will extract 500 ELF from {nft.metadata.coin} ... as a reward 🥰</p>
											</div>

											{reviverNFT && <MeralThumbnail nft={reviverNFT} />}
										</div>

										<button
											onClick={onSubmitRevive}
											className="flex justify-center mt-2 mx-auto bg-yellow-400 text-white text-lg text-bold px-4 py-1 shadow-md hover:shadow-lg hover:bg-yellow-300 transition duration-300"
										>
											Revive
										</button>
									</>
								) : (
									<>
										<p>
											<strong>{nft.metadata.coin}</strong> has collapsed in Battle! <br></br>
											Use your Meral to Revive her and she will reward the reviver with 500 ELF 🥰
										</p>

										<p className="text-gray-600 text-xs mt-2">(You have no active Merals or you a not connected)</p>
									</>
								)}
							</div>
						</>
					)}

					{/* LEAVE */}
					{isOwned && (
						<div className="mb-10">
							{dead && <p className="text-gray-600 text-center text-sm px-4 pb-2">Leave now or risk getting revived by another Meral!</p>}
							<button
								onClick={onSubmitUnStake}
								className="flex justify-center mt-2 mx-auto bg-green-700 text-white text-lg text-bold px-4 py-1 rounded-lg shadow-lg hover:bg-green-500 transition duration-300"
							>
								Leave the Battle
							</button>
						</div>
					)}
				</div>
			</div>
			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message={`Revive ${nft.metadata.coin} from Battle!`} />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</>
	);
};

export default EBDetails;