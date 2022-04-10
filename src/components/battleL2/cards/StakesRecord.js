import { useHistoryStakes } from '../../../hooks/useEternalBattleL2';
import HistoryMeral from './HistoryMeral';

const StakesRecord = ({ priceFeed }) => {
	const { historyLongs, historyShorts } = useHistoryStakes(priceFeed.id);

	return (
		<div className="mt-32">
			<h2 className="text-4xl text-white">History</h2>
			<div className=" grid grid-cols-2 mt-8 items-start">
				<div style={{ minHeight: '128px' }} className="border-white border rounded-md mr-2 py-6 pt-2 bg-gray-400 bg-opacity-70">
					<p style={{ transform: 'translate(0px, -28px)' }} className="text-white text-sm font-bold flex items-center justify-between">
						<span style={{ textShadow: '1px 1px 0px #000' }}>LONGS</span>
					</p>

					<div className="m-4 mt-10">{historyLongs && historyLongs.map((stake) => <HistoryMeral key={stake.id} priceFeed={priceFeed} stake={stake} />)}</div>
				</div>

				<div style={{ minHeight: '128px' }} className=" border-white border rounded-md ml-2 py-6 pt-2 bg-gray-400 bg-opacity-70">
					<p style={{ transform: 'translate(0px, -28px)' }} className="text-white text-sm font-bold flex items-center justify-between">
						<span style={{ textShadow: '1px 1px 0px #000' }}>SHORTS</span>
					</p>

					<div className="m-4 mt-10">{historyShorts && historyShorts.map((stake) => <HistoryMeral key={stake.id} priceFeed={priceFeed} stake={stake} />)}</div>
				</div>
			</div>
		</div>
	);
};
export default StakesRecord;
