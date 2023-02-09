import { useEffect } from 'react';
import ArtFeature from '../components/art/ArtFeature';
import Gallery from '../components/art/Gallery';
import Upcoming from '../components/art/Upcoming';

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}
const Art = () => {
	let featureId = getRandomInt(13) + 1;
	// featureId = 1;

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="bg-white mx-2 md:mx-20">
			<ArtFeature tokenId={featureId} />
			<Gallery />
			<Upcoming />

			<div className="h-40"></div>
		</div>
	);
};

export default Art;
