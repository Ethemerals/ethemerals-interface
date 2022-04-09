import NiceModal from '@ebay/nice-modal-react';
import { useState, useEffect } from 'react';
import { modalRegistry } from '../../niceModals/RegisterModals';
import { useActiveStakes } from '../../../hooks/useEternalBattleL2';

import StakedMeral from './StakedMeral';

const StakesActive = ({ priceFeed }) => {
	const onSubmitChoose = async (long) => {
		let subtext = 'Which Meral will you send to Battle?';
		let modalOptions = { priceFeed, long, subtext };
		NiceModal.show(modalRegistry.ebChoose, { modalToShow: modalRegistry.ebStake, modalOptions });
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

	const styleStakeButton = {
		// background: 'rgb(32,32,32)' /* fallback for old browsers */,
		// background: 'linear-gradient(0deg, rgba(36,36,36,1) 0%, rgba(92,92,94,1) 58%, rgba(125,131,133,1) 86%, rgba(183,189,190,1) 100%)',
		minWidth: '164px',
		width: 'max-content',
		cursor: 'pointer',
		borderRadius: '2px',
		textAlign: 'center',
		marginLeft: 'auto',
		marginRight: 'auto',
		paddingTop: '4px',
		paddingBottom: '4px',
		paddingLeft: '12px',
		paddingRight: '12px',
	};

	return (
		<div className=" grid grid-cols-2 mt-24 items-start">
			<div style={{ minHeight: '256px' }} className="border-gray-400 border rounded-md mr-2 py-6 pt-2 bg-gray-600 bg-opacity-70">
				<p style={{ transform: 'translate(0px, -28px)' }} className="text-white text-sm font-bold flex items-center justify-between">
					<span style={{ textShadow: '1px 1px 0px #000' }}>LONGS</span>
					{activeLongs && activeShorts && counterTradeBonus > 1 && activeLongs.length < activeShorts.length && (
						<span className="text-xs bg-brandColor border border-brandColor-purple text-white rounded-lg px-2 shadow text-right">Counter Trade ELF Multiplier x{counterTradeBonus}</span>
					)}
				</p>

				<div style={styleStakeButton} onClick={() => onSubmitChoose(true)} className="font-bold text-green-900 shadow-md bg-green-50 hover:bg-green-100 transition duration-200">
					Join <span className="pr-1">{priceFeed.baseSymbol}</span> ⚔️
				</div>
				<div className="m-4 mt-10">{activeLongs && activeLongs.map((stake) => <StakedMeral key={stake.meral.meralId} priceFeed={priceFeed} stake={stake} />)}</div>
			</div>

			<div style={{ minHeight: '256px' }} className=" border-gray-400 border rounded-md ml-2 py-6 pt-2 bg-gray-600 bg-opacity-70">
				<p style={{ transform: 'translate(0px, -28px)' }} className="text-white text-sm font-bold flex items-center justify-between">
					<span style={{ textShadow: '1px 1px 0px #000' }}>SHORTS</span>
					{activeLongs && activeShorts && counterTradeBonus > 1 && activeLongs.length > activeShorts.length && (
						<span className="text-xs bg-brandColor border border-brandColor-purple text-white rounded-lg px-2 shadow text-right">Counter Trade ELF Multiplier x{counterTradeBonus}</span>
					)}
				</p>

				<div style={styleStakeButton} onClick={() => onSubmitChoose(false)} className="font-bold text-red-900 shadow-md bg-red-50 hover:bg-red-100 transition duration-200">
					Join <span className="pr-1">{priceFeed.quoteSymbol}</span> ⚔️
				</div>
				<div className="m-4 mt-10">{activeShorts && activeShorts.map((stake) => <StakedMeral key={stake.meral.meralId} priceFeed={priceFeed} stake={stake} />)}</div>
			</div>
		</div>
	);
};
export default StakesActive;
