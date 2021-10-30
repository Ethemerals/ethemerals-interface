import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Range, getTrackBackground } from 'react-range';

import { useSendTx } from '../../../hooks/TxContext';
import { useLogin, useReadyToTransact } from '../../../hooks/Web3Context';

import useUserAccount from '../../../hooks/useUserAccount';
import WaitingConfirmation from '../WaitingConfirmation';
import ErrorDialogue from '../ErrorDialogue';

import { useMeralImagePaths } from '../../../hooks/useMeralImagePaths';
import { useNFTUtils } from '../../../hooks/useNFTUtils';
import { usePriceFeedPrice } from '../../../hooks/usePriceFeed';
import { useEternalBattleContract } from '../../../hooks/useEternalBattle';

import RankedStars from '../../cards/RankedStars';
import Images from '../../../constants/Images';
import UserInventoryHero from '../UserInventoryHero';

const rangeDefaults = {
	min: 100,
	max: 250,
	default: 200,
	step: 1,
};

const MeralBattleThumbnail = ({ nft }) => {
	const { elements, parseScore } = useNFTUtils();
	const { meralImagePaths } = useMeralImagePaths(nft.id);

	if (!meralImagePaths) {
		return <div className="flex w-72 h-74 mx-auto relative"></div>;
	}

	console.log(nft);

	return (
		<>
			<div className="flex-grow relative bg-cover bg-center text-white h-28" style={{ backgroundColor: elements[nft.bgId].color, backgroundImage: `url("${elements[nft.bgId].img}")` }}>
				{/* RIGHT BAR */}
				<div className="right-0 absolute p-1 text-right text-sm font-bold">
					<div className="flex justify-end">
						<RankedStars amount={parseScore(nft.score)} />
					</div>
					<p>{nft.score} HP</p>
					<p>{nft.rewards} ELF</p>
				</div>

				{/* BOTTOM BAR */}
				<div className="px-1 w-full bottom-0 absolute bg-black bg-opacity-70 z-10 flex items-center">
					<span className="font-bold text-lg uppercase">{nft.metadata.coin}</span>
					<span className="ml-4 text-sm">BASE STATS:</span>
					<span className="ml-4 text-sm">{nft.atk - nft.atkBonus}</span>
					<span className="ml-4 text-sm">{nft.def - nft.defBonus}</span>
					<span className="ml-4 text-sm">{nft.spd - nft.spdBonus}</span>
					<span className="flex-grow"></span>
					<span className="text-lg font-bold">#{nft.id.padStart(4, '0')}</span>
				</div>
				{/* MAIN IMAGE */}

				<div className="absolute top-0 left-0 w-full h-28">
					<img className="" src={meralImagePaths.inventory} alt="" />
				</div>
			</div>
		</>
	);
};

const EternalBattleStake = ({ contractPriceFeed, toggle, priceFeed, long }) => {
	const { mainIndex, userNFTs, account } = useUserAccount();
	const { contractBattle } = useEternalBattleContract();
	const { price } = usePriceFeedPrice(contractPriceFeed, priceFeed);

	const sendTx = useSendTx();
	const readyToTransact = useReadyToTransact();

	const login = useLogin();

	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isErrorOpen, setIsErrorOpen] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const [allyName, setAllyName] = useState('');
	const [enemyName, setEnemyName] = useState('');

	const [position, setPosition] = useState(0);
	const [rangeValues, setRangeValues] = useState([rangeDefaults.default]);

	const [userNFT, setUserNFT] = useState(undefined);

	useEffect(() => {
		if (priceFeed) {
			setAllyName(long ? priceFeed.baseSymbol : priceFeed.quoteSymbol);
			setEnemyName(long ? priceFeed.quoteSymbol : priceFeed.baseSymbol);
		}
	}, [priceFeed, long]);

	useEffect(() => {
		setPosition(rangeValues[0]);
	}, [rangeValues]);

	useEffect(() => {
		if (userNFTs && userNFTs.length > 0) {
			setUserNFT(userNFTs[mainIndex]);
		}
	}, [userNFTs, mainIndex]);

	const toggleConfirmation = () => {
		setIsConfirmationOpen(!isConfirmationOpen);
	};

	const toggleError = () => {
		setIsErrorOpen(!isErrorOpen);
	};

	const onSubmitStake = async () => {
		if (contractBattle && readyToTransact()) {
			setIsConfirmationOpen(true);
			try {
				let id = userNFT.id;
				let priceFeedId = priceFeed.id;
				console.log(id, priceFeedId, position.toString(), long);

				const gasEstimate = await contractBattle.estimateGas.createStake(id, priceFeedId, position.toString(), long);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractBattle.createStake(id, priceFeedId, position, long, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'create stake', true, [`nft_${id}`, 'account', 'account_eternalBattle']);
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
			<div className="w-full h-full flex justify-center fixed top-0 left-0">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 z-20 bg-opacity-50 bg-black"></div>
				<div className=" w-11/12 max-w-420 h-96 center border-gray-400 rounded overflow-hidden z-30 tracking-wide shadow-xl bg-indigo-100 text-black">
					<div className="flex items-center justify-end">
						<span onClick={toggle} className="cursor-pointer px-4 py-2 text-gray-900 hover:text-gray-600">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
								<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
							</svg>
						</span>
					</div>

					{/* MAIN */}
					<div className="text-center">
						{account && userNFT && userNFT.score >= 25 && (
							<div>
								<MeralBattleThumbnail nft={userNFT} />
								<p className="text-sm px-8 my-2">
									Send <span className="font-bold">{userNFT.metadata.coin}</span> to join <br></br>
									<span className="font-bold">{allyName}'s</span> Eternal Battle against
									<span className="font-bold">{` ${enemyName}!`}</span>
								</p>
								<p className="text-sm">
									{priceFeed.ticker}: {(parseFloat(price) / 10 ** priceFeed.decimals).toFixed(priceFeed.decimalPlaces)}
								</p>
								<div className="mt-2">
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
											<div {...props} className="w-5 h-5 transform translate-x-10 bg-indigo-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" />
										)}
									/>

									<p className="my-1">Position Size: {position} HP</p>

									<button onClick={onSubmitStake} className=" bg-brandColor-pale text-white text-lg text-bold px-4 py-1 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
										Enter the Battle
									</button>
								</div>
							</div>
						)}

						{/* NOT ENOUGH SCORE */}
						{account && userNFT && userNFT.score <= 25 && (
							<>
								<p className="mt-4">{userNFT.metadata.coin} needs Honor Points to enter Battle!</p>
								<button className="bg-brandColor text-white text-lg text-bold px-4 py-1 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">Resurrect Ethemeral</button>
							</>
						)}

						{/* NO ACCOUNT */}
						{!userNFT && account && (
							<>
								<p className="px-10 mt-10 mb-4">{`You need to have an Ethemeral to join ${allyName}'s Eternal Battle against ${enemyName}`}</p>
								<Link to="/">
									<button className="bg-brandColor text-white text-lg text-bold px-4 py-1 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">Mint an Ethemeral</button>
								</Link>
							</>
						)}

						{/* NO ACCOUNT */}
						{!account && (
							<>
								<p className="px-10 mt-10 mb-4">Login to your account!</p>

								<button onClick={login} className="bg-brandColor text-white text-lg text-bold px-4 py-1 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
									Connect Wallet
								</button>
							</>
						)}
					</div>
				</div>
			</div>
			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message={`Send ${userNFT.metadata.coin} to Battle!`} />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</>
	);
};

export default EternalBattleStake;
