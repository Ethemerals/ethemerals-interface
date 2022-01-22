import Onsen from '../onsen/Onsen';
import { useHistory } from 'react-router-dom';
import WorldMapButton from './buttons/WorldMapButton';

const WildsHub = () => {
	const history = useHistory();
	return (
		<div className="bg_wilds_hub h-screen w-full fixed overflow-y-auto px-4">
			<div className="text-5xl mt-24 text-white">
				<h1>Hub</h1>
			</div>
			<div className="flex flex-wrap">
				<div onClick={() => history.push(`/wilds/portal`)} className="bg-gray-200 bg-opacity-80 p-4 my-4 w-96 h-44 cursor-pointer hover:bg-blue-100 mr-4">
					<h1>Portal</h1>
				</div>
				{/* <Onsen /> */}
				<div className="bg-gray-200 bg-opacity-80 p-4 my-4 w-96 h-44 cursor-pointer hover:bg-blue-100 mr-4">
					<h1>Onsen</h1>
					under construction
				</div>
				<div className="bg-gray-200 bg-opacity-80 p-4 my-4 w-96 h-44 cursor-pointer hover:bg-blue-100 mr-4">
					<h1>Market</h1>
					under construction
				</div>
				<div className="bg-gray-200 bg-opacity-80 p-4 my-4 w-96 h-44 cursor-pointer hover:bg-blue-100 mr-4">
					<h1>Birthing Spring</h1>
					under construction
				</div>
			</div>

			<WorldMapButton />
		</div>
	);
};

export default WildsHub;
