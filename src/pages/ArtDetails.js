import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { format } from 'date-fns';
import { Link } from 'react-scroll';
import { AddressZero } from '@ethersproject/constants';
import { useArtGetArt } from '../hooks/useArtHunt';
import { shortenAddress } from '../utils';
import Addresses from '../constants/contracts/Addresses';
import Links from '../constants/Links';

import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
import { Gallery, Item } from 'react-photoswipe-gallery';

const Details = ({ tokenId }) => {
	const openSeaURL = `${Links.OPENSEAS}/${Addresses.Art}/${tokenId}`;
	const etherscanURL = `${Links.ETHERSCAN_URL}token/${Addresses.Art}?a=${tokenId}`;
	return (
		<div className="w-64">
			<a href={openSeaURL} target="blank" rel="noreferrer">
				<p className=" my-2 flex items-center rounded-lg p-2 hover:shadow-md hover:text-blue-500 transition duration-300 cursor-pointer">
					<svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M100 50C100 77.6 77.6 100 50 100C22.4 100 0 77.6 0 50C0 22.4 22.4 0 50 0C77.6 0 100 22.4 100 50Z" fill="#2081E2" />
						<path
							d="M24.6999 51.7L24.8999 51.4L37.8999 31.1C38.0999 30.8 38.4999 30.8 38.6999 31.2C40.8999 36.1 42.6999 42.1 41.8999 45.9C41.4999 47.5 40.4999 49.6 39.2999 51.5C39.1999 51.8 38.9999 52.1 38.7999 52.3C38.6999 52.4 38.5999 52.5 38.3999 52.5H24.9999C24.6999 52.4 24.4999 52 24.6999 51.7Z"
							fill="white"
						/>
						<path
							d="M82.5999 55.5V58.7C82.5999 58.9 82.4999 59 82.2999 59.1C81.2999 59.5 77.7999 61.1 76.3999 63.1C72.6999 68.2 69.8999 75.5 63.6999 75.5H37.5999C28.3999 75.5 20.8999 68 20.8999 58.7V58.4C20.8999 58.2 21.0999 58 21.2999 58H35.9999C36.2999 58 36.4999 58.3 36.4999 58.5C36.3999 59.4 36.5999 60.4 36.9999 61.3C37.8999 63.1 39.6999 64.1 41.5999 64.1H48.7999V58.5H41.6999C41.2999 58.5 41.0999 58.1 41.2999 57.8C41.3999 57.7 41.4999 57.6 41.5999 57.4C42.2999 56.4 43.1999 55 44.1999 53.3C44.8999 52.2 45.4999 50.9 45.9999 49.7C46.0999 49.5 46.1999 49.3 46.2999 49C46.3999 48.6 46.5999 48.2 46.6999 47.9C46.7999 47.6 46.8999 47.3 46.9999 47C47.1999 46 47.2999 44.9 47.2999 43.7C47.2999 43.3 47.2999 42.8 47.1999 42.3C47.1999 41.8 47.0999 41.3 47.0999 40.8C47.0999 40.4 46.9999 39.9 46.8999 39.5C46.7999 38.8 46.6999 38.2 46.4999 37.5L46.3999 37.3C46.2999 36.9 46.1999 36.4 45.9999 36C45.5999 34.6 45.0999 33.2 44.5999 32C44.3999 31.5 44.1999 31 43.9999 30.5C43.6999 29.8 43.3999 29.1 43.0999 28.5C42.9999 28.2 42.7999 28 42.6999 27.7C42.5999 27.4 42.3999 27.1 42.2999 26.8C42.1999 26.6 42.0999 26.4 41.9999 26.2L41.0999 24.6C40.9999 24.4 41.1999 24.1 41.3999 24.2L46.8999 25.7L47.5999 25.9L48.3999 26.1L48.6999 26.2V22.9C48.6999 21.3 49.9999 20 51.4999 20C52.2999 20 52.9999 20.3 53.4999 20.8C53.9999 21.3 54.2999 22 54.2999 22.8V27.6L54.8999 27.8C54.8999 27.8 54.9999 27.8 54.9999 27.9C55.0999 28 55.2999 28.2 55.5999 28.4C55.7999 28.6 55.9999 28.8 56.2999 29C56.7999 29.4 57.4999 30 58.1999 30.6C58.3999 30.8 58.5999 30.9 58.6999 31.1C59.5999 31.9 60.5999 32.9 61.5999 34C61.8999 34.3 62.0999 34.6 62.3999 34.9C62.6999 35.2 62.8999 35.6 63.1999 35.9C63.4999 36.3 63.8999 36.8 64.1999 37.2C64.2999 37.4 64.4999 37.6 64.5999 37.9C64.9999 38.5 65.2999 39.1 65.6999 39.7C65.7999 40 65.9999 40.3 66.0999 40.6C66.4999 41.4 66.7999 42.2 66.8999 43.1C66.9999 43.3 66.9999 43.5 66.9999 43.6C67.0999 43.8 67.0999 44.1 67.0999 44.4C67.1999 45.3 67.0999 46.1 66.9999 47C66.8999 47.4 66.7999 47.7 66.6999 48.1C66.5999 48.4 66.4999 48.8 66.2999 49.2C65.9999 49.9 65.5999 50.6 65.1999 51.3C65.0999 51.5 64.8999 51.8 64.6999 52.1C64.4999 52.4 64.2999 52.6 64.1999 52.9C63.9999 53.2 63.6999 53.5 63.4999 53.8C63.2999 54.1 63.0999 54.4 62.7999 54.7C62.4999 55.1 62.0999 55.5 61.7999 55.9C61.5999 56.1 61.3999 56.4 61.0999 56.6C60.8999 56.8 60.6999 57.1 60.3999 57.3C60.0999 57.6 59.7999 57.9 59.4999 58.1L58.8999 58.6C58.7999 58.7 58.6999 58.7 58.5999 58.7H54.1999V64.3H59.6999C60.8999 64.3 62.0999 63.9 62.9999 63.1C63.2999 62.8 64.6999 61.6 66.3999 59.8C66.4999 59.7 66.4999 59.7 66.5999 59.7L81.7999 55.3C82.3999 55 82.5999 55.2 82.5999 55.5Z"
							fill="white"
						/>
					</svg>
					<span className="px-3">View on Opensea</span>
				</p>
			</a>
			<a href={etherscanURL} target="blank" rel="noreferrer">
				<p className="flex items-center rounded-lg p-2 hover:shadow-md hover:text-blue-500 transition duration-300 cursor-pointer">
					<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 293.775 293.671">
						<g id="etherscan-logo-circle" transform="translate(-219.378 -213.33)">
							<path
								id="Path_1"
								data-name="Path 1"
								d="M280.433,353.152A12.45,12.45,0,0,1,292.941,340.7l20.737.068a12.467,12.467,0,0,1,12.467,12.467v78.414c2.336-.692,5.332-1.43,8.614-2.2a10.389,10.389,0,0,0,8.009-10.11V322.073a12.469,12.469,0,0,1,12.468-12.47h20.778a12.469,12.469,0,0,1,12.467,12.467v90.279s5.2-2.106,10.269-4.245a10.408,10.408,0,0,0,6.353-9.577V290.9a12.466,12.466,0,0,1,12.466-12.467h20.778A12.468,12.468,0,0,1,450.815,290.9v88.625c18.014-13.055,36.271-28.758,50.759-47.639a20.926,20.926,0,0,0,3.185-19.537,146.6,146.6,0,0,0-136.644-99.006c-81.439-1.094-148.744,65.385-148.736,146.834a146.371,146.371,0,0,0,19.5,73.45,18.56,18.56,0,0,0,17.707,9.173c3.931-.346,8.825-.835,14.643-1.518a10.383,10.383,0,0,0,9.209-10.306V353.152"
								fill="#21325b"
							/>
							<path
								id="Path_2"
								data-name="Path 2"
								d="M244.417,398.641A146.808,146.808,0,0,0,477.589,279.9c0-3.381-.157-6.724-.383-10.049-53.642,80-152.686,117.4-232.79,128.793"
								transform="translate(35.564 80.269)"
								fill="#979695"
							/>
						</g>
					</svg>

					<span className="px-3">View on Etherscan</span>
				</p>
			</a>
		</div>
	);
};

