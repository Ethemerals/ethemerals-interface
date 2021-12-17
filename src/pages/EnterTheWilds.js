import { useEffect } from 'react';

const Land = ({ props }) => {
	return (
		<div className=" w-64 h-96 bg-gray-400">
			<p>{props.id}</p>
			<p>Remaining ELFx: {props.remaining}</p>
			<p>ELFx emmision rate: {props.rate} per hour</p>
			<p>Lootable types: {props.lootables.toString()}</p>
			<p>Monster types: {props.monsters.toString()}</p>
			<p>Current Defenders: {props.defenders.toString()}</p>
		</div>
	);
};
const EnterTheWilds = () => {
	let landPlots = [
		{
			id: 1,
			LCP: {},
			remaining: 1000,
			rate: 10,
			lootables: [1, 2],
			monsters: [1, 2],
			defenders: [],
			attackers: [],
			looters: [],
			birthers: [],
		},
		{
			id: 2,
			LCP: {},
			remaining: 5000,
			rate: 20,
			lootables: [1, 2, 3],
			monsters: [1, 2, 3],
			defenders: [],
			attackers: [],
			looters: [],
			birthers: [],
		},
		{
			id: 3,
			LCP: {},
			remaining: 1000,
			rate: 5,
			lootables: [2, 3],
			monsters: [2, 3],
			defenders: [],
			attackers: [],
			looters: [],
			birthers: [],
		},
	];

	return (
		<div className="bg-gray-100 h-screen w-full pt-20">
			<div className="p-4">
				<h1>Lands</h1>
				<div className="flex flex-wrap space-x-3">
					{landPlots.map((land) => (
						<Land key={land.id} props={land} />
					))}
				</div>
				<div className="h-40"></div>
			</div>
		</div>
	);
};

export default EnterTheWilds;
