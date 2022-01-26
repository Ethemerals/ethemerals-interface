import NiceModal from '@ebay/nice-modal-react';
import WorldMapButton from './buttons/WorldMapButton';
import { modalRegistry } from '../niceModals/RegisterModals';

const DevInfo = () => {
	return (
		<div className="bg-blue-600 bg-opacity-70 text-xs w-96 absolute right-0 top-12 text-white">
			<p>DEV: At a glance of 3 seconds need to show:</p>
			<p>- Areas on interest That is selectable</p>
		</div>
	);
};

const WildsHub = () => {
	const showOnsenModal = () => {
		NiceModal.show(modalRegistry.openOnsen);
	};

	const showPortalModal = () => {
		NiceModal.show(modalRegistry.openPortal);
	};

	return (
		<div className="bg_wilds_hub h-screen w-full fixed overflow-y-auto px-4">
			<DevInfo />
			<div className="mt-24 text-white">
				<h1 className="text-5xl">Hub</h1>
			</div>
			<div className="flex flex-wrap justify-center">
				<div
					style={{ backgroundImage: "url('https://ethemerals-media.s3.amazonaws.com/wilds/portal.jpg'" }}
					onClick={showPortalModal}
					className="bg-gray-200 bg-opacity-80 p-4 my-4 w-96 h-44 cursor-pointer hover:bg-blue-100 mr-4 bg-none bg-right"
				>
					<h1 className="text-white">Portal</h1>
				</div>
				{/* <Onsen /> */}
				<div
					style={{
						backgroundRepeat: 'no-repeat',
						backgroundImage: "url('https://static.displate.com/857x1200/displate/2021-02-18/e81f4ff8dedec2a9f86fd0a2fe183c14_83b935a5ee01e62c6e0842d895c3bc26.jpg')",
					}}
					onClick={showOnsenModal}
					className="bg-gray-200 bg-opacity-80 p-4 my-4 w-96 h-44 cursor-pointer hover:bg-blue-100 mr-4 bg-cover"
				>
					<h1 className="text-white">Onsen</h1>
				</div>
				<div className="bg-gray-200 bg-opacity-80 p-4 my-4 w-96 h-44 cursor-pointer hover:bg-blue-100 mr-4">
					<h1>Market</h1>
					under construction
				</div>
				<div className="bg-gray-200 bg-opacity-80 p-4 my-4 w-96 h-44 cursor-pointer hover:bg-blue-100 mr-4">
					<h1>Practice Dojo</h1>
					under construction
				</div>
				<div className="bg-gray-200 bg-opacity-80 p-4 my-4 w-96 h-44 cursor-pointer hover:bg-blue-100 mr-4">
					<h1>Evolution Spring</h1>
					under construction
				</div>
				<div className="bg-gray-200 bg-opacity-80 p-4 my-4 w-96 h-44 cursor-pointer hover:bg-blue-100 mr-4">
					<h1>Hire Recruits</h1>
					under construction
				</div>
				<div className="bg-gray-200 bg-opacity-80 p-4 my-4 w-96 h-44 cursor-pointer hover:bg-blue-100 mr-4">
					<h1>Blacksmith</h1>
					under construction
				</div>
				<div className="bg-gray-200 bg-opacity-80 p-4 my-4 w-96 h-44 cursor-pointer hover:bg-blue-100 mr-4">
					<h1>Hall Of Champions</h1>
					under construction
				</div>
				<div className="bg-gray-200 bg-opacity-80 p-4 my-4 w-96 h-44 cursor-pointer hover:bg-blue-100 mr-4">
					<h1>Quest Board</h1>
					under construction
				</div>
				<div className="bg-gray-200 bg-opacity-80 p-4 my-4 w-96 h-44 cursor-pointer hover:bg-blue-100 mr-4">
					<h1>Send and Retrieve Merals</h1>
					Short Cut to maps - under construction
				</div>
			</div>

			<WorldMapButton />
		</div>
	);
};

export default WildsHub;
