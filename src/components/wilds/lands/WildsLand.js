import { useParams } from 'react-router-dom';

import WorldMapButton from '../buttons/WorldMapButton';

import SlotDetailsButton from './buttons/SlotDetailsButton';
import { StakeAction, useWildsLand } from '../../../hooks/useWilds';

import MeralListWilds from './cards/MeralListWilds';

const DevInfo = () => {
	return (
		<div className="bg-blue-600 bg-opacity-70 text-xs w-96 absolute right-0 top-12 text-white">
			<p>DEV: At a glance of 3 seconds need to show:</p>
			<p>- number of defenders / looters / birthers</p>
			<p>- empty slots</p>
			<p>- if a raid is happening</p>
			<p>- Base defence (how strong is defenders against general health decline)</p>
		</div>
	);
};

const WildsLand = () => {
	const { id } = useParams();
	let landId = id;

	const { wildsLand, defenders, attackers, looters, birthers, isLoading } = useWildsLand(landId);

	const selectAndToggle = async (id) => {
		console.log('hi ', id);
	};

	if (isLoading || !wildsLand) {
		return (
			<div className="h-screen w-full fixed overflow-y-scroll">
				<DevInfo />
				<div className="bg_wilds_land bg-center bg-cover h-full p-4">
					<div className="w-full bg-white bg-opacity-70 py-2 my-10 h-12 flex items-center">
						<p>Details Bar</p>
					</div>
					<h1 className="text-5xl text-white">Wild Land {id}</h1>

					<div className="flex my-4 space-x-2 justify-center">
						<p>Loading</p>
					</div>

					<WorldMapButton />
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen w-full fixed overflow-y-scroll">
			<DevInfo />
			<div className="bg_wilds_land bg-center bg-cover h-full p-4">
				<div className="w-full bg-white bg-opacity-70 py-2 my-10 h-12 flex items-center">
					<p>Details Bar</p>
				</div>
				<h1 className="text-5xl text-white">Wild Land {id}</h1>

				<div className="flex my-4 space-x-2 justify-center">
					<div className="bg-white bg-opacity-70 p-4 w-72 h-72">
						<h2>Looters</h2>
						{defenders && defenders.length > 0 ? (
							<>
								<SlotDetailsButton landId={landId} stakeAction={StakeAction.LOOT.type} />
								<MeralListWilds nfts={looters} landId={landId} select={selectAndToggle} />
							</>
						) : (
							<>
								<p>Not Lootable</p>
								<p>Simple Info here about needing at least 1 Defender before Land is lootable</p>
							</>
						)}
					</div>

					<div className="w-72">
						<div className="bg-white bg-opacity-70 p-4 w-72 h-72">
							<h2>Defenders</h2>
							<SlotDetailsButton landId={landId} stakeAction={StakeAction.DEFEND.type} />
							<MeralListWilds nfts={defenders} landId={landId} select={selectAndToggle} />
							{wildsLand && <p>Base Defence: {wildsLand.baseDefence}</p>}
						</div>
						<div className="bg-white bg-opacity-70 p-4 w-72 h-32">
							<h2>Raiders:</h2>
							{wildsLand && wildsLand.raidStatus < 1 && (
								<>
									<p>Not Raidable</p>
									<p>Simple Info here about needing 5 Defenders before Land is raidable</p>
								</>
							)}
							<MeralListWilds nfts={attackers} landId={landId} select={selectAndToggle} />
						</div>
					</div>

					<div className="bg-white bg-opacity-70 p-4 w-72 h-72">
						<h2>Birthers</h2>
						{defenders && defenders.length > 0 ? (
							<>
								<SlotDetailsButton landId={landId} stakeAction={StakeAction.BIRTH.type} />
								<MeralListWilds nfts={birthers} landId={landId} select={selectAndToggle} />
							</>
						) : (
							<>
								<p>Not Birthable</p>
								<p>Simple Info here about needing at least 1 Defender before Land is birthable</p>
							</>
						)}
					</div>
				</div>

				<WorldMapButton />
			</div>
		</div>
	);
};

export default WildsLand;
