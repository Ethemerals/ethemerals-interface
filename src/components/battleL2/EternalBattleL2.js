import NiceModal from '@ebay/nice-modal-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import EBattleHelp from '../battle/EBattleHelp';

import { useChain } from 'react-moralis';
import { getIsLayer2, getOtherLayerChainName } from '../../utils/contracts/parseChainId';
import NetworksButton from '../navigation/NetworksButton';
import { getPriceFeeds } from '../../constants/PriceFeedsL2';
import PairTrackerCard from './cards/PriceTrackerCard';
import { modalRegistry } from '../niceModals/RegisterModals';
import { useActiveStakes } from '../../hooks/useEternalBattleL2';
import MeralThumbnail from '../ethemerals/cards/MeralThumbnail';

const EternalBattleL2 = () => {
	let { id } = useParams();

	if (!id) {
		id = 0;
	}

	const priceFeeds = getPriceFeeds();
	const priceFeed = priceFeeds[id];

	const { activeStakes } = useActiveStakes(priceFeed.id);

	const { chainId } = useChain();
	const isLayer2 = getIsLayer2(chainId);

	const [activeLongs, setActiveLongs] = useState(undefined);
	const [activeShorts, setActiveShorts] = useState([undefined]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		if (activeStakes && activeStakes.length > 0) {
			let longs = [];
			let shorts = [];
			activeStakes.forEach((stake) => {
				if (stake.long) {
					longs.push(stake);
				} else {
					shorts.push(stake);
				}
			});
			setActiveLongs(longs);
			setActiveShorts(shorts);
		}
	}, [activeStakes]);

	const onSubmitChoose = async (long) => {
		NiceModal.show(modalRegistry.ebChoose, { priceFeed, long });
	};

	const select = async (id) => {
		console.log(id);
	};

	const styleBG = {
		backgroundColor: 'gray',
		backgroundImage: "url('https://ethemerals-media.s3.amazonaws.com/webapp/battle_bg.jpg'",
		backgroundRepeat: 'no-repeat',
		backgroundAttachment: 'fixed',
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		position: 'fixed',
		width: '100vw',
		height: '100vh',
		zIndex: '-1',
	};

	return (
		<>
			<div style={styleBG} className=""></div>
			<div style={{ minWidth: '900px', maxWidth: '900px' }} className="pt-28 mb-96 mx-auto text-black">
				{/* <EBattleHelp /> */}
				{!isLayer2 && (
					<div className="flex items-center space-x-2 justify-center">
						<div className="text-red-600 text-2xl">{`Switch your Network to ${getOtherLayerChainName(chainId)}`}</div>
						<NetworksButton />
					</div>
				)}

				{/* <div style={{ border: '1px solid lightblue' }} className="flex items-center mx-auto mt-2 py-4 justify-center bg-white rounded bg-opacity-80">
					<span className="text-xs px-2 text-blue-900">MARKETS</span>
					{priceFeeds &&
						priceFeeds.map((feed) => {
							return (
								<div
									key={feed.cmId}
									onClick={() => history.push(`/battle/poly/${feed.id}`)}
									style={{ border: '1px solid lightblue' }}
									className={`${
										parseInt(id) === feed.id ? 'text-gray-600 bg-blue-100' : 'text-blue-500 hover:bg-blue-200 transition duration-300 cursor-pointer'
									} text-xs font-bold py-1 px-2 focus:outline-none flex items-center `}
								>
									<img style={{ width: '18px', height: '18px' }} src={feed.logo} alt="" />
									<span className="ml-2">{feed.ticker}</span>
								</div>
							);
						})}
				</div> */}

				<PairTrackerCard priceFeed={priceFeed} cryptoName={priceFeed.baseName.toLowerCase()} />

				{/* ACTIVE */}
				<div className=" grid grid-cols-2 mt-24 items-start">
					<div style={{ minHeight: '256px' }} className="border-white border rounded-md mr-2 py-8 bg-green-100 bg-opacity-30">
						<div onClick={() => onSubmitChoose(true)} className="bg-white w-56 mx-auto py-2 rounded text-center shadow-md cursor-pointer hover:bg-blue-200">
							Join {priceFeed.baseName} In Battle
						</div>
						<div className="flex-wrap flex gap-6 m-2">
							{activeLongs &&
								activeLongs.map((stake) => {
									if (stake && stake.meral) {
										return <MeralThumbnail key={stake.meral.meralId} nft={stake.meral} select={select} />;
									}
								})}
						</div>
					</div>
					<div style={{ minHeight: '256px' }} className=" border-white border rounded-md ml-2 py-8 bg-red-100 bg-opacity-30">
						<div onClick={() => onSubmitChoose(false)} className="bg-white w-56 mx-auto py-2 rounded text-center shadow-md cursor-pointer hover:bg-blue-200">
							Join {priceFeed.quoteName} In Battle
						</div>
						<div className="flex-wrap flex gap-6 m-2">
							{activeShorts &&
								activeShorts.map((stake) => {
									if (stake && stake.meral) {
										return <MeralThumbnail key={stake.meral.meralId} nft={stake.meral} select={select} />;
									}
								})}
						</div>
					</div>
				</div>

				{/* RECORD */}
				<div style={{ minHeight: '128px' }} className="bg-white w-full mt-44 p-4 flex rounded-md bg-opacity-90">
					<p>History:</p>
				</div>

				<div className="h-96"></div>
			</div>
		</>
	);
};

export default EternalBattleL2;
