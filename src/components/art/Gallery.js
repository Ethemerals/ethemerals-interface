import { useEffect } from 'react';
import ArtCardPast from './cards/ArtCardPast';
import { useArtGetArtsPast } from '../../hooks/useArtHunt';

const Gallery = () => {
	const { artData, isLoading } = useArtGetArtsPast();

	useEffect(() => {
		if (!isLoading) {
			console.log(artData);
		}
	}, [artData, isLoading]);

	return (
		<div style={{ minHeight: '256px' }} className="w-full h-96 m-4 mb-24">
			<h1 className="text-2xl border-gray-100 border-b-2 pb-4">Gallery</h1>
			<div className="flex flex-wrap mx-auto justify-center md:justify-start">
				{artData &&
					artData.map((art) => {
						return <ArtCardPast key={art.id} art={art} />;
					})}
			</div>
		</div>
	);
};

export default Gallery;
