import { useHistory } from 'react-router-dom';
import { useWildsLands } from '../../hooks/useWilds';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const LandCards = ({ land }) => {
	const history = useHistory();

	const handleOnClick = () => {
		history.push(`/wilds/land/${land.landId}`);
	};

	return (
		<div onClick={handleOnClick} className="bg-gray-200 w-44 h-64 bg-opacity-20 m-2 p-4 pb-20 border-4 border-white cursor-pointer hover:bg-opacity-100">
			<p>Wild Land: {land.landId}</p>
			{/* <p>Remaining ELFx: {land.remaining}</p> */}
			<p>Base Defence: {land.baseDefence}</p>
			<p>Raid Status: {land.raidStatus}</p>
			<p>Defenders: {land.defenders.length}/5</p>
			<p>Looters: {land.looters.length}/5</p>
			<p>Birthers: {land.birthers.length}/5</p>
			<p>Attackers: {land.attackers.length}/5</p>
		</div>
	);
};

const LandHub = () => {
	const history = useHistory();

	const handleOnClick = () => {
		history.push(`/wilds/hub`);
	};

	return (
		<div onClick={handleOnClick} className="bg-gray-200 w-44 bg-opacity-80 m-2 p-4 pb-20 border-4 border-white cursor-pointer hover:bg-opacity-100 mx-auto">
			<p>Home Hub</p>
		</div>
	);
};

const DevInfo = () => {
	return (
		<div className="bg-blue-600 bg-opacity-70 text-xs w-96 absolute right-0 top-12 text-white">
			<p>DEV: At a glance of 3 seconds need to show:</p>
			<p>- Hub as the main area of interest</p>
			<p>- Selectable / clickable regions of the map</p>
			<p>- very simple info about slots and raids on the regions</p>
		</div>
	);
};

const WildsWorld = () => {
	const { wildsLands } = useWildsLands();

	return (
		// <div className="bg_wilds bg-cover h-screen w-full pt-20 fixed overflow-y-auto">
		<div className="bg-black">
			<TransformWrapper initialScale={1.5} maxScale={2} centerOnInit={true}>
				<TransformComponent>
					<div className="bg_wilds bg-contain bg-no-repeat h-screen w-screen pt-20">
						<DevInfo />
						{/* <img style={{ width: '4000px', height: '4000px', objectFit: 'cover', position: 'absolute' }} src="https://ethemerals-media.s3.amazonaws.com/wilds/worldmap.jpg" alt="world map" /> */}
						<h1 className="text-white px-4">ALPHA VERSION</h1>
						<div className="flex flex-wrap justify-center">{wildsLands && wildsLands.slice(0, 3).map((land) => <LandCards key={land.landId} land={land} />)}</div>
						<LandHub />
						<div className="flex flex-wrap justify-center">{wildsLands && wildsLands.slice(3, wildsLands.length).map((land) => <LandCards key={land.landId} land={land} />)}</div>
					</div>
				</TransformComponent>
			</TransformWrapper>
		</div>
	);
};

export default WildsWorld;
