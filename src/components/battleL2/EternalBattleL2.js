import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import EternalBattleCard from './cards/EternalBattleCard';
import EBattleHelp from '../battle/EBattleHelp';
import { useChain } from 'react-moralis';
import { getIsLayer2, getOtherLayerChainName } from '../../utils/contracts/parseChainId';
import NetworksButton from '../navigation/NetworksButton';
import { getPriceFeeds } from '../../constants/PriceFeedsL2';
import PairTrackerCard from './cards/PriceTrackerCard';

const EternalBattleL2 = () => {
	let { id } = useParams();
	const history = useHistory();
	const { chainId } = useChain();
	const isLayer2 = getIsLayer2(chainId);
	const priceFeeds = getPriceFeeds();

	if (!id) {
		id = 0;
	}

	const priceFeed = priceFeeds[id];

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

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
				<div className="flex justify-between mt-24 items-start">
					<div style={{ minHeight: '256px' }} className="text-center w-1/2 border-white border rounded-md mr-4 py-8 bg-white bg-opacity-20">
						<div className="bg-white mx-24 py-2 rounded"> Join {priceFeed.baseName} In Battle</div>
					</div>
					<div style={{ minHeight: '512px' }} className="text-center w-1/2 border-white border rounded-md ml-4 py-8 bg-white bg-opacity-20">
						<div className="bg-white mx-24 py-2 rounded"> Join {priceFeed.quoteName} In Battle</div>
					</div>
				</div>
				<div className="h-96"></div>
			</div>
		</>
	);
};

export default EternalBattleL2;
