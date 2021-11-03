import { useState, useEffect } from 'react';
import useUserAccount from '../../hooks/useUserAccount';
import EternalBattleStatus from './modals/EternalBattleStatus';

import { useEternalBattleGetChange, useEternalBattleGetStake } from '../../hooks/useEternalBattle';

import { useNFTUtils } from '../../hooks/useNFTUtils';
import { useMeralImagePaths } from '../../hooks/useMeralImagePaths';
import Spinner from '../Spinner';

import SVGDetail from './svg/SVGDetail';
import SVGRevive from './svg/SVGRevive';
import SVGUnstake from './svg/SVGUnstake';

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const StakedNFTCard = ({ nft, contractBattle, contractPriceFeed, priceFeed }) => {
	const { account } = useUserAccount();
	const { scoreChange } = useEternalBattleGetChange(contractBattle, nft.id);
	const { stake } = useEternalBattleGetStake(contractBattle, nft.id);

	const { elements } = useNFTUtils();
	const { meralImagePaths } = useMeralImagePaths(nft.id);

	const [isOwned, setIsOwned] = useState(false);
	const [isUnstakeOpen, setIsUnstakeOpen] = useState(false);

	const [scoreCalculated, setScoreCalculated] = useState(undefined);
	const [rewardsCalculated, setRewardsCalculated] = useState(undefined);

	const toggleUnstake = () => {
		setIsUnstakeOpen(!isUnstakeOpen);
	};

	useEffect(() => {
		if (account) {
			if (nft.previousOwner.id === account.id) {
				setIsOwned(true);
			}
		}
	}, [account, nft]);

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

	if (!meralImagePaths) {
		return null;
	}

	const bgImg = meralImagePaths.thumbnail;

	return (
		<>
			<div style={{ backgroundColor: elements[nft.bgId].color, width: '280px' }} className="flex h-74 mb-1 mx-1">
				<div className="relative">
					<img width="74" height="74" src={bgImg} alt="meral thumbnail" />
					<span className="text-xs font-bold text-white z-10 bg-black bg-opacity-50 w-full absolute bottom-0 text-left">#{nft.id.padStart(4, '0')}</span>
				</div>

				<div style={{ width: '214px' }} className="bg-white">
					<h4 style={{ backgroundColor: elements[nft.bgId].color }} className="font-bold text-md uppercase pl-1 overflow-hidden whitespace-nowrap">
						{nft.metadata.coin}
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
							<Spinner />
						)}

						<div className="flex-grow"></div>
						<div className="flex">
							{isOwned && (
								<span className="mr-1 text-indigo-400 hover:text-indigo-600 cursor-pointer transition duration-300">
									<SVGUnstake />
								</span>
							)}
							{!isOwned && (
								<span className={`text-yellow-400 mr-1 opacity-10 ${scoreCalculated < 25 ? 'opacity-100  hover:text-yellow-600 cursor-pointer transition duration-300' : ''}`}>
									<SVGRevive />
								</span>
							)}

							<span className="text-blue-300 hover:text-blue-500 cursor-pointer transition duration-300">
								<SVGDetail />
							</span>
						</div>
					</div>
				</div>
				{/* <button onClick={toggleUnstake} className="px-2 text-sm text-right text-gray-300 hover:text-white">
					{isOwned && <span className="mr-2">✅</span>}
					status
				</button> */}
			</div>

			{isUnstakeOpen && <EternalBattleStatus contractPriceFeed={contractPriceFeed} priceFeed={priceFeed} nft={nft} toggle={toggleUnstake} isOwned={isOwned} />}
		</>
	);
};

export default StakedNFTCard;
