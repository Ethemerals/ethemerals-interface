import { useEffect, useState } from 'react';
import NiceModal from '@ebay/nice-modal-react';

import ReactTooltip from 'react-tooltip';
import { modalRegistry } from '../../niceModals/RegisterModals';
import { useEternalBattleL2GetChange } from '../../../hooks/useEternalBattleL2';
import MeralThumbnail from '../../ethemerals/cards/MeralThumbnail';
import { useMeralsUtils } from '../../../hooks/useMeralsUtils';
import { clamp, formatPrice, shortenAddress } from '../../../utils';

import SVGRevive from '../svg/SVGRevive';
import SVGUnstake from '../svg/SVGUnstake';

import { animated, useSpring, config } from '@react-spring/web';
import { formatDistance } from 'date-fns';
import { useUserAccount } from '../../../hooks/useUser';

const SpinnerSVG = ({ size }) => (
	<svg className="animate-spin-slow text-brandColor" width={size} height={size} viewBox="0 0 304 304" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g opacity="1">
			<path
				d="M152 304C68.0527 304 0 235.947 0 152C0 68.0527 68.0527 0 152 0L152 10.6431C73.9306 10.6431 10.6429 73.9308 10.6429 152C10.6429 230.069 73.9306 293.357 152 293.357C230.069 293.357 293.357 230.069 293.357 152L304 152C304 235.947 235.947 304 152 304Z"
				fill="currentColor"
			/>
		</g>
	</svg>
);

const StakedMeral = ({ priceFeed, stake }) => {
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
		if (scoreChange && !Number.isNaN(scoreChange) && stake && !isLoading) {
			let currentScore = parseInt(meral.hp);
			let changeScore = parseInt(scoreChange.score);
			let resultScore = scoreChange.win ? currentScore + changeScore : currentScore - changeScore;
			setScoreCalculated(resultScore);

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
	}, [scoreChange, stake]);

	const select = async (id) => {
		console.log(id);
	};

	const onSubmitRevive = async () => {
		if (isOwned) {
			onSubmitUnstake();
		}
		if (!isOwned && scoreCalculated <= 25) {
			let subtext = 'Which Meral will you use to be the Reviver?';
			let modalOptions = { priceFeed, stake, subtext };
			NiceModal.show(modalRegistry.ebChoose, { modalToShow: modalRegistry.ebRevive, modalOptions });
		}
	};

	const onSubmitUnstake = async () => {
		if (isOwned) {
			NiceModal.show(modalRegistry.ebUnstake, { stake, priceFeed, timeAgo, scoreCalculated, rewardsCalculated });
		}
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
		<div className="w-full flex just-center relative my-3">
			<MeralThumbnail nft={meral} select={select} />
			<div className="w-full h-24 bg-gray-200 mb-8 rounded-r-lg shadow-lg overflow-hidden">
				<div className="text-md px-4 text-white" style={{ backgroundColor: elements[meral.element].color1 }}>
					{meral.name.toUpperCase()}
				</div>
				{!scoreChange ? (
					<div className="ml-5 my-5">
						<SpinnerSVG size={32} />
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
								<span>ENTRY PRICE: </span>
								<span className="text-black"> {formatPrice(parseFloat(stake.startingPrice) / 10 ** priceFeed.decimals, 2)}</span>
							</p>

							{!Number.isNaN(scoreCalculated) && scoreChange && (
								<p>
									<span>HP:</span>
									<span className="pl-1 text-black">{`${clamp(scoreCalculated, 0, meral.maxHp)} `}</span>
									<span className={`text-xs ${scoreChange.win ? 'text-green-800' : 'text-red-800'}`}>
										{scoreChange.win ? `(+${parseInt(scoreChange.score)})` : `(-${parseInt(scoreChange.score)})`}
									</span>
								</p>
							)}
							{!scoreCalculated && (
								<p className="flex items-center">
									<span>HP:</span>
									<span className="ml-2">
										<SpinnerSVG size={16} />
									</span>
								</p>
							)}
							<p>
								<span>ELF:</span>
								<span className="pl-1 text-black">{`${clamp(rewardsCalculated, 0, 100000000)} `}</span>
								<span className={`text-xs ${scoreChange.win ? 'text-green-800' : 'text-red-800'}`}>{scoreChange.win ? `(+${parseInt(scoreChange.rewards)})` : ``}</span>
							</p>
						</animated.div>
					</>
				)}
			</div>
			<div onClick={() => setIsHovered(!isHovered)} className="absolute w-56 h-24 left-26 top-0 cursor-pointer"></div>
			<div className="flex absolute bottom-10 right-1">
				{isOwned && (
					<>
						<button onClick={onSubmitUnstake} data-tip data-for="ttUnstake" className="mr-1 text-green-500 hover:text-green-700 cursor-pointer transition duration-300">
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
						// disabled={scoreCalculated >= 25}
						data-tip
						data-for={scoreCalculated <= 25 && isOwned ? 'ttLiquidate' : 'ttRevive'}
						className={`text-yellow-500 mr-1 opacity-10 ${scoreCalculated <= 25 ? 'opacity-100 cursor-pointer transition duration-300' : ''}`}
					>
						<SVGRevive />
					</button>

					<ReactTooltip id="ttLiquidate" type="warning" effect="solid">
						<span>Warning! Your Meral is subject to Liquidation</span>
					</ReactTooltip>
					<ReactTooltip id="ttRevive" type="warning" effect="solid">
						<span>Revive Meral!</span>
					</ReactTooltip>
				</>
			</div>
		</div>
	);
};

export default StakedMeral;
