import Onsen from '../onsen/Onsen';
import { useHistory } from 'react-router-dom';
const worldMap = 'https://ethemerals-media.s3.amazonaws.com/wilds/worldmap.png';

const WildsHub = () => {
	const history = useHistory();
	return (
		<div className="bg_wilds h-screen w-full fixed overflow-y-auto px-4">
			<div className="bg-gray-200 bg-opacity-80 p-4 pb-20 border-4 border-white mt-16 mb-4 w-96 mx-auto">
				<h1>Hub</h1>
			</div>
			<div className="flex space-x-2 justify-center">
				<div onClick={() => history.push(`/wilds/portal`)} className="bg-gray-200 bg-opacity-80 p-4 pb-20 border-4 border-white mt-16 mb-4 w-96 cursor-pointer hover:bg-blue-100">
					<h1>Portal</h1>
				</div>
				<Onsen />
				<div onClick={() => history.push(`/wilds/world`)} className="bg-gray-200 bg-opacity-80 p-4 pb-20 border-4 border-white mt-16 mb-4 w-96 cursor-pointer hover:bg-blue-100">
					<h1>World Map</h1>
				</div>
			</div>
		</div>
	);
};

export default WildsHub;
