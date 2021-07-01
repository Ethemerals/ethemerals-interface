import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Range, getTrackBackground } from 'react-range';
import { Contract } from '@ethersproject/contracts';

import abis from '../../../constants/contracts/abis';
import Addresses from '../../../constants/contracts/Addresses';
import FunctionTx from '../../../constants/FunctionTx';
import getSigner from '../../../constants/Signer';
import { useSendTx } from '../../../hooks/TxContext';
import { useWeb3, useReadyToTransact } from '../../../hooks/Web3Context';

import useUserAccount from '../../../hooks/useUserAccount';
import WaitingConfirmation from '../WaitingConfirmation';
import ErrorDialogue from '../ErrorDialogue';

import { usePriceFeedPrice } from '../../../hooks/usePriceFeed';

const rangeDefaults = {
	min: 1,
	max: 100,
	default: 80,
	step: 1,
};

const getContracts = async (provider, setContractBattle) => {
	if (provider) {
		await setContractBattle(new Contract(Addresses.EternalBattle, abis.EternalBattle, getSigner(provider)));
		console.log('GOT BATTLE CONTRACTS');
	} else {
	}
};

const EternalBattleStake = ({ contractPriceFeed, toggle, priceFeed, long }) => {
	const { mainIndex, userNFTs } = useUserAccount();
	const { price } = usePriceFeedPrice(contractPriceFeed, priceFeed);

	const provider = useWeb3();
	const sendTx = useSendTx();
	const readyToTransact = useReadyToTransact();

	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isErrorOpen, setIsErrorOpen] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const [contractBattle, setContractBattle] = useState(undefined);
	const [allyName, setAllyName] = useState('');
	const [enemyName, setEnemyName] = useState('');
	const [ticker, setTicker] = useState('');

	const [positionMult, setPositionMult] = useState(10);
	const [position, setPosition] = useState(0);
	const [rangeValues, setRangeValues] = useState([rangeDefaults.default]);

	const [userNFT, setUserNFT] = useState(undefined);

	useEffect(() => {
		if (priceFeed) {
			setAllyName(long ? priceFeed.baseName : priceFeed.quoteName);
			setEnemyName(long ? priceFeed.quoteName : priceFeed.baseName);
			setTicker(priceFeed.name);
		}
	}, [priceFeed, long]);

	useEffect(() => {
		getContracts(provider, setContractBattle);
	}, [provider]);

	useEffect(() => {
		setPosition(positionMult * rangeValues[0]);
	}, [positionMult, rangeValues]);

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
				const gasEstimate = await contractBattle.estimateGas.createStake(id, priceFeedId, position, long);
				const gasLimit = gasEstimate.add(gasEstimate.div(FunctionTx.createStake.gasDiv));
				const tx = await contractBattle.createStake(id, priceFeedId, position, long, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, FunctionTx.createStake.receiptMsg, true, [`nft_${id}`, 'account', 'account_eternalBattle']);
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
				<div className=" w-11/12 max-w-420 h-96 center border-gray-400 bg-opacity-100 rounded-2xl overflow-hidden z-30 tracking-wide shadow-xl bg-gray-900">
					<div className="flex justify-end">
						<span onClick={toggle} className="cursor-pointer px-4 py-2 text-gray-300 hover:text-gray-100">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
								<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
							</svg>
						</span>
					</div>
					<div className="text-center px-2">
						<p className="text-2xl">{ticker}</p>
						{price !== undefined && (
							<p className="text-sm font-light">
								current price: {price} {priceFeed.quoteSymbol}
							</p>
						)}
						{userNFT ? (
							<>
								<p className="">{`You are about to send ${userNFT.metadata.coin} to join ${allyName}'s Eternal Battle against ${enemyName}!`}</p>
								<p>{`${userNFT.metadata.coin}'s current Honor Points: ${userNFT.score}`}</p>

								{userNFT.score > 10 && (
									<>
										<div className="flex justify-center py-4 items-center">
											<p className="px-2">Multiplier: </p>
											<button onClick={() => setPositionMult(10)} className={`p-2 ${positionMult === 10 ? 'bg-gray-400' : 'bg-gray-700'}`}>
												10x
											</button>
											<button onClick={() => setPositionMult(50)} className={`p-2 ${positionMult === 50 ? 'bg-gray-400' : 'bg-gray-700'}`}>
												50x
											</button>
											<button onClick={() => setPositionMult(200)} className={`p-2 ${positionMult === 200 ? 'bg-gray-400' : 'bg-gray-700'}`}>
												200x
											</button>
										</div>
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
												<div {...props} className="w-5 h-5 transform translate-x-10 bg-indigo-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" />
											)}
										/>

										<p className="my-4">Stake {position} Honor Points</p>

										<button onClick={onSubmitStake} className="bg-brandColor text-xl text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
											Enter the Battle
										</button>
									</>
								)}
								{userNFT.score <= 10 && (
									<>
										<p>Your Ethemeral needs Honor Points to enter Battle</p>
										<Link to={`/resurrect/${userNFT.id}`}>
											<button className="bg-brandColor text-xl text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">Resurrect Ethemeral</button>
										</Link>
									</>
								)}
							</>
						) : (
							<>
								<p className="">{`You need to have an Ethemeral to join ${allyName}'s Eternal Battle against ${enemyName}`}</p>
								<Link to="/">
									<button className="bg-brandColor text-xl text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">Mint an Ethemeral</button>
								</Link>
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
