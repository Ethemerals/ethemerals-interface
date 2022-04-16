import { useHistory } from 'react-router';
import { useActiveStakesCount } from '../../../hooks/useEternalBattleL2';

const Collections = ({ priceFeed, toggle }) => {
	const history = useHistory();
	const { longs, shorts } = useActiveStakesCount(priceFeed.id);

	const onSelect = () => {
		history.push(`/battle/poly/${priceFeed.id - 1}`);
		toggle();
	};

	return (
		<div onClick={onSelect} className=" bg-white shadow-md mt-4 rounded cursor-pointer hover:shadow-lg transition 300">
			<div className="flex items-center space-x-2 relative p-4">
				<img style={{ width: '24px', height: '24px', marginRight: '8px' }} src={priceFeed.logo} alt={``} />
				<span>{`${priceFeed.baseSymbol} / ${priceFeed.quoteSymbol}`}</span>
				<span className="flex-grow"></span>
				<div className="text-xs text-right text-gray-300">
					<p>
						LONGS: <span className="text-green-800">{longs}</span>
					</p>
					<p>
						SHORTS: <span className="text-red-800">{shorts}</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Collections;
