import NiceModal from '@ebay/nice-modal-react';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Range, getTrackBackground } from 'react-range';

import { useSendTx } from '../../../context/TxContext';

import { useUserAccount } from '../../../hooks/useUser';

import { getSubclassInfo } from '../../../hooks/useMeralsUtils';
import { usePriceFeedPrice } from '../../../hooks/usePriceFeed';
import { useEternalBattleL1Contract, winCase, loseCase } from '../../../hooks/useEternalBattleL1';

import NFTInventoryCard from '../../ethemerals/cards/NFTInventoryCard';
import { modalRegistry } from '../../niceModals/RegisterModals';

const rangeDefaults = {
	min: 100,
	max: 254,
	default: 200,
	step: 1,
};

const EBStake = ({ contractPriceFeed, toggle, priceFeed, long }) => {
	const { mainIndex, userMerals, account } = useUserAccount();
	const { contractBattle } = useEternalBattleL1Contract();

	const { price } = usePriceFeedPrice(contractPriceFeed, priceFeed);

	const sendTx = useSendTx();

	const [allyName, setAllyName] = useState('');
	const [enemyName, setEnemyName] = useState('');

	const [position, setPosition] = useState(0);
	const [rangeValues, setRangeValues] = useState([rangeDefaults.default]);

	const [userNFT, setUserNFT] = useState(undefined);

	const [baseStats, setBaseStats] = useState({ atk: 0, def: 0, spd: 0 });

	const [winPreview, setWinPreview] = useState(undefined);
	const [losePreview, setLosePreview] = useState(undefined);

	useEffect(() => {
		if (userMerals && userMerals.length > 0 && mainIndex >= 0) {
			let _userNFT = userMerals[mainIndex];
			setUserNFT(_userNFT);

			let statBonus = getSubclassInfo(_userNFT.subclass).bonus;
			let baseStats = {
				atk: _userNFT.atk - _userNFT.atkBonus - statBonus.atk,
				def: _userNFT.def - _userNFT.defBonus - statBonus.def,
				spd: _userNFT.spd - _userNFT.spdBonus - statBonus.spd,
			};
			setBaseStats(baseStats);
		}
	}, [userMerals, mainIndex]);

	useEffect(() => {
		if (position >= 100 && position <= 500) {
			setWinPreview(winCase(position, 0.1, baseStats));
			setLosePreview(loseCase(position, 0.1, baseStats));
		}
	}, [position, baseStats]);

	useEffect(() => {
		if (priceFeed) {
			setAllyName(long ? priceFeed.baseSymbol : priceFeed.quoteSymbol);
			setEnemyName(long ? priceFeed.quoteSymbol : priceFeed.baseSymbol);
		}
	}, [priceFeed, long]);

	useEffect(() => {
		setPosition(rangeValues[0]);
	}, [rangeValues]);

	const onSubmitStake = async () => {
		if (contractBattle) {
			NiceModal.show(modalRegistry.waitingForSignature, { message: `Send ${userNFT.coin} to Battle! ${long ? 'LONG' : 'SHORT'}  ${priceFeed.ticker}` });
			try {
				let id = userNFT.id;
				let pricefeedId = priceFeed.id;

				const gasEstimate = await contractBattle.estimateGas.createStake(id, pricefeedId, position.toString(), long);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractBattle.createStake(id, pricefeedId, position, long, { gasLimit });
				console.log(tx);

				sendTx(tx.hash, 'create stake', true, [`nft_${id}`, `meral_${id}`, 'account', 'account_eternalBattle']);
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
			<div className="w-full h-full fixed flex justify-center z-30 top-0 left-0">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 bg-opacity-50 bg-black"></div>
				<div className=" w-11/12 max-w-420 h-500 center border-gray-400 rounded tracking-wide shadow-xl bg-gray-50 text-black">
					<div className="flex items-center justify-end">
						<span onClick={toggle} className="cursor-pointer px-4 py-2 text-gray-900 hover:text-gray-600">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
								<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
							</svg>
						</span>
					</div>

					{/* MAIN */}

					<div className="text-center">
						{account && userNFT && (
							<div>
								<NFTInventoryCard nft={userNFT} />

								<p className="py-6 mt-6 text-xl">
									{long ? <span className="text-green-700 font-bold">LONG</span> : <span className="text-red-700 font-bold">SHORT</span>} {priceFeed.ticker} @{' '}
									{(parseFloat(price) / 10 ** priceFeed.decimals).toFixed(priceFeed.decimalPlaces)}
								</p>
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
												className="w-64 h-3 pr-2 rounded-md mx-auto"
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
											<div {...props} className="w-5 h-5 transform translate-x-10 bg-blue-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" />
										)}
									/>

									<p className="my-3 font-bold">Position Size: {position} HP</p>

									<button
										onClick={onSubmitStake}
										className={`mt-2 mb-4 bg-gray-600 text-white px-4 py-1 m-2 shadow ${long ? 'hover:bg-green-500' : 'hover:bg-red-500'} hover:shadow-lg transition duration-300`}
									>
										SEND <strong className="uppercase">{userNFT && userNFT.coin}</strong> TO BATTLE!
									</button>

									<div className="text-xs text-gray-500 text-left p-2 absolute bottom-0 pb-2 bg-gray-200 w-full">
										<p className="pb-1 font-bold">EXAMPLE OUTCOME WITH STATS MODIFIERS:</p>
										<p>
											If {priceFeed.ticker} {long ? 'gains 10% in price' : 'loses 10% in price'} you win:
											<span className="text-green-600 font-bold">{` ${winPreview.score} HP and ${winPreview.rewards} ELF`}</span>
										</p>
										<p>
											If {priceFeed.ticker} {long ? 'loses 10% in price' : 'gains 10% in price'} you lose:
											<span className="text-red-600 font-bold">{` ${losePreview.score} HP`}</span>
										</p>
									</div>
								</div>
							</div>
						)}

						{/* NO MERALS */}
						{(!userNFT || !account) && (
							<>
								<p className="px-10 mt-10 mb-4">{`You need to have an Ethemeral to join ${allyName}'s Eternal Battle against ${enemyName}`}</p>
								<Link to="/">
									<button className="bg-brandColor text-white text-lg text-bold px-4 py-1 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">Mint an Ethemeral</button>
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default EBStake;
