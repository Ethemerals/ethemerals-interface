import NiceModal from '@ebay/nice-modal-react';

import { modalRegistry } from '../../niceModals/RegisterModals';
import { useActiveStakes } from '../../../hooks/useEternalBattleL2';

import StakedMeral from './StakedMeral';

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const StakesActive = ({ priceFeed }) => {
	const onSubmitChoose = async (long) => {
		NiceModal.show(modalRegistry.ebChoose, { priceFeed, long });
	};

	const { activeLongs, activeShorts } = useActiveStakes(priceFeed.id);

	const select = async (id) => {
		console.log(id);
	};

	const styleStakeButton = {
		// background: 'rgb(32,32,32)' /* fallback for old browsers */,
		// background: 'linear-gradient(0deg, rgba(36,36,36,1) 0%, rgba(92,92,94,1) 58%, rgba(125,131,133,1) 86%, rgba(183,189,190,1) 100%)',
		color: 'black',
		width: '128px',
		cursor: 'pointer',
		borderRadius: '2px',
		textAlign: 'center',
		marginLeft: 'auto',
		marginRight: 'auto',
		paddingTop: '4px',
		paddingBottom: '4px',
	};

	return (
		<div className=" grid grid-cols-2 mt-20 items-start">
			<div style={{ minHeight: '256px' }} className="border-gray-400 border rounded-md mr-2 py-6 bg-gray-800 bg-opacity-70">
				<p style={{ transform: 'translate(0px, -44px)' }} className="text-white text-sm font-bold">
					LONGS
				</p>
				<div style={styleStakeButton} onClick={() => onSubmitChoose(true)} className="font-bold shadow-md hover:text-gray-900 bg-white hover:bg-blue-400 transition duration-200">
					Join {priceFeed.baseSymbol}
				</div>
				<div className="m-4 mt-10">{activeLongs && activeLongs.map((stake) => <StakedMeral key={stake.meral.meralId} priceFeed={priceFeed} stake={stake} select={select} />)}</div>
			</div>
			<div style={{ minHeight: '256px' }} className=" border-gray-400 border rounded-md ml-2 py-6 bg-gray-800 bg-opacity-70">
				<p style={{ transform: 'translate(0px, -44px)' }} className="text-white text-sm font-bold">
					SHORTS
				</p>
				<div style={styleStakeButton} onClick={() => onSubmitChoose(false)} className="font-bold shadow-md hover:text-gray-900 bg-white hover:bg-blue-400 transition duration-200">
					Join {priceFeed.quoteSymbol}
				</div>
				<div className="m-4 mt-10">{activeShorts && activeShorts.map((stake) => <StakedMeral key={stake.meral.meralId} priceFeed={priceFeed} stake={stake} select={select} />)}</div>
			</div>
		</div>
	);
};
export default StakesActive;
