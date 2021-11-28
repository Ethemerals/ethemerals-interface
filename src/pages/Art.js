import ArtFeature from '../components/art/ArtFeature';
import ArtGallery from '../components/art/ArtGallery';

const Art = () => {
	let featureId = 1;

	return (
		<div>
			<div style={{ maxWidth: '864px' }} className="bg-white bg-opacity-40 text-black text-left mx-auto mt-20 p-6">
				<h1 className=" text-brandColor-purple text-3xl">The Great Art Hunt</h1>
				<p>
					Coming soon... Meanwhile checkout the{' '}
					<a href="https://medium.com/@ethemerals/ethemerals-the-great-art-hunt-5f44a3579325" className="text-blue-600" target="blank" rel="noreferrer">
						medium post
					</a>
				</p>
			</div>
			<ArtFeature tokenId={featureId} />
			<ArtGallery />

			<div className="h-40"></div>
		</div>
	);
};

export default Art;
