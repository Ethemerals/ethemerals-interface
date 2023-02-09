import { useEffect } from 'react';
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
		backgroundColor: '#434e5c',
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
				<PriceTracker priceFeed={priceFeed} cryptoName={priceFeed.baseName.toLowerCase()} />
				<StakesActive priceFeed={priceFeed} />
				<StakesRecord priceFeed={priceFeed} />

				<div className="h-96"></div>
			</div>
		</>
	);
};

export default EternalBattleL2;
