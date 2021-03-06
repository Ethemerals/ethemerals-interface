import { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { AddressZero } from '@ethersproject/constants';
import Countdown from 'react-countdown';
import { shortenAddress } from '../../utils';
import { ItemTypes } from './utils/items';
import MeralThumbnail from './cards/MeralThumbnail';
import PetThumbnail from './cards/PetThumbnail';
import { useArtCheckAnswer, useArtGetArt, useClaimGiveaway, useClaimReward } from '../../hooks/useArtHunt';

import MeralThumbnailOS from './cards/MeralThumbnailOS';
import PetThumbnailOS from './cards/PetThumbnailOS';

import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
import { Gallery, Item } from 'react-photoswipe-gallery';
import WinningModal from './modals/WinningModal';
import { useUser, useUserAccount } from '../../hooks/useUser';

const Combos = ({ list, type }) => {
	return (
		<div className="flex m-2 space-x-2">
			{type === ItemTypes.MERALS && list.map((id) => <MeralThumbnailOS key={id} id={id} />)}
			{type === ItemTypes.PETS && list.map((id) => <PetThumbnailOS key={id} id={id} />)}
		</div>
	);
};

const ArtDrop = ({ tokenId, onDrop, droppedMerals, droppedPets, clearDrops, handleRemove }) => {
	const now = Date.now();
	const [released, setReleased] = useState(false);

	const { checkAnswer, answerIsUpdating } = useArtCheckAnswer();
	const { claimReward, claimIsUpdating } = useClaimReward();
	const { claimGiveaway, claimGiveawayIsUpdating } = useClaimGiveaway();

	const { artData } = useArtGetArt(tokenId);
	const [winners, setWinners] = useState(undefined);

	const { account, userMerals } = useUserAccount();
	const { login, isAuthenticating } = useUser();
	const [result, setResult] = useState(undefined);
	const [answers, setAnswers] = useState({});
	const [meralCombos, setMeralCombos] = useState(undefined);
	const [petCombos, setPetCombos] = useState(undefined);
	const [canClaim, setCanClaim] = useState(false);
	const [alreadyClaimed, setAlreadyClaimed] = useState(false);
	const [allClaimed, setAllClaimed] = useState(false);

	const [canGiveaway, setCanGiveaway] = useState(false);
	const [giveawayWinner, setGiveawayWinner] = useState(undefined);

	const [showWinningModal, setShowWinningModal] = useState(false);

	const toggleWinningModal = () => {
		setShowWinningModal(!showWinningModal);
	};

	const [{ canDrop, isOver }, drop] = useDrop({
		accept: ItemTypes.CARD,
		drop: onDrop,
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	});

	useEffect(() => {
		if (artData) {
			if (artData.releaseDate <= now) {
				setReleased(true);
			}
		}
	}, [artData, now]);

	useEffect(() => {
		if (artData && artData.giveaway) {
			setGiveawayWinner(artData.giveaway);
			if (artData.giveaway === AddressZero) {
				setCanGiveaway(true);
			}
		}

		if (artData && artData.winners && artData.winners.length > 0) {
			setWinners(artData.winners);
			if (artData.winners.indexOf(AddressZero) >= 0) {
				setAllClaimed(false);
			} else {
				setAllClaimed(true);
			}
		}
		if (artData && artData.winners && account && artData.winners.length > 0) {
			if (artData.winners.indexOf(account.id) >= 0) {
				setAlreadyClaimed(true);
			}
		}
	}, [artData, account]);

	const onCheckAnswer = async () => {
		try {
			setResult(undefined);
			let meralIds = droppedMerals.map((meral) => meral.id);
			let petsIds = droppedPets.map((pet) => pet.id);
			let { data } = await checkAnswer(meralIds, petsIds, tokenId);
			if (data) {
				setResult(data.correct);
				if (data.correct) {
					// GET ALL POSSIBLE COMBOS
					setAnswers(data.answers);
					let _meralCombos = [];
					for (const key in data.answers.merals) {
						_meralCombos.push(data.answers.merals[key]);
					}
					setMeralCombos(_meralCombos);
					let _petCombos = [];
					for (const key in data.answers.pets) {
						_petCombos.push(data.answers.pets[key]);
					}
					setPetCombos(_petCombos);
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	const checkOwnership = (answers, owned) => {
		if (!owned && Object.keys(answers).length > 0) {
			return false;
		}
		if (!owned && Object.keys(answers).length === 0) {
			return true;
		}

		const _owned = owned.map((nft) => parseInt(nft.tokenId));

		let hitCount = 0;
		let candiatesCount = 0;

		for (const key in answers) {
			let listOfCandiates = answers[key];
			candiatesCount++;

			let hit = false;
			for (let i = 0; i < _owned.length; i++) {
				if (listOfCandiates.indexOf(_owned[i]) >= 0) {
					hitCount++;
					hit = true;
				}
			}

			if (!hit) {
				// EARLY EXIT
				return false;
			}
		}

		return hitCount >= candiatesCount;
	};

	useEffect(() => {
		if (answers && userMerals && account) {
			let meralResult = false;
			let petResult = false;
			if (answers.merals && account && userMerals) {
				meralResult = checkOwnership(answers.merals, userMerals);
			}
			if (answers.pets && account) {
				petResult = checkOwnership(answers.pets, account.pets);
			}

			if (meralResult && petResult) {
				setCanClaim(true);
			}
		}
	}, [answers, userMerals, account]);

	const onClaimReward = async () => {
		if (!alreadyClaimed && !allClaimed) {
			try {
				let meralIds = droppedMerals.map((meral) => parseInt(meral.id));
				let petsIds = droppedPets.map((pet) => parseInt(pet.id));
				let result = await claimReward(meralIds, petsIds, tokenId);
				if (result) {
					setAlreadyClaimed(true);
					setShowWinningModal(true);
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

	const onClaimGiveaway = async () => {
		if (canGiveaway) {
			try {
				let meralIds = droppedMerals.map((meral) => parseInt(meral.id));
				let petsIds = droppedPets.map((pet) => parseInt(pet.id));
				let result = await claimGiveaway(meralIds, petsIds, tokenId);
				if (result) {
					setCanGiveaway(false);
					setShowWinningModal(true);
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

	const onClearDrops = () => {
		clearDrops();
		setResult(undefined);
	};

	const isActive = canDrop && isOver;
	let backgroundColor = 'white';
	if (isActive) {
		backgroundColor = 'hsl(160, 70%, 95%)';
	} else if (canDrop) {
		backgroundColor = 'hsl(160, 10%, 95%)';
	}

	const html = `
<div class="center">
    <img style="
    width: 96vw;
    height: 96vh;
    object-fit:contain;"
    src="https://ethemerals-media.s3.amazonaws.com/art/${artData && artData.uid}.${artData && artData.type}" alt="game art" />
</div>
  `;

	return (
		<main ref={drop} style={{ left: '424px', width: 'calc(100% - 424px)', minWidth: '512px' }} className="mt-12 absolute pb-44">
			<div>
				<div style={{ maxWidth: '800px' }} className="w-4/5 mx-auto mt-12">
					{artData && released && (
						<Gallery
							options={{
								getThumbBoundsFn: undefined,
								showHideOpacity: false,
								shareButtons: [
									{ id: 'twitter', label: 'Tweet', url: 'https://twitter.com/intent/tweet?text={{text}}&url={{url}}' },
									{ id: 'pinterest', label: 'Pin it', url: 'http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}' },
								],
							}}
						>
							<Item html={html}>
								{({ open }) => (
									<div
										onClick={(e) => {
											e.preventDefault();
											open();
										}}
									>
										<img
											style={{ margin: 'auto', width: 'auto', height: '60vh', maxHeight: '60vh', objectFit: 'contain' }}
											src={`https://ethemerals-media.s3.amazonaws.com/art/${artData.uid}.${artData.type}`}
											alt="game art"
										/>
									</div>
								)}
							</Item>
						</Gallery>
					)}
					{artData && !released && (
						<div className="w-600 h-600 bg-gray-50 mx-auto">
							<p className="pt-48 text-gray-300 text-center">NOT YET RELEASED</p>
							<div className="mt-6 text-center">
								<p className="text-3xl">
									<Countdown date={artData.releaseDate} onComplete={() => setReleased(true)}></Countdown>
								</p>
							</div>
						</div>
					)}
				</div>

				<div style={{ backgroundColor }} className="w-full relative">
					{droppedPets.length === 0 && droppedMerals.length === 0 && !isOver && !canDrop && (
						<div className="absolute text-center mx-auto w-full mt-7 text-gray-200">
							<p className="text-gray-400 pb-2">Solve the puzzle by dragging the correct Meral cards (and maybe pets) into this box.</p>
							<p className="text-5xl">DRAG CARDS HERE</p>
						</div>
					)}
					<div ref={drop} style={{ height: '128px' }} className="flex space-x-2 justify-center pt-7 overflow-hidden">
						{droppedMerals.map((item) => (
							<div key={item.id}>
								<MeralThumbnail nft={item.nft} handleRemove={() => handleRemove(ItemTypes.MERALS, item.id)} />
							</div>
						))}
						{droppedPets.map((item) => (
							<div key={item.id}>
								<PetThumbnail nft={item.nft} handleRemove={() => handleRemove(ItemTypes.PETS, item.id)} />
							</div>
						))}
					</div>

					{/* ANSWER FIELD */}
					<div className="text-center h-16">
						{result === false && (
							<p>
								<span className="text-red-600 font-bold">WRONG!{` `}</span>
								<span className="text-sm">Try again...</span>
							</p>
						)}
						{result === true && (
							<>
								<p>
									<span className="text-green-600 font-bold">CORRECT!{` `}</span>
									<span className="text-sm">
										You can claim the rewards if you hold any of the NFT combination{' '}
										{canGiveaway && !canClaim && (
											<>
												OR claim a <strong>free random Meral!</strong>
											</>
										)}
									</span>
								</p>
							</>
						)}
					</div>

					<div className="flex justify-center space-x-4 mx-auto pb-6">
						{/* WRONG */}
						{!result && (
							<button
								onClick={onCheckAnswer}
								disabled={answerIsUpdating}
								className="bg-blue-100 w-52 text-bold px-4 py-2 rounded-lg shadow-lg hover:bg-blue-200 transition duration-300 flex justify-center items-center"
							>
								{answerIsUpdating ? (
									<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
								) : (
									'Check Answer'
								)}
							</button>
						)}

						{/* RIGHT AND LOGGED IN AND CAN CLAIM */}
						{result && account && canClaim && (
							<button
								onClick={onClaimReward}
								disabled={claimIsUpdating || alreadyClaimed || allClaimed}
								className="bg-green-100 w-52 text-bold px-4 py-2 rounded-lg shadow-lg hover:bg-green-200 transition duration-300 flex justify-center items-center"
							>
								{claimIsUpdating || isAuthenticating ? (
									<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
								) : alreadyClaimed ? (
									'???? Claimed ????'
								) : allClaimed ? (
									'Already Claimed'
								) : (
									'Claim Prize!'
								)}
							</button>
						)}

						{/* RIGHT AND LOGGED IN BUT CANT CLAIM */}
						{result && account && !canClaim && !canGiveaway && (
							<button disabled className="bg-gray-100 w-52 text-bold px-4 py-2 rounded-lg shadow-lg flex justify-center items-center">
								{isAuthenticating ? (
									<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
								) : (
									<span>You Dont Hold Enough!</span>
								)}
							</button>
						)}

						{/* RIGHT AND LOGGED IN BUT CANT CLAIM AND NOT WHALE */}
						{result && account && !canClaim && canGiveaway && (
							<button
								onClick={onClaimGiveaway}
								disabled={claimGiveawayIsUpdating}
								className="bg-green-100 w-52 text-bold px-4 py-2 rounded-lg shadow-lg hover:bg-green-200 transition duration-300 flex justify-center items-center"
							>
								{isAuthenticating || claimGiveawayIsUpdating ? (
									<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
								) : (
									<span>Claim Giveaway Meral!</span>
								)}
							</button>
						)}

						{/* RIGHT AND NOT LOGGED IN */}
						{result && !account && (
							<button onClick={login} className="bg-green-100 w-52 text-bold px-4 py-2 rounded-lg shadow-lg hover:bg-green-200 transition duration-300 flex justify-center items-center">
								<span>Connect Wallet</span>
							</button>
						)}

						<button onClick={onClearDrops} className="bg-blue-100 text-bold px-4 py-2 rounded-lg shadow-lg hover:bg-blue-200 transition duration-300">
							Clear All
						</button>
					</div>

					<div>
						{/* SHOW CANDIATES */}
						{result === true && (
							<div className="text-left px-8 py-4">
								<h3 className="font-bold">
									Art NFT claim requirements: <span className="font-normal">(your wallet needs at least one from each row)</span>
								</h3>
								{meralCombos && (
									<>
										{meralCombos.map((merals, index) => (
											<Combos key={index} list={merals} type={ItemTypes.MERALS} />
										))}
									</>
								)}
								{petCombos && (
									<>
										{petCombos.map((pets, index) => (
											<Combos key={index} list={pets} type={ItemTypes.PETS} />
										))}
									</>
								)}
							</div>
						)}

						<div>
							<div className="text-left px-6 py-4">
								{/* SHOW WINNERS */}
								<h3 className="font-bold py-2">HONORARY GIVEAWAY</h3>
								<h4 className="text-2xl">
									<span className="text-xl">????</span> 1st
									<span className="text-sm text-gray-500 font-bold">{` `}to claim</span>
								</h4>
								<div className="sm:px-10">
									<p className="text-xl pb-2"> {giveawayWinner && <span>{giveawayWinner === AddressZero ? 'Unclaimed' : shortenAddress(giveawayWinner)}</span>}</p>
									<p className="text-sm text-gray-600 pb-8">
										<strong>Prize</strong> - Solve the puzzle and win a random Meral from the treasury
									</p>
								</div>
							</div>

							<div className="text-left px-6">
								{/* SHOW WINNERS */}
								<h3 className="font-bold py-2">CORRECT MERAL HOLDERS</h3>

								<h4 className="text-2xl">
									???? 1st
									<span className="text-sm text-gray-500 font-bold">{` `}to claim</span>
								</h4>
								<div className="sm:px-10">
									<p className="text-xl pb-2"> {winners && winners.length === 3 && <span>{winners[0] === AddressZero ? 'Unclaimed' : shortenAddress(winners[0])}</span>}</p>
									<p className="text-sm text-gray-600 pb-8">
										<strong>Prize</strong> - This Art NFT & 2.5% royalties on sales, bonus 80HP / 900ELF to all Merals involved
									</p>
								</div>

								<h4 className="text-2xl">
									???? 2nd
									<span className="text-sm text-gray-500 font-bold">{` `}to claim</span>
								</h4>
								<div className="sm:px-10">
									<p className="text-xl pb-2"> {winners && winners.length === 3 && <span>{winners[1] === AddressZero ? 'Unclaimed' : shortenAddress(winners[1])}</span>}</p>
									<p className="text-sm text-gray-600 pb-8">
										<strong>Prize</strong> - Bonus 50HP / 680ELF to all Merals involved
									</p>
								</div>

								<h4 className="text-2xl">
									???? 3rd
									<span className="text-sm text-gray-500 font-bold">{` `}to claim</span>
								</h4>
								<div className="sm:px-10">
									<p className="text-xl pb-2"> {winners && winners.length === 3 && <span>{winners[2] === AddressZero ? 'Unclaimed' : shortenAddress(winners[2])}</span>}</p>
									<p className="text-sm text-gray-600 pb-8">
										<strong>Prize</strong> - Bonus 25HP / 260ELF to all Merals involved
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{showWinningModal && <WinningModal toggle={toggleWinningModal} />}
		</main>
	);
};

export default ArtDrop;
