import { useHistory, useParams } from 'react-router-dom';

import PriceFeeds from '../constants/PriceFeeds';
import EternalBattleCard from '../components/battle/EternalBattleCard';
import EBattleHelp from '../components/battle/EBattleHelp';

const EternalBattle = () => {
	let { id } = useParams();
	if (!id) {
		id = 0;
	}
	const history = useHistory();

	let priceFeedId = parseInt(id);

	return (
		<div className="scrollbar_pad">
			<div className="page_bg"></div>
			<EBattleHelp />

			<div className="flex items-center mx-auto mt-2 sm:mt-20 text-sm sm:text-base justify-center">
				<span className="text-xs font-bold px-2 text-blue-900">MARKETS</span>

				<button
					onClick={() => history.push(`/battle/0`)}
					className={`${priceFeedId === 0 ? 'bg-blue-900' : 'bg-blue-300 hover:bg-blue-400 transition duration-300'} py-1 px-2 mx-1 focus:outline-none`}
				>
					{PriceFeeds[0].ticker}
				</button>
				<button
					onClick={() => history.push(`/battle/1`)}
					className={`${priceFeedId === 1 ? 'bg-blue-900' : 'bg-blue-300 hover:bg-blue-400 transition duration-300'} py-1 px-2 mx-1 focus:outline-none`}
				>
					{PriceFeeds[1].ticker}
				</button>
			</div>

			<EternalBattleCard key={priceFeedId} priceFeed={PriceFeeds[priceFeedId]} />
			<div className="h-96"></div>
		</div>
	);
};

export default EternalBattle;
