import Onsen from '../onsen/Onsen';

const worldMap = 'https://ethemerals-media.s3.amazonaws.com/wilds/worldmap.png';

const WildsHub = () => {
	return (
		<div style={{ backgroundImage: `url(${worldMap})` }} className="h-screen w-full bg-center object-none fixed overflow-y-auto px-4">
			<div className="bg-gray-200 bg-opacity-80 p-4 pb-20 border-4 border-white mt-16 mb-4 w-96">
				<h1>Hub</h1>
			</div>
			<Onsen />
		</div>
	);
};

export default WildsHub;