const CollectionDetail = ({ collection, tokenId, releaseDate }) => {
	if (collection === 0) {
		return (
			<div className="text-gray-500 text-sm">
				<p>Collection - The Kingdom of the Ethemerals World Building</p>
				<p>Item #{tokenId} Single Edition</p>
				{releaseDate && <p>Released: {format(releaseDate, 'MMM dd yyyy')}</p>}
			</div>
		);
	} else {
		return null;
	}
};

const ArtDetails = () => {
	const { id: tokenId } = useParams();
	// GET ARTDATA
	const { artData } = useArtGetArt(tokenId);
	const [allClaimed, setAllClaimed] = useState(false);
	const [releaseDate, setReleaseDate] = useState(undefined);
	const [winners, setWinners] = useState(undefined);
	const [title, setTitle] = useState('');
	const [desc, setDesc] = useState('');
	const history = useHistory();

	// useEffect(() => {
	// 	window.scrollTo(0, 0);
	// }, []);

	useEffect(() => {
		if (artData && artData.releaseDate) {
			setReleaseDate(artData.releaseDate);
		}
		if (artData && artData.claimed !== null) {
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

				<p className="mt-4 text-gray-500 bg-gray-50 hover:shadow-lg transition duration-300 cursor-pointer w-9 mx-auto flex justify-center hover:bg-blue-100 rounded-xl">
					<Link to="desc_container" spy={true} smooth={true} duration={1000}>
						<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
					</Link>
				</p>
			</div>

			<div name="desc_container" className="block md:grid md:grid-cols-2 m-4 md:m-6">
				{artData && (
					<>
						<div className="mx-auto">
							<h1 className="text-3xl md:text-5xl pt-4 pb-4">{title}</h1>
							<CollectionDetail collection={artData.collection} tokenId={tokenId} releaseDate={releaseDate} />
							<p className="pt-8 text-gray-500 text-sm">Created by</p>
							<p className="pt-1 text-lg">
								<a href={artData.artistLink} target="_blank" rel="noreferrer" className="hover:text-blue-300 transition duration-300">
									{`@${artData.artist}`}
								</a>
							</p>

							<div style={{ minHeight: '256px' }} className="pt-16 ">
								<h1 className="text-2xl border-gray-100 border-b-2 pb-4 mb-2">Description</h1>
								<p>{desc}</p>
							</div>
							<div style={{ minHeight: '256px' }} className="pt-16 ">
								<h1 className="text-2xl border-gray-100 border-b-2 pb-4 mb-2">Details</h1>
								<Details tokenId={tokenId} />
							</div>
						</div>
						<div className="mt-6">
							<div className="">
								<button onClick={handleOnClickGame} className={`bg-blue-100 text-gray-800 text-bold px-4 py-2 rounded-lg shadow-lg hover:bg-blue-200 transition duration-300`}>
									{allClaimed ? 'Already Claimed' : 'Claim Artwork'}
								</button>
							</div>
							<div className="text-left py-10">
								{/* SHOW WINNERS */}

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
