import PriceFeeds from '../constants/PriceFeeds';
import EternalBattleCard from '../components/battle/EternalBattleCard';

const EternalBattle = () => {
	return (
		<div className="scrollbar_pad">
			<div className="page_bg"></div>

			{/* <div className="flex items-center mx-auto mt-2 sm:mt-10 text-sm sm:text-base justify-center">
				<button className={`bg-indigo-500 py-1 px-2 mx-1 rounded focus:outline-none`}>Eternal Battle</button>
				<button className={`bg-indigo-300 py-1 px-2 mx-1 rounded focus:outline-none cursor-default`}>Into The Wilds</button>
			</div> */}

			<EternalBattleCard priceFeed={PriceFeeds[0]} />
			<EternalBattleCard priceFeed={PriceFeeds[1]} />
			<div className="h-96"></div>
		</div>
	);
};

export default EternalBattle;
