import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import StakedWildsCard from '../cards/stakedWildsCard';

import EmptyWildsCard from '../cards/emptyWildsCard';
import WorldMapButton from '../buttons/WorldMapButton';

import SlotDetails from './buttons/DetailsButton';
import { StakeAction, useWildsLand } from '../../../hooks/useWilds';
import MeralList from '../../niceModals/cards/MeralList';
import MeralListWilds from './cards/MeralListWilds';

const Slots = ({ slots, land, contractWilds }) => {
	let empties = Array(5 - slots.length);
	return (
		<>
			{slots.map((nft) => (
				<StakedWildsCard key={nft.id} landId={land.id} tokenId={nft.id} contractWilds={contractWilds} stakeAction={4} raidStatus={land.raidStatus} />
			))}
			{Array.apply(null, empties).map((slot, index) => (
				<EmptyWildsCard key={index} />
			))}
		</>
	);
};

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

	const { wildsLand, defenders, attackers, looters, birthers } = useWildsLand(landId);

	const selectAndToggle = async (id) => {
		console.log('hi ', id);
	};

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
						<SlotDetails landId={landId} stakeAction={StakeAction.LOOT.type} />
						<MeralListWilds nfts={looters} select={selectAndToggle} />
					</div>

					<div className="w-72">
						<div className="bg-white bg-opacity-70 p-4 w-72 h-72">
							<h2>Defenders</h2>
							<SlotDetails landId={landId} stakeAction={StakeAction.DEFEND.type} />
							<MeralListWilds nfts={defenders} select={selectAndToggle} />
						</div>
						<div className="bg-white bg-opacity-70 p-4 w-72 h-72 my-2">
							<h2>Attackers</h2>
							{wildsLand && wildsLand.raidStatus < 0 ? <p>Not Raidable</p> : <SlotDetails landId={landId} stakeAction={StakeAction.ATTACK.type} />}
							<MeralListWilds nfts={attackers} select={selectAndToggle} />
						</div>
					</div>

					<div className="bg-white bg-opacity-70 p-4 w-72 h-72">
						<h2>Birthers</h2>
						<SlotDetails landId={landId} stakeAction={StakeAction.BIRTH.type} />
						<MeralListWilds nfts={birthers} select={selectAndToggle} />
					</div>
				</div>

				<WorldMapButton />
			</div>
		</div>
	);
};

export default WildsLand;
