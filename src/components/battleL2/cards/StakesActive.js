import NiceModal from '@ebay/nice-modal-react';
import { useState, useEffect } from 'react';
import { modalRegistry } from '../../niceModals/RegisterModals';
import { useActiveStakes } from '../../../hooks/useEternalBattleL2';

import StakedMeral from './StakedMeral';

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const StakesActive = ({ priceFeed }) => {
	const onSubmitChoose = async (long) => {
		NiceModal.show(modalRegistry.ebChoose, { priceFeed, long });
	};

	const { activeLongs, activeShorts } = useActiveStakes(priceFeed.id);
	const [counterTradeBonus, setCounterTradeBonus] = useState(undefined);

	useEffect(() => {
		if (activeLongs && activeShorts) {
			let counterTradeBonus = 1;
			if (activeShorts.length > 0 && activeLongs.length > activeShorts.length) {
				counterTradeBonus = activeLongs.length / activeShorts.length;
			}
			if (activeLongs.length > 0 && activeShorts.length > activeLongs.length) {
				counterTradeBonus = activeShorts.length / activeLongs.length;
			}
			counterTradeBonus = counterTradeBonus > 5 ? 5 : parseInt(counterTradeBonus);
			setCounterTradeBonus(counterTradeBonus);
		}
	}, [activeLongs, activeShorts]);

	const select = async (id) => {
		console.log(id);
	};

	const styleStakeButton = {
		// background: 'rgb(32,32,32)' /* fallback for old browsers */,
		// background: 'linear-gradient(0deg, rgba(36,36,36,1) 0%, rgba(92,92,94,1) 58%, rgba(125,131,133,1) 86%, rgba(183,189,190,1) 100%)',
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
			<div style={{ minHeight: '256px' }} className="border-gray-400 border rounded-md mr-2 py-6 bg-gray-600 bg-opacity-70">
				<p style={{ transform: 'translate(0px, -48px)' }} className="text-white text-sm font-bold flex items-center justify-between">
					<span> LONGS</span>
					{activeLongs && activeShorts && counterTradeBonus > 1 && activeLongs.length < activeShorts.length && (
						<span className="bg-brandColor border border-brandColor-purple text-white rounded-lg px-2 shadow text-right">Counter Trade ELF Multiplier x{counterTradeBonus}</span>
					)}
				</p>

				<div style={styleStakeButton} onClick={() => onSubmitChoose(true)} className="font-bold text-green-900 shadow-md bg-green-50 hover:bg-blue-100 transition duration-200">
					Join {priceFeed.baseSymbol}
				</div>
				<div className="m-4 mt-10">{activeLongs && activeLongs.map((stake) => <StakedMeral key={stake.meral.meralId} priceFeed={priceFeed} stake={stake} select={select} />)}</div>
			</div>

			<div style={{ minHeight: '256px' }} className=" border-gray-400 border rounded-md ml-2 py-6 bg-gray-600 bg-opacity-70">
				<p style={{ transform: 'translate(0px, -48px)' }} className="text-white text-sm font-bold flex items-center justify-between">
					<span>SHORTS</span>
					{activeLongs && activeShorts && counterTradeBonus > 1 && activeLongs.length > activeShorts.length && (
						<span className="bg-brandColor border border-brandColor-purple text-white rounded-lg px-2 shadow text-right">Counter Trade ELF Multiplier x{counterTradeBonus}</span>
					)}
				</p>

				<div style={styleStakeButton} onClick={() => onSubmitChoose(false)} className="font-bold text-red-900 shadow-md bg-red-50 hover:bg-blue-100 transition duration-200">
					Join {priceFeed.quoteSymbol}
				</div>
				<div className="m-4 mt-10">{activeShorts && activeShorts.map((stake) => <StakedMeral key={stake.meral.meralId} priceFeed={priceFeed} stake={stake} select={select} />)}</div>
			</div>
		</div>
	);
};
export default StakesActive;
