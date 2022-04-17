import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useState, useEffect } from 'react';
import { BigNumber } from 'ethers';
import { Range, getTrackBackground } from 'react-range';
import { useSendTx } from '../../../context/TxContext';
import { useEternalBattleL2Contract, winCase, loseCase } from '../../../hooks/useEternalBattleL2';
import { useUser } from '../../../hooks/useUser';
import MeralThumbnail from '../../ethemerals/cards/MeralThumbnail';
import { modalRegistry } from '../../niceModals/RegisterModals';
import CloseButton from './CloseButton';
import { usePriceFeedContractL2, usePriceFeedPriceL2 } from '../../../hooks/usePriceFeedL2';
import SVGQuestionMark from '../svg/SVGQuestionMark';
import ReactTooltip from 'react-tooltip';
import { Links } from '../../../constants/Links';
import { useGetLayerDetails } from '../../../hooks/useWeb3';

const rangeDefaults = {
	min: 100,
	max: 500,
	default: 300,
	step: 1,
};

export default NiceModal.create(({ meral, priceFeed, long }) => {
	const { address } = useUser();
	const { contractBattle } = useEternalBattleL2Contract();
	const { isLayer2, otherLayerName } = useGetLayerDetails();
	const sendTx = useSendTx();

	const { contractPriceFeed } = usePriceFeedContractL2();
	const { price } = usePriceFeedPriceL2(contractPriceFeed, priceFeed);

	const [position, setPosition] = useState(300);
	const [leverage, setLeverage] = useState(1);
	const [liquidation, setLiquidation] = useState(undefined);
	const [rangeValues, setRangeValues] = useState([rangeDefaults.default]);
	const [priceFormated, setPriceFormated] = useState(undefined);
	const [winPreview, setWinPreview] = useState(undefined);
	const [losePreview, setLosePreview] = useState(undefined);

	const modal = useModal();

	useEffect(() => {
		setPosition(rangeValues[0]);
	}, [rangeValues]);

	useEffect(() => {
		if (price) {
			setPriceFormated((parseFloat(price) / 10 ** priceFeed.decimals).toFixed(priceFeed.priceDecimalPlaces));
		}

		return () => {
			setPriceFormated(undefined);
		};
	}, [price, priceFeed]);

	useEffect(() => {
		setLeverage(((position / meral.hp) * 1).toFixed(1));
		if (position >= 100 && position <= 500) {
			let stats = { atk: meral.atk, def: meral.def, spd: meral.spd };
			setWinPreview(winCase(position, 0.1, stats));
			let _lose = loseCase(position, 0.1, stats);
			setLosePreview(_lose);

			// FIND LIQUIDATION PRICE
			let _price;
			let _currentPrice = parseFloat(price);
			let remainingHp = parseFloat(meral.hp);
			let incrementHp = parseFloat(_lose.score) / 100;

			let count = 1;
			while (remainingHp > 20) {
				remainingHp -= incrementHp;
				count++;
			}

			if (long) {
				_price = _currentPrice - (_currentPrice * (count / 1000) + 1);
			} else {
				_price = _currentPrice + (_currentPrice * (count / 1000) + 1);
			}

			let _liqPrice = (parseFloat(_price) / 10 ** priceFeed.decimals).toFixed(priceFeed.priceDecimalPlaces);
			setLiquidation(parseInt(_liqPrice));
		}
	}, [position, meral, long, price, priceFeed]);

	const toggle = () => {
		modal.remove();
	};

	const selectAndToggle = async (id) => {
		// console.log(id);
	};

	const onSwitchNetwork = () => {
		NiceModal.show(modalRegistry.chooseNetworks);
		toggle();
	};

	const onSubmitStake = async () => {
		if (position < 100 || position > 500) {
			console.log('out of bounds');
			return;
		}

		if (address && contractBattle) {
			NiceModal.show(modalRegistry.waitingForSignature, { message: `Send ${meral.name} to Battle! ${long ? 'LONG' : 'SHORT'}  ${priceFeed.ticker}` });
			try {
				let id = meral.meralId;
				let pricefeedId = priceFeed.id;

				const gasEstimate = await contractBattle.estimateGas.createStake(id, pricefeedId.toString(), position.toString(), long);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractBattle.createStake(id, pricefeedId, position, long, { gasLimit, maxFeePerGas: BigNumber.from('30000000000'), maxPriorityFeePerGas: BigNumber.from('30000000000') });
				console.log(tx);

				sendTx(tx.hash, 'create stake', true, [`nft_${id}`, `getActiveStakes_${priceFeed.id}`, `account_${address}`, `account_${address}_subgraphL2`]);
			} catch (error) {
				NiceModal.remove(modalRegistry.waitingForSignature);
				console.log(`${error.data} \n${error.message}`);
			}
			toggle();
		} else {
			console.log('no wallet');
		}
	};

	return (
		<>
			<div onClick={toggle} className="fixed left-0 top-0 w-screen h-screen bg-black bg-opacity-30 z-30"></div>
			<div className="w-512 h-512 fixed center rounded-xl shadow-xl bg-white z-50 overflow-hidden">
				<div className="flex justify-end">
					<CloseButton toggle={toggle} />
				</div>

				{/* HEADER */}
				<div className="px-4">
					<p className="text-4xl font-light">Enter the Battle</p>
					<p className="text-xs text-blue-400 hover:text-blue-600 cursor-pointer">
						<a href={Links.DISCORD} target="blank" rel="noreferrer">
							Need Help? Join our discord for more information
						</a>
					</p>
				</div>

				{/* CONTENT */}
				<div style={{ bottom: '-36px' }} className="h-96 w-full absolute">
					<h2 className="text-sm text-gray-800 px-4">
						{long ? `LONG ${priceFeed.ticker}  @ ${priceFormated ? priceFormated : ''}` : `SHORT ${priceFeed.ticker}  @ ${priceFormated ? priceFormated : ''}`}
					</h2>
					<div style={{ borderTop: '1px solid skyblue' }} className="h-80 overflow-auto bg-blue-50 pt-2">
						<div className="flex justify-center my-4">
							<div className="mx-6">{meral && <MeralThumbnail key={meral.meralId} nft={meral} select={selectAndToggle} />}</div>
							<div className="w-60 text-base leading-5 text-gray-500">
								<div>
									<span className="text-xs">AVAILABLE HP:</span>
									<span className="pl-1 text-black">
										{meral.hp} of {meral.maxHp}
									</span>
								</div>
								<div>
									<span className="text-xs">LEVERAGE:</span>
									<span className="pl-1 text-black">{leverage}x</span>
								</div>
								<div className="flex items-baseline">
									<span className="text-xs">LIQUIDATION PRICE:</span>
									<span className="pl-1 text-black">{!Number.isNaN(liquidation) && liquidation}</span>
									<span data-tip data-for="ttLiquidation">
										<SVGQuestionMark />
									</span>
									<ReactTooltip id="ttLiquidation" type="warning" effect="solid">
										<span>If the price reaches this amount. The Meral becomes revivable by other Merals</span>
									</ReactTooltip>
								</div>
								<div>
									<span className="text-xs">POSITION SIZE:</span>
									<span className="pl-1 text-black">{position} HP</span>
								</div>

								<div className="">
									<Range
										step={rangeDefaults.step}
										min={rangeDefaults.min}
										max={rangeDefaults.max}
										values={rangeValues}
										onChange={(rangeValues) => {
											setRangeValues(rangeValues);
										}}
										renderTrack={({ props, children }) => (
											<div
												{...props}
												className="w-52 h-1 rounded mt-6"
												style={{
													background: getTrackBackground({
														values: rangeValues,
														colors: ['#548BF4', '#ccc'],
														min: rangeDefaults.min,
														max: rangeDefaults.max,
													}),
												}}
											>
												{children}
											</div>
										)}
										renderThumb={({ props }) => (
											<div {...props} className="w-4 h-4 transform translate-x-10 bg-blue-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" />
										)}
									/>
								</div>
							</div>
						</div>
						<div className="text-center">
							{isLayer2 && (
								<button
									onClick={onSubmitStake}
									className={`${
										long ? 'bg-green-100 border-green-200 text-green-900' : 'bg-red-100 border-red-200 text-red-900'
									} transition duration-300 hover:bg-white shadow border rounded-lg px-6 py-1 mt-2 text-lg uppercase`}
								>
									SEND {meral.name ? meral.name : `#${meral.tokenId}`} TO BATTLE!
								</button>
							)}

							{!isLayer2 && (
								<button
									onClick={onSwitchNetwork}
									className={`${
										long ? 'bg-green-100 border-green-200 text-green-900' : 'bg-red-100 border-red-200 text-red-900'
									} transition duration-300 hover:bg-white shadow border rounded-lg px-6 py-1 mt-2 text-lg uppercase`}
								>
									SWITCH NETWORK TO {otherLayerName}
								</button>
							)}
						</div>
					</div>
					<div style={{ borderTop: '1px solid skyblue', height: '80px', bottom: '44px' }} className="w-full absolute text-xs bg-blue-100 border-t px-4 py-2 text-gray-500">
						<p className="pb-1 text-gray-800">EXAMPLE OUTCOME BASED ON YOUR MERAL STATS</p>
						<p>
							If {long ? `${priceFeed.baseSymbol} price gains 10% against ${priceFeed.quoteSymbol}` : `${priceFeed.quoteSymbol} gains 10% against ${priceFeed.baseSymbol}`}. You win:
							{winPreview && <span className="text-green-600 font-bold">{` ${winPreview.score} HP and ${winPreview.rewards} ELF`}</span>}
						</p>
						<p>
							If {long ? `${priceFeed.baseSymbol} price loses 10% against ${priceFeed.quoteSymbol}` : `${priceFeed.quoteSymbol} loses 10% against ${priceFeed.baseSymbol}`}. You lose:
							{losePreview && <span className="text-red-600 font-bold">{` ${losePreview.score} HP`}</span>}
						</p>
					</div>
					<div style={{ backgroundColor: 'skyblue', height: '44px' }}></div>
				</div>
			</div>
		</>
	);
});
