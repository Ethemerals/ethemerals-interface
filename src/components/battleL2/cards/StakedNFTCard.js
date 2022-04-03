import { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

import { useUserAccount } from '../../../hooks/useUser';
import { useEternalBattleL1GetChange, useEternalBattleL1GetStake } from '../../../hooks/useEternalBattleL1';
import { useEBAddScoreContext, useEBNftsRegisterContext } from '../../../context/EternalBattleContext';

import { useMeralsUtils } from '../../../hooks/useMeralsUtils';
import { useMeralImagePaths } from '../../../hooks/useMerals';
import Spinner from '../../Spinner';

import SVGRevive from '../svg/SVGRevive';
import SVGUnstake from '../svg/SVGUnstake';

import EBDetails from '../modals/EBDetails';

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const StakedNFTCard = ({ nft, contractBattle, priceFeed, long }) => {
	const { account } = useUserAccount();
	const { scoreChange } = useEternalBattleL1GetChange(contractBattle, nft.id);
	const { stake } = useEternalBattleL1GetStake(contractBattle, nft.id);
	const updateScore = useEBAddScoreContext();
	const registerNFT = useEBNftsRegisterContext();

	const { elements } = useMeralsUtils();
	const { meralImagePaths } = useMeralImagePaths(nft);

	const [isOwned, setIsOwned] = useState(false);

	const [isDetailsOpen, setIsDetailsOpen] = useState(false);

	const [scoreCalculated, setScoreCalculated] = useState(undefined);
	const [rewardsCalculated, setRewardsCalculated] = useState(undefined);

	const toggleDetails = () => {
		setIsDetailsOpen(!isDetailsOpen);
	};

	useEffect(() => {
		if (account) {
			if (nft.previousOwner.id === account.id) {
				setIsOwned(true);
			}
		}
	}, [account, nft]);

	useEffect(() => {
		registerNFT(nft);
	}, [nft, registerNFT]);

	useEffect(() => {
		if (scoreChange && stake) {
			let currentScore = parseInt(nft.hp);
			let changeScore = parseInt(scoreChange.score);
			let resultScore = scoreChange.win ? currentScore + changeScore : currentScore - changeScore;
			setScoreCalculated(resultScore);
			updateScore(priceFeed.id, nft, currentScore, changeScore, resultScore, scoreChange.win, long, stake.positionSize);

			let currentRewards = parseInt(nft.elf);
			let changeRewards = parseInt(scoreChange.rewards);
			let resultRewards = scoreChange.win ? currentRewards + changeRewards : currentRewards;
			setRewardsCalculated(resultRewards);
		}
	}, [scoreChange, nft, long, updateScore, priceFeed, stake]);

	if (!meralImagePaths) {
		return null;
	}

	const bgImg = meralImagePaths.preview;

	return (
		<>
			<div
				onClick={toggleDetails}
				style={{ backgroundColor: elements[nft.element].color, width: '280px' }}
				className="flex h-74 mb-1 mx-1 cursor-pointer hover:shadow-xl  opacity-90 hover:opacity-100 transition duration-300"
			>
				<div className="relative overflow-hidden">
					<img style={{ objectFit: 'contain' }} width="74" height="74" src={bgImg} alt="" />
					<span className="text-xs font-bold text-white z-10 bg-black bg-opacity-50 w-full absolute bottom-0 text-left">#{nft.id.padStart(4, '0')}</span>
				</div>

				<div style={{ width: '214px' }} className="bg-white">
					<h4 style={{ backgroundColor: elements[nft.element].color }} className="font-bold text-md uppercase pl-1 overflow-hidden whitespace-nowrap">
						{nft.coin}
					</h4>
					<div className="text-black w-full px-1 text-xs flex items-end font-bold">
						{stake && scoreChange ? (
							<div>
								<p>
									<span className="text-gray-500 font-light">STAKED HP:</span> <span>{stake.positionSize}</span>
								</p>
								<p>
									<span className="text-gray-500 font-light">HP:</span>
									<span className="pl-1">{`${clamp(scoreCalculated, 0, 1000)} `}</span>
									<span className={`text-xs ${scoreChange.win ? 'text-green-800' : 'text-red-800'}`}>
										{scoreChange.win ? `(+${parseInt(scoreChange.score)})` : `(-${parseInt(scoreChange.score)})`}
									</span>
								</p>
								<p>
									<span className="text-gray-500 font-light">ELF:</span>
									<span className="pl-1">{`${clamp(rewardsCalculated, 0, 100000000)} `}</span>
									<span className={`text-xs ${scoreChange.win ? 'text-green-800' : 'text-red-800'}`}>{scoreChange.win ? `(+${parseInt(scoreChange.rewards)})` : ``}</span>
								</p>
							</div>
						) : (
							<Spinner color="text-gray-300" size="h-12 w-12" margin="py-2" />
						)}

						<div className="flex-grow"></div>
						<div className="flex">
							{isOwned && (
								<>
									<button data-tip data-for="ttUnstake" className="mr-1 text-green-500 hover:text-green-700 cursor-pointer transition duration-300">
										<SVGUnstake />
									</button>

									<ReactTooltip id="ttUnstake" type="success" effect="solid">
										<span>Leave Battle</span>
									</ReactTooltip>
								</>
							)}

							<>
								<button data-tip data-for="ttRevive" className={`text-yellow-500 mr-1 opacity-10 ${scoreCalculated <= 25 ? 'opacity-100 cursor-pointer transition duration-300' : ''}`}>
									<SVGRevive />
								</button>

								<ReactTooltip id="ttRevive" type="warning" effect="solid">
									<span>Revive Meral!</span>
								</ReactTooltip>
							</>
						</div>
					</div>
				</div>
			</div>

			{isDetailsOpen && <EBDetails nft={nft} toggle={toggleDetails} priceFeed={priceFeed} contractBattle={contractBattle} isOwned={isOwned} />}
		</>
	);
};

export default StakedNFTCard;
