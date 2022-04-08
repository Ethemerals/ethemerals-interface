import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import NiceModal from '@ebay/nice-modal-react';
import PriceFeeds from '../../constants/PriceFeeds';
import EternalBattleCard from './EternalBattleCard';
import EBattleHelp from './EBattleHelp';

import { useGetLayerDetails } from '../../hooks/useWeb3';
import { modalRegistry } from '../niceModals/RegisterModals';

const EternalBattleL1 = () => {
	const { isLayer2, otherLayerName } = useGetLayerDetails();

	let { id } = useParams();
	if (!id) {
		id = 0;
	}
	const history = useHistory();

	const onSwitchNetwork = () => {
		NiceModal.show(modalRegistry.chooseNetworks);
	};

	let priceFeedId = parseInt(id);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="overscroll-y-auto overflow-scroll scrollbar_pad">
			<div className="page_bg"></div>
			<EBattleHelp />
			{isLayer2 && (
				<div onClick={onSwitchNetwork} className="rounded bg-blue-100 w-96 mx-auto flex items-center space-x-2 mt-4 justify-center">
					<div className="">{`Switch your Network to ${otherLayerName}`}</div>
				</div>
			)}

			<div className="flex items-center mx-auto mt-2 sm:mt-20 text-sm sm:text-base justify-center">
				<span className="text-xs font-bold px-2 text-blue-900">MARKETS</span>

				<button
					onClick={() => history.push(`/battle/mainnet/0`)}
					className={`${priceFeedId === 0 ? 'bg-blue-900 text-white' : 'bg-blue-300 hover:bg-blue-400 transition duration-300'} py-1 px-2 mx-1 focus:outline-none`}
				>
					{PriceFeeds[0].ticker}
				</button>
				<button
					onClick={() => history.push(`/battle/mainnet/1`)}
					className={`${priceFeedId === 1 ? 'bg-blue-900 text-white' : 'bg-blue-300 hover:bg-blue-400 transition duration-300'} py-1 px-2 mx-1 focus:outline-none`}
				>
					{PriceFeeds[1].ticker}
				</button>
			</div>

			<EternalBattleCard key={priceFeedId} priceFeed={PriceFeeds[priceFeedId]} />
			<div className="h-96"></div>
		</div>
	);
};

export default EternalBattleL1;
