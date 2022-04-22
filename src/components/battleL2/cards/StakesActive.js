import NiceModal from '@ebay/nice-modal-react';
import { useState, useEffect } from 'react';
import { modalRegistry } from '../../niceModals/RegisterModals';
import { useActiveStakes } from '../../../hooks/useEternalBattleL2';
import ReactTooltip from 'react-tooltip';
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
		textAlign: 'center',
		marginLeft: 'auto',
		marginRight: 'auto',
		paddingTop: '4px',
		paddingBottom: '4px',
		paddingLeft: '12px',
		paddingRight: '12px',
	};

	return (
		<div className="mt-24">
			<div className="flex items-baseline text-white mb-8">
				<h2 className="text-4xl">Active</h2>
				<span
					onClick={() => NiceModal.show(modalRegistry.ebClassBonus, { priceFeed })}
					style={{ transform: 'translate(0px, -3px)' }}
					className="bg-blue-400 hover:bg-blue-600 cursor-pointer font-bold px-2 mx-2 rounded-md text-xs shadow"
				>
					Coin Bonuses
				</span>
			</div>
			<div className=" grid grid-cols-2 items-start">
				<div style={{ minHeight: '256px' }} className="border-gray-200 border rounded-md mr-2 py-6 pt-2 bg-gray-400 bg-opacity-80">
					<div style={{ transform: 'translate(0px, -28px)' }} className="text-white text-sm font-bold flex items-center justify-between">
						<span style={{ textShadow: '1px 1px 0px #000' }}>LONGS</span>

						{activeLongs && activeShorts && counterTradeBonus > 1 && activeLongs.length < activeShorts.length && (
							<>
								<span data-tip data-for="longCountertrade" className="text-xs cursor-pointer bg-brandColor-pale text-white rounded-md px-2 shadow tex-tright">
									ELF x{counterTradeBonus}
								</span>
								<ReactTooltip id="longCountertrade" place="top" type="info" effect="float">
									<div className="w-96">
										<h4>Counter Trade</h4>
										<ul className="list-disc text-xs">
											<li>If a market pair has more participants on one side, the other side gets a ELF bonus multiplier</li>
											<li>The ratios is 2:1 for each multiplier step for a max of 5x</li>
											<li>
												For example, if there are 2 Long Merals, and 1 Short Meral in a market. The short Meral will gain 2x ELF rewards! <strong>(If she leaves the battle at that moment)</strong>
											</li>
										</ul>
									</div>
								</ReactTooltip>
							</>
						)}
					</div>

					<div
						style={styleStakeButton}
						onClick={() => onSubmitChoose(true)}
						className="rounded-md border-2 border-b-4 border-green-600 text-green-600 font-bold shadow-md hover:shadow-lg bg-white hover:bg-green-100 transition duration-300"
					>
						JOIN <span className="pr-1">{priceFeed.baseSymbol}</span> ⚔️
					</div>
					<div className="m-4 mt-10">{activeLongs && activeLongs.map((stake) => <StakedMeral key={stake.meral.meralId} priceFeed={priceFeed} stake={stake} />)}</div>
				</div>

				<div style={{ minHeight: '256px' }} className="border-gray-200 border rounded-md ml-2 py-6 pt-2 bg-gray-400 bg-opacity-80">
					<div style={{ transform: 'translate(0px, -28px)' }} className="text-white text-sm font-bold flex items-center justify-between">
						<span style={{ textShadow: '1px 1px 0px #000' }}>SHORTS</span>
						{activeLongs && activeShorts && counterTradeBonus > 1 && activeLongs.length > activeShorts.length && (
							<>
								<span data-tip data-for="shortCountertrade" className="text-xs cursor-pointer bg-brandColor-pale text-white rounded-md px-2 shadow tex-tright">
									ELF x{counterTradeBonus}
								</span>
								<ReactTooltip id="shortCountertrade" place="top" type="info" effect="float">
									<div className="w-96">
										<h4>Counter Trade</h4>
										<ul className="list-disc text-xs">
											<li>If a market pair has more participants on one side, the other side gets a ELF bonus multiplier</li>
											<li>The ratios is 2:1 for each multiplier step for a max of 5x</li>
											<li>
												For example, if there are 2 Long Merals, and 1 Short Meral in a market. The short Meral will gain 2x ELF rewards! <strong>(If she leaves the battle at that moment)</strong>
											</li>
										</ul>
									</div>
								</ReactTooltip>
							</>
						)}
					</div>

					<div
						style={styleStakeButton}
						onClick={() => onSubmitChoose(false)}
						className="rounded-md border-2 border-b-4 border-red-800 text-red-800 font-bold shadow-md hover:shadow-lg bg-white hover:bg-red-100 transition duration-300"
					>
						JOIN <span className="pr-1">{priceFeed.quoteSymbol}</span> ⚔️
					</div>
					<div className="m-4 mt-10">{activeShorts && activeShorts.map((stake) => <StakedMeral key={stake.meral.meralId} priceFeed={priceFeed} stake={stake} />)}</div>
				</div>
			</div>
		</div>
	);
};
export default StakesActive;
