import { useEffect } from 'react';
import ArtFeature from '../components/art/ArtFeature';
import Gallery from '../components/art/Gallery';
import Upcoming from '../components/art/Upcoming';

const Art = () => {
	let featureId = process.env.REACT_APP_ART_FEATURE;
	// featureId = 1;

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="bg-white mx-2 md:mx-20">
			<ArtFeature tokenId={featureId} />
			<Upcoming />
			<Gallery />

			<div className="h-40"></div>
		</div>
	);
};

export default Art;
