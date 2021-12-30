import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const worldMap = 'https://ethemerals-media.s3.amazonaws.com/wilds/worldmap.png';

const LandCards = ({ landId }) => {
	const history = useHistory();

	const handleOnClick = () => {
		history.push(`/wilds/${landId}`);
	};

	return (
		<div onClick={handleOnClick} className="bg-gray-200 w-96 bg-opacity-80 m-2 p-4 pb-20 border-4 border-white cursor-pointer hover:bg-opacity-100">
			Wild Land {landId}
		</div>
	);
};

const Wilds = () => {
	// const [lands, setLands] = useState([1, 2, 3, 4, 5, 6]);
	const lands = [
		{
			id: 1,
		},
		{
			id: 2,
		},
		{
			id: 3,
		},
		{
			id: 4,
		},
		{
			id: 5,
		},
		{
			id: 6,
		},
	];

	return (
		<div style={{ backgroundImage: `url(${worldMap})` }} className="h-screen w-full pt-20 bg-center object-none fixed overflow-y-auto">
			<div className="flex flex-wrap justify-center">{lands && lands.map((land) => <LandCards key={land.id} landId={land.id} />)}</div>
			<div className="h-40"></div>
		</div>
	);
};

export default Wilds;
