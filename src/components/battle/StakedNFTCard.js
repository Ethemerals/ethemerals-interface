import { useState, useEffect } from 'react';
import useUserAccount from '../../hooks/useUserAccount';
import EternalBattleStatus from '../modals/actions/EternalBattleStatus';

import { useEternalBattleGetChange, useEternalBattleGetStake } from '../../hooks/useEternalBattle';

import { useNFTUtils } from '../../hooks/useNFTUtils';
import { useMeralImagePaths } from '../../hooks/useMeralImagePaths';
import Spinner from '../Spinner';

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const RewardsFormatted = ({ nft, scoreChange }) => {
	let currentRewards = parseInt(nft.rewards);
	let changeRewards = parseInt(scoreChange.rewards);
	let result = scoreChange.win ? currentRewards + changeRewards : currentRewards;

	return (
		<>
			<span className="text-gray-600">ELF:</span>
			<span className="pl-1">{`${clamp(result, 0, 100000000)} `}</span>
			<span className={`text-xs ${scoreChange.win ? 'text-green-800' : 'text-red-800'}`}>{scoreChange.win ? `(+${changeRewards})` : ``}</span>
		</>
	);
};

const ScoreFormatted = ({ nft, scoreChange }) => {
	let currentScore = parseInt(nft.score);
	let changeScore = parseInt(scoreChange.score);
	let result = scoreChange.win ? currentScore + changeScore : currentScore - changeScore;

	return (
		<>
			<span className="text-gray-600">HP:</span>
			<span className="pl-1">{`${clamp(result, 0, 1000)} `}</span>
			<span className={`text-xs ${scoreChange.win ? 'text-green-800' : 'text-red-800'}`}>{scoreChange.win ? `(+${changeScore})` : `(-${changeScore})`}</span>
		</>
	);
};

const StakedNFTCard = ({ nft, contractBattle, contractPriceFeed, priceFeed }) => {
	const { account } = useUserAccount();
	const { scoreChange } = useEternalBattleGetChange(contractBattle, nft.id);
	const { stake } = useEternalBattleGetStake(contractBattle, nft.id);

	const { elements } = useNFTUtils();
	const { meralImagePaths } = useMeralImagePaths(nft.id);

	const [isOwned, setIsOwned] = useState(false);
	const [isUnstakeOpen, setIsUnstakeOpen] = useState(false);

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

				<div style={{ width: '214px' }} className="bg-white bg-opacity-80">
					<h4 style={{ backgroundColor: elements[nft.bgId].color }} className="font-bold text-md uppercase pl-1 overflow-hidden whitespace-nowrap">
						{nft.metadata.coin}
					</h4>
					<div className="text-black w-full px-2 text-xs flex">
						{stake && scoreChange ? (
							<div>
								<p>
									<span className="text-gray-600">SIZE:</span> <span>{stake.positionSize}</span>
								</p>
								<p>
									<ScoreFormatted nft={nft} scoreChange={scoreChange} />
								</p>
								<p>
									<RewardsFormatted nft={nft} scoreChange={scoreChange} />
								</p>
							</div>
						) : (
							<Spinner />
						)}

						<div className="flex-grow"></div>
						<div>...</div>
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
