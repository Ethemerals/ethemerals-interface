import ArtCardFuture from './cards/ArtCardFuture';
import { useArtGetArtsFuture } from '../../hooks/useArtHunt';

const Upcoming = () => {
	const { artData } = useArtGetArtsFuture();

	return (
		<div style={{ minHeight: '256px' }} className="w-full m-4 mb-24">
			<h1 className="text-2xl border-gray-100 border-b-2 pb-4">Upcoming Releases</h1>
			<div className="flex flex-wrap mx-auto justify-center md:justify-start">
				{artData &&
					artData.map((art) => {
						return <ArtCardFuture key={art.id} art={art} />;
					})}
			</div>
		</div>
	);
};

export default Upcoming;
