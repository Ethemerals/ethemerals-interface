import { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { useMeralImagePaths } from '../../../hooks/useMeralData';
import { useNFTUtils } from '../../../hooks/useNFTUtils';

import { getOnsenChange } from '../../../hooks/useOnsen';

import { useUserAccount } from '../../../hooks/useUser';

import Spinner from '../../Spinner';
import OnsenUnstake from '../actions/OnsenUnstake';

// import SVGRevive from './svg/SVGRevive';
// import SVGUnstake from './svg/SVGUnstake';

// import EBDetails from './modals/EBDetails';

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const StakedOnsenCard = ({ nft, contractOnsen }) => {
	const { account } = useUserAccount();
	const { elements } = useNFTUtils();

	const { meralImagePaths } = useMeralImagePaths(nft.id);

	const [isOwned, setIsOwned] = useState(false);
	const [rewardsChange, setRewardsChange] = useState(undefined);
	const [scoreChange, setScoreChange] = useState(undefined);

	useEffect(() => {
		if (account) {
			if (nft.previousOwner.id === account.id) {
				setIsOwned(true);
			}
		}
	}, [account, nft]);

	useEffect(() => {
		if (nft) {
			let now = Math.floor(Date.now() / 1000);
			let { rewards, score } = getOnsenChange(now, nft.actions[0].timestamp, nft);
			if (score + parseInt(nft.score) >= 1000) {
				score = 1000 - nft.score;
				console.log('hi');
			}
			console.log(rewards, score);
			setRewardsChange(rewards);
			setScoreChange(score);
		}
	}, [nft]);

	if (!meralImagePaths) {
		return null;
	}

	const bgImg = meralImagePaths.thumbnail;

	return (
		<>
			<div style={{ backgroundColor: elements[nft.bgId].color, width: '280px' }} className="flex h-74 mb-1 mx-1 cursor-pointer hover:shadow-xl  opacity-90 hover:opacity-100 transition duration-300">
				<div className="relative">
					<img width="74" height="74" src={bgImg} alt="" />
					<span className="text-xs font-bold text-white z-10 bg-black bg-opacity-50 w-full absolute bottom-0 text-left">#{nft.id.padStart(4, '0')}</span>
				</div>

				<div style={{ width: '214px' }} className="bg-white">
					<h4 style={{ backgroundColor: elements[nft.bgId].color }} className="font-bold text-md uppercase pl-1 overflow-hidden whitespace-nowrap">
						{nft.metadata.coin}
					</h4>
					<div className="text-black w-full px-1 text-xs flex items-end font-bold">
						{nft ? (
							<div>
								<p>
									<span className="text-gray-500 font-light">HP:</span>
									<span className="pl-1">{parseInt(nft.score) + scoreChange}</span>
									<span className="text-xs text-green-800">{` (+${parseInt(scoreChange)})`}</span>
								</p>
								<p>
									<span className="text-gray-500 font-light">ELF:</span>
									<span className="pl-1">{parseInt(nft.rewards) + rewardsChange}</span>
									<span className="text-xs text-green-800">{` (+${parseInt(rewardsChange)})`}</span>
								</p>
							</div>
						) : (
							<Spinner color="text-gray-300" size="h-12 w-12" margin="py-2" />
						)}

						<div className="flex-grow"></div>
						<div className="flex">{isOwned && <OnsenUnstake contractOnsen={contractOnsen} tokenId={nft.id} />}</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default StakedOnsenCard;
