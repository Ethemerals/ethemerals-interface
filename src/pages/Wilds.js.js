import { useEffect, useState } from 'react';
import WildLands from '../components/wilds/WildLands';

const worldMap = 'https://ethemerals-media.s3.amazonaws.com/wilds/worldmap.png';

const EnterTheWilds = () => {
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
			<div className="flex flex-wrap justify-center">{lands && lands.map((land) => <WildLands key={land.id} landId={land.id} />)}</div>
			<div className="h-40"></div>
		</div>
	);
};

export default EnterTheWilds;
