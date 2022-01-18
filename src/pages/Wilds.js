import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useGQLQueryL1 } from '../hooks/useGQLQuery';
import { wildsParseInitValues } from '../hooks/useWilds';
import { GET_LANDS } from '../queries/SubgraphWilds';

const worldMap = 'https://ethemerals-media.s3.amazonaws.com/wilds/worldmap.png';

const LandCards = ({ land }) => {
	const history = useHistory();

	const handleOnClick = () => {
		history.push(`/wilds/${land.id}`);
	};

	return (
		<div onClick={handleOnClick} className="bg-gray-200 w-96 bg-opacity-80 m-2 p-4 pb-20 border-4 border-white cursor-pointer hover:bg-opacity-100">
			<p>Wild Land: {land.id}</p>
			<p>Remaining ELFx: {land.remaining}</p>
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
		history.push(`/wildshub`);
	};

	return (
		<div onClick={handleOnClick} className="bg-gray-200 w-96 bg-opacity-80 m-2 p-4 pb-20 border-4 border-white cursor-pointer hover:bg-opacity-100 mx-auto">
			<p>Home Hub</p>
		</div>
	);
};

const Wilds = () => {
	const [lands, setLands] = useState(undefined);
	const [landsParsed, setLandsParsed] = useState(undefined);
	const { data, status } = useGQLQueryL1(`lands`, GET_LANDS, { refetchOnMount: true });

	useEffect(() => {
		if (status === 'success' && data && data.wildLands) {
			setLands(data.wildLands);
		}
	}, [status, data]);

	useEffect(() => {
		let _landsParsed = [];
		if (lands && lands.length > 0) {
			lands.forEach((land) => {
				_landsParsed.push(wildsParseInitValues(land));
			});
			setLandsParsed(_landsParsed);
		}
	}, [lands]);

	return (
		<div style={{ backgroundImage: `url(${worldMap})` }} className="h-screen w-full pt-20 bg-center object-none fixed overflow-y-auto">
			<h1 className="text-white p-4">ALPHA VERSION</h1>
			<LandHub />
			<div className="flex flex-wrap justify-center">{landsParsed && landsParsed.map((land) => <LandCards key={land.id} land={land} />)}</div>
			<div className="h-40"></div>
		</div>
	);
};

export default Wilds;
