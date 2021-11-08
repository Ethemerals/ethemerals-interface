import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Range, getTrackBackground } from 'react-range';

import { useSendTx } from '../../../hooks/TxContext';
import { useReadyToTransact } from '../../../hooks/Web3Context';

import useUserAccount from '../../../hooks/useUserAccount';
import WaitingConfirmation from '../../modals/WaitingConfirmation';
import ErrorDialogue from '../../modals/ErrorDialogue';

import { getSubclassBonus } from '../../../hooks/useNFTUtils';
import { usePriceFeedPrice } from '../../../hooks/usePriceFeed';
import { useEternalBattleContract, winCase, loseCase } from '../../../hooks/useEternalBattle';

import NFTInventoryCard from '../../NFTInventoryCard';
import { messageDiscord } from '../../../utils/messageDiscord';

const rangeDefaults = {
	min: 100,
	max: 254,
	default: 200,
	step: 1,
};

const EBStake = ({ contractPriceFeed, toggle, priceFeed, long }) => {
	const { mainIndex, userNFTs, account } = useUserAccount();
	const { contractBattle } = useEternalBattleContract();

	const { price } = usePriceFeedPrice(contractPriceFeed, priceFeed);

	const sendTx = useSendTx();
	const readyToTransact = useReadyToTransact();

	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isErrorOpen, setIsErrorOpen] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const [allyName, setAllyName] = useState('');
	const [enemyName, setEnemyName] = useState('');

	const [position, setPosition] = useState(0);
	const [rangeValues, setRangeValues] = useState([rangeDefaults.default]);

	const [userNFT, setUserNFT] = useState(undefined);

	const [baseStats, setBaseStats] = useState([0, 0, 0]);

	const [winPreview, setWinPreview] = useState(undefined);
	const [losePreview, setLosePreview] = useState(undefined);

	useEffect(() => {
		if (userNFTs && userNFTs.length > 0) {
			let _userNFT = userNFTs[mainIndex];
			setUserNFT(_userNFT);

			let statBonus = getSubclassBonus(_userNFT.metadata.subClass);
			setBaseStats([_userNFT.atk - _userNFT.atkBonus - statBonus[0], _userNFT.def - _userNFT.defBonus - statBonus[1], _userNFT.spd - _userNFT.spdBonus - statBonus[2]]);
		}
	}, [userNFTs, mainIndex]);

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

	const toggleConfirmation = () => {
		setIsConfirmationOpen(!isConfirmationOpen);
	};

	const toggleError = () => {
		setIsErrorOpen(!isErrorOpen);
	};

	const msgCallback = async (priceFeed, nft, long, _price, position) => {
		const priceFormated = (parseFloat(_price) / 10 ** priceFeed.decimals).toFixed(priceFeed.decimalPlaces);
		const msgData = {
			network: process.env.REACT_APP_API_NETWORK,
			pricefeedId: priceFeed.id,
			name: nft.metadata.coin,
			id: nft.id,
			image: `https://ethemerals-media.s3.amazonaws.com/opensea/${nft.id}.png`,
			long: long,
			ticker: priceFeed.ticker,
			price: priceFormated,
			position: position,
		};
		await messageDiscord('enterebattle', msgData);
	};

	const onSubmitStake = async () => {
		if (contractBattle && readyToTransact()) {
			setIsConfirmationOpen(true);
			try {
				let id = userNFT.id;
				let pricefeedId = priceFeed.id;
				console.log(id, pricefeedId, position.toString(), long);

				const gasEstimate = await contractBattle.estimateGas.createStake(id, pricefeedId, position.toString(), long);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractBattle.createStake(id, pricefeedId, position, long, { gasLimit });
				console.log(tx);

				sendTx(tx.hash, 'create stake', true, [`nft_${id}`, 'account', 'account_eternalBattle'], true, () => msgCallback(priceFeed, userNFT, long, price, position));
			} catch (error) {
				setIsErrorOpen(true);
				setErrorMsg('Transfer transaction rejected from user wallet');
				console.log(`${error.data} \n${error.message}`);
			}
			setIsConfirmationOpen(false);
			toggle();
		} else {
			// connect
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
								<NFTInventoryCard nft={userNFT} stats={baseStats} showBase={true} />
								{/* <div className="flex justify-center text-xl w-full mt-6">
									<span onClick={toggleSide} className={`px-4 border-b-4 ${long ? 'border-green-700' : 'cursor-pointer hover:text-green-500 text-gray-400 transition duration-100'}`}>
										JOIN {priceFeed.baseSymbol}
									</span>
									<span onClick={toggleSide} className={`px-4 border-b-4 ${!long ? 'border-red-700' : 'cursor-pointer hover:text-red-500 text-gray-400 transition duration-100'}`}>
										JOIN {priceFeed.quoteSymbol}
									</span>
								</div> */}
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
										SEND <strong className="uppercase">{userNFT && userNFT.metadata.coin}</strong> TO BATTLE!
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
						{!userNFT && account && (
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
			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message={`Send ${userNFT.metadata.coin} to Battle! ${long ? 'LONG' : 'SHORT'}  ${priceFeed.ticker}`} />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</>
	);
};

export default EBStake;
