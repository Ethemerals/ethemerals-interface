import ArrivingSoon from '../components/art/ArrivingSoon';
import ArtFeature from '../components/art/ArtFeature';
import ArtGallery from '../components/art/ArtGallery';

const Art = () => {
	let featureId = process.env.REACT_APP_ART_FEATURE;

	return (
		<div className="bg-white">
			<div className=" h-3/5">
				<ArtFeature tokenId={featureId} />
			</div>
			<ArrivingSoon />
			<ArtGallery />

			<div className="h-40"></div>
		</div>
	);
};

export default Art;
