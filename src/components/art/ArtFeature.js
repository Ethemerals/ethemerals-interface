import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { AddressZero } from '@ethersproject/constants';
import { useArtGetArt } from '../../hooks/useArtHunt';
import Spinner from '../../components/Spinner';
const CollectionDetail = ({ collection, tokenId }) => {
	if (collection === 0) {
		return (
			<>
				<p className="text-gray-600 text-sm">Kingdom of the Ethemerals - World Building Collection</p>
				<p className="text-gray-400 text-sm">Item #{tokenId} Single Edition</p>
			</>
		);
	} else {
		return null;
	}
};
const ArtFeature = ({ tokenId }) => {
	// GET ARTDATA
	const now = Date.now();
	const [released, setReleased] = useState(false);

	const { artData } = useArtGetArt(tokenId);

	const [title, setTitle] = useState('');

	const history = useHistory();

	useEffect(() => {
		if (artData) {
			if (artData.releaseDate <= now) {
				setReleased(true);
			}
		}
	}, [artData, now]);

	useEffect(() => {
		if (artData && artData.giveaway !== AddressZero) {
			setTitle(artData.title);
		} else {
			setTitle('Title Revealed once Claimed...');
		}
	}, [artData]);

	const handleOnClick = () => {
		history.push(`/art/${tokenId}`);
	};
	const handleOnClickGame = () => {
		history.push(`/artgame/${tokenId}`);
	};

	if (!artData) {
		return (
			<div>
				<div className="py-20 block md:py-24 md:w-11/12 md:mx-auto items-center">
					<div onClick={handleOnClick} className="flex">
						<div className="w-full h-600 flex justify-center">
							<Spinner size="h-16 w-16" margin="my-44" color="text-gray-200" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="py-20 block md:grid md:grid-cols-2 md:py-24 md:w-11/12 md:mx-auto items-center">
				<div onClick={handleOnClick} className="flex">
					{artData && released && (
						<img
							style={{ width: 'auto', height: '70vh', maxHeight: '70vh', objectFit: 'contain' }}
							className="cursor-pointer mx-auto"
							src={`https://ethemerals-media.s3.amazonaws.com/art/${artData.uid}.${artData.type}`}
							alt="Feature art"
						/>
					)}
					{artData && !released && (
						<div className="w-full h-600 bg-gray-50 ">
							<p className="pt-48 text-gray-300 text-center">NOT YET RELEASED</p>
						</div>
					)}
				</div>

				{artData && artData.giveaway && (
					<div className="mx-auto mt-4 md:mt-0 w-4/5 relative">
						<CollectionDetail collection={artData.collection} tokenId={tokenId} />
						<h1 className="text-3xl md:text-5xl pt-4">{title}</h1>

						<p className="pt-8 text-gray-400 text-sm">Created by</p>
						<p className="pt-1 text-lg">
							<a href={artData.artistLink} target="_blank" rel="noreferrer" className="hover:text-blue-300 transition duration-300">
								{`@ ${artData.artist}`}
							</a>
						</p>
						<div className="flex mt-8 md:mt-16 space-x-4">
							<button
								onClick={handleOnClick}
								className="bg-gray-50 w-44 text-gray-600 text-bold px-4 py-2 rounded-lg shadow-lg hover:bg-blue-100 transition duration-300 flex justify-center items-center"
							>
								View artwork
							</button>
							<button
								onClick={handleOnClickGame}
								className="bg-gray-50 w-44 text-gray-600 text-bold px-4 py-2 rounded-lg shadow-lg hover:bg-blue-100 transition duration-300 flex justify-center items-center"
							>
								Claim artwork
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ArtFeature;
