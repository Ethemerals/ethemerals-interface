import { useEffect, useState } from 'react';
import NiceModal from '@ebay/nice-modal-react';

import ReactTooltip from 'react-tooltip';
import { modalRegistry } from '../../niceModals/RegisterModals';
import { useEternalBattleL2GetChange } from '../../../hooks/useEternalBattleL2';
import MeralThumbnail from '../../ethemerals/cards/MeralThumbnail';
import { useMeralsUtils } from '../../../hooks/useMeralsUtils';
import { formatPrice, shortenAddress } from '../../../utils';

import SVGRevive from '../svg/SVGRevive';
import SVGUnstake from '../svg/SVGUnstake';
import Spinner from '../../Spinner';

import { animated, useSpring, config } from '@react-spring/web';
import { formatDistance } from 'date-fns';
import { useUserAccount } from '../../../hooks/useUser';

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const StakedMeral = ({ priceFeed, stake, select }) => {
	let meral = stake.meral;
	const { elements } = useMeralsUtils();
	const { address } = useUserAccount();
	const { scoreChange, isLoading } = useEternalBattleL2GetChange(meral.meralId);
	const [isHovered, setIsHovered] = useState(false);
	const [scoreCalculated, setScoreCalculated] = useState(undefined);
	const [rewardsCalculated, setRewardsCalculated] = useState(undefined);
	const [timeAgo, setTimeAgo] = useState('');

	const [isOwned, setIsOwned] = useState(false);

	useEffect(() => {
		if (stake && address) {
			if (stake.owner.id.toLowerCase() === address.toLowerCase()) {
				setIsOwned(true);
			}
		}
	}, [address, stake]);

	useEffect(() => {
		if (scoreChange && stake && !isLoading) {
			let currentScore = parseInt(meral.hp);
			let changeScore = parseInt(scoreChange.score);
			let resultScore = scoreChange.win ? currentScore + changeScore : currentScore - changeScore;
			setScoreCalculated(resultScore);
			// updateScore(priceFeed.id, nft, currentScore, changeScore, resultScore, scoreChange.win, long, stake.positionSize);

			let currentRewards = parseInt(meral.elf);
			let changeRewards = parseInt(scoreChange.rewards);
			let resultRewards = scoreChange.win ? currentRewards + changeRewards : currentRewards;
			setRewardsCalculated(resultRewards);
		}
	}, [scoreChange, isLoading, stake, meral]);

	useEffect(() => {
		if (scoreChange) {
			let now = new Date();
			let ago = new Date(parseInt(stake.timestamp * 1000));
			let _timeAgo = formatDistance(now, ago);
			setTimeAgo(_timeAgo);
		}
		return () => {
			setTimeAgo('');
		};
	}, [scoreChange]);

	const onSubmitRevive = async () => {
		NiceModal.show(modalRegistry.ebRevive, { id: meral.meralId });
	};

	const styleHover = useSpring({
		transform: isHovered ? `translate(0px, 5px)` : `translate(0px, 100px)`,
		config: config.stiff,
	});

	const styleHover2 = useSpring({
		transform: !isHovered ? `translate(0px, -45px)` : `translate(0px, 100px)`,
		config: config.stiff,
	});

	return (
		<div className="w-full flex just-center relative my-4">
			<MeralThumbnail nft={stake.meral} select={select} />
			<div className="w-full h-24 bg-gray-200 mb-8 rounded-r-lg shadow-lg overflow-hidden">
				<div className="text-md px-4 text-white" style={{ backgroundColor: elements[stake.meral.element].color1 }}>
					{stake.meral.name.toUpperCase()}
				</div>
				{!scoreChange ? (
					<div className="ml-4 text-xs my-1">
						<Spinner color="text-gray-300" size="h-12 w-12" margin="py-2" />
					</div>
				) : (
					<>
						<animated.div style={styleHover} className="ml-4 text-gray-500 text-xs my-1">
							<p>
								<span>OWNER: </span>
								<span className="text-black"> {shortenAddress(stake.owner.id, 3)}</span>
							</p>
							<p>
								<span>POSITION SIZE: </span>
								<span className="text-black">{stake.positionSize}</span>
							</p>
							<p>
								<span>STAKED:</span>

								<span className="pl-1 text-black">{timeAgo}</span>
							</p>
						</animated.div>
						<animated.div style={styleHover2} className="ml-4 text-gray-500 text-xs my-1">
							<p>
								<span>STARTING PRICE: </span>
								<span className="text-black"> {formatPrice(parseFloat(stake.startingPrice) / 10 ** priceFeed.decimals, 2)}</span>
							</p>
							<p>
								<span>HP:</span>
								<span className="pl-1 text-black">{`${clamp(scoreCalculated, 0, 1000)} `}</span>
								<span className={`text-xs ${scoreChange.win ? 'text-green-800' : 'text-red-800'}`}>{scoreChange.win ? `(+${parseInt(scoreChange.score)})` : `(-${parseInt(scoreChange.score)})`}</span>
							</p>
							<p>
								<span>ELF:</span>
								<span className="pl-1 text-black">{`${clamp(rewardsCalculated, 0, 100000000)} `}</span>
								<span className={`text-xs ${scoreChange.win ? 'text-green-800' : 'text-red-800'}`}>{scoreChange.win ? `(+${parseInt(scoreChange.rewards)})` : ``}</span>
							</p>
						</animated.div>
					</>
				)}
			</div>
			<div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="absolute w-44 h-24 left-26 top-0 cursor-pointer"></div>
			<div className="flex absolute bottom-10 right-1">
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
					<button
						onClick={onSubmitRevive}
						data-tip
						data-for="ttRevive"
						className={`text-yellow-500 mr-1 opacity-10 ${scoreCalculated <= 25 ? 'opacity-100 cursor-pointer transition duration-300' : ''}`}
					>
						<SVGRevive />
					</button>

					<ReactTooltip id="ttRevive" type="warning" effect="solid">
						<span>Revive Meral!</span>
					</ReactTooltip>
				</>
			</div>
		</div>
	);
};

export default StakedMeral;
