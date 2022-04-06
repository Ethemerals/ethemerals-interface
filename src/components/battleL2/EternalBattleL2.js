import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getPriceFeeds } from '../../constants/PriceFeedsL2';
import PriceTracker from './cards/PriceTracker';

import StakesActive from './cards/StakesActive';
import StakesRecord from './cards/StakesRecord';

const EternalBattleL2 = () => {
	let { id } = useParams();

	if (!id) {
		id = 0;
	}

	const priceFeeds = getPriceFeeds();
	const priceFeed = priceFeeds[id];

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const styleBG = {
		backgroundColor: 'gray',
		backgroundImage: "url('https://ethemerals-media.s3.amazonaws.com/webapp/battle_bg2.jpg'",
		// backgroundImage: 'linear-gradient(to bottom, #29323c, #485563)',
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
			<div style={{ minWidth: '900px', maxWidth: '900px' }} className="pt-20 mb-64 mx-auto text-black">
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

				<PriceTracker priceFeed={priceFeed} cryptoName={priceFeed.baseName.toLowerCase()} />
				<StakesActive priceFeed={priceFeed} />
				<StakesRecord priceFeed={priceFeed} />

				<div className="h-96"></div>
			</div>
		</>
	);
};

export default EternalBattleL2;
