import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { AddressZero } from '@ethersproject/constants';
import { useArtGetArt } from '../hooks/useArtHunt';
import { shortenAddress } from '../utils';

import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
import { Gallery, Item } from 'react-photoswipe-gallery';

const CollectionDetail = ({ collection, tokenId }) => {
	if (collection === 0) {
		return (
			<>
				<p className="text-gray-400 text-sm">Kingdom of the Ethemerals - World Building Collection</p>
				<p className="text-gray-400 text-sm">Item #{tokenId} Single Edition</p>
			</>
		);
	} else {
		return null;
	}
};
const ArtDetails = () => {
	const { id: tokenId } = useParams();
	// GET ARTDATA
	const { artData } = useArtGetArt(tokenId);
	const [isClaimed, setIsClaimed] = useState(false);
	const [allClaimed, setAllClaimed] = useState(false);
	const [claimDate, setClaimDate] = useState('');
	const [winners, setWinners] = useState(undefined);
	const [title, setTitle] = useState('');
	const [desc, setDesc] = useState('');
	const history = useHistory();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		if (artData && artData.claimed !== null) {
			setIsClaimed(true);
			setClaimDate(artData.claimed);
			setTitle(artData.title);
			setDesc(artData.desc);
		} else {
			setTitle('Title Revealed once Claimed...');
			setDesc('Description will be revealed once the artwork has been claimed...');
		}
		if (artData && artData.winners) {
			setWinners(artData.winners);
		}
	}, [artData]);

	useEffect(() => {
		if (winners && winners.length > 0) {
			if (winners.indexOf(AddressZero) >= 0) {
				setAllClaimed(false);
			} else {
				setAllClaimed(true);
			}
		}
	}, [winners]);

	const handleOnClickGame = () => {
		history.push(`/artgame/${tokenId}`);
	};

	const html = `
  <div class="center">
  <img style="
  max-width: 96vw;
  height: 96vh;
  object-fit:contain;"
  src="https://ethemerals-media.s3.amazonaws.com/art/${tokenId}.jpg" alt="game art" />
</div>
  `;

	// const openSeaURL = `${Links.OPENSEAS}/${Addresses.Ethemerals}/${nft.id}`;

	return (
		<div className="w-full">
			<div className="py-20 h-full bg-gray-100">
				<div className="flex justify-center mx-auto">
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
										style={{ width: 'auto', height: '86vh', maxHeight: '86vh', objectFit: 'contain' }}
										className="cursor-pointer mx-auto"
										src={`https://ethemerals-media.s3.amazonaws.com/art/${tokenId}.jpg`}
										alt="Feature art"
									/>
								</div>
							)}
						</Item>
					</Gallery>
				</div>

				<p className="mt-4 flex justify-center text-gray-400">
					<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
					</svg>
				</p>
			</div>

			<div className="block md:grid md:grid-cols-2 m-4 md:m-6">
				{artData && (
					<>
						<div className="mx-auto">
							<h1 className="text-3xl md:text-5xl pt-4">{title}</h1>
							<CollectionDetail collection={artData.collection} tokenId={tokenId} />
							<p className="pt-8 text-gray-400 text-sm">Created by</p>
							<p className="pt-1 text-lg">
								<a href={artData.artistLink} target="_blank" rel="noreferrer" className="hover:text-blue-300 transition duration-300">
									{`@ ${artData.artist}`}
								</a>
							</p>
							<h1 className="text-2xl border-gray-100 border-b-2 pb-4 pt-16 mb-2">Description</h1>
							<p>{desc}</p>
						</div>
						<div className="mt-16">
							<div className="">
								<button
									onClick={handleOnClickGame}
									className="bg-blue-100 w-44 text-gray-800 text-bold px-4 py-2 rounded-lg shadow-lg hover:bg-blue-300 transition duration-300 flex justify-center items-center"
								>
									{allClaimed ? 'Already Claimed' : 'Claim artwork'}
								</button>
							</div>
							<div className="text-left py-10">
								{/* SHOW WINNERS */}
								<h3 className="font-bold py-2">WINNERS</h3>

								<h4 className="text-2xl">
									🥇 1st
									<span className="text-sm text-gray-500 font-bold">{` `}to claim</span>
								</h4>
								<div className="sm:px-10">
									<p className="text-xl pb-2"> {winners && winners.length === 3 && <span>{winners[0] === AddressZero ? 'Unclaimed' : shortenAddress(winners[0])}</span>}</p>
									<p className="text-sm text-gray-600 pb-8">
										<strong>Prize</strong> - This Art NFT & 2.5% royalties on sales, bonus 80HP / 900ELF to all Merals involved
									</p>
								</div>

								<h4 className="text-2xl">
									🥈 2nd
									<span className="text-sm text-gray-500 font-bold">{` `}to claim</span>
								</h4>
								<div className="sm:px-10">
									<p className="text-xl pb-2"> {winners && winners.length === 3 && <span>{winners[1] === AddressZero ? 'Unclaimed' : shortenAddress(winners[1])}</span>}</p>
									<p className="text-sm text-gray-600 pb-8">
										<strong>Prize</strong> - Bonus 50HP / 680ELF to all Merals involved
									</p>
								</div>

								<h4 className="text-2xl">
									🥉 3rd
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
					</>
				)}
			</div>
			<div className="h-96"></div>
		</div>
	);
};

export default ArtDetails;
