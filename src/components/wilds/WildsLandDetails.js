import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GET_LAND } from '../../queries/SubgraphWilds';
import { useGQLQuery } from '../../hooks/useGQLQuery';

import WildsStake from './actions/WildsStake';
import WildsUnstake from './actions/WildsUnstake';
import WildsRaidActions from './actions/WildsRaidActions';
import StakedWildsCard from './cards/stakedWildsCard';
import { useWildsContract } from '../../hooks/useWilds';

const worldMap = 'https://ethemerals-media.s3.amazonaws.com/wilds/worldmap.png';

const WildsLandDetails = () => {
	const { id } = useParams();
	let landId = id;
	const { data, status } = useGQLQuery(`land_${landId}`, GET_LAND, { id: landId }, { refetchOnMount: true });
	const [land, setLand] = useState(undefined);
	const { contractWilds } = useWildsContract();

	const [landStats, setLandStats] = useState(undefined);
	const [defenders, setDefenders] = useState(undefined);
	const [looters, setLooters] = useState(undefined);
	const [birthers, setBirthers] = useState(undefined);
	const [attackers, setAttackers] = useState(undefined);
	const [LCPs, setLCPs] = useState(undefined);

	useEffect(() => {
		if (status === 'success' && data && data.wildLand) {
			setLand(data.wildLand);
		}
	}, [status, data]);

	useEffect(() => {
		if (land) {
			let _landStats = {
				id: land.id,
				raidStatus: land.raidStatus,
				remaining: land.remainingELFx ? land.remainingELFx : 0, // TODO hardcode graph
				rate: land.emissionRate ? land.emissionRate : 0, // TODO hardcode graph
				lastEvent: land.lastEvent,
				lastRaid: land.lastRaid,
				baseDefence: land.baseDefence,
			};
			setLandStats(_landStats);
		}
		if (land && land.wildStakes.length > 0) {
			let _defenders = [];
			let _looters = [];
			let _birthers = [];
			let _attackers = [];
			land.wildStakes.forEach((stake) => {
				if (stake.stakeType === '1') {
					_defenders.push(stake);
				}
				if (stake.stakeType === '2') {
					_looters.push(stake);
				}
				if (stake.stakeType === '3') {
					_birthers.push(stake);
				}
				if (stake.stakeType === '4') {
					_attackers.push(stake);
				}
			});
			setDefenders(_defenders);
			setLooters(_looters);
			setBirthers(_birthers);
			setAttackers(_attackers);
		}
		if (land && land.lcp.length > 0) {
			setLCPs(land.lcp);
		}
	}, [land]);

	return (
		<div style={{ backgroundImage: `url(${worldMap})` }} className="h-screen w-full bg-center object-none fixed overflow-y-auto px-4">
			<div className="bg-gray-200 bg-opacity-80 p-4 pb-20 border-4 border-white mt-16 mb-4 w-96">
				<h1>Wilds: {landId}</h1>
				{landStats && (
					<div>
						<p>Remaining ELFx: {landStats.remaining}</p>
						<p>ELFx emmision rate: {landStats.rate} per hour</p>
						<p>Base Defence: {landStats.baseDefence}</p>
						<p>Raid Status: {landStats.raidStatus}</p>
					</div>
				)}

				<div className="my-4">
					<h4 className="font-bold">Highest Land Claim Points:</h4>
					{LCPs &&
						LCPs.map((lcp) => (
							<div key={lcp.id}>
								<p>
									<span className="px-2">Meral: #{lcp.id.slice(2)}</span>
									<span className="px-2">Points: {(lcp.points / 1000).toFixed(2)}</span>
								</p>
							</div>
						))}
				</div>

				{land && <WildsStake contractWilds={contractWilds} landId={landId} />}
			</div>

			<div className="flex pb-96 space-x-4">
				<div className="bg-gray-200 bg-opacity-80 p-4 pb-20 border-4 border-white w-96">
					<h4 className="font-bold text-xl">Defenders:</h4>
					{defenders && defenders.map((nft) => <StakedWildsCard key={nft.id} landId={landId} tokenId={nft.id} contractWilds={contractWilds} stakeAction={1} raidStatus={land.raidStatus} />)}
					{land && <WildsRaidActions contractWilds={contractWilds} landId={landId} />}
				</div>

				<div className="bg-gray-200 bg-opacity-80 p-4 pb-20 border-4 border-white w-96">
					<h4 className="font-bold text-xl">Attackers:</h4>
					{attackers && attackers.map((nft) => <StakedWildsCard key={nft.id} landId={landId} tokenId={nft.id} contractWilds={contractWilds} stakeAction={4} raidStatus={land.raidStatus} />)}
					<h4>Raid Actions</h4>
					{land && <WildsRaidActions contractWilds={contractWilds} landId={landId} />}
				</div>

				<div className="bg-gray-200 bg-opacity-80 p-4 pb-20 border-4 border-white w-96">
					<h4 className="font-bold text-xl">Looters:</h4>
					{looters && looters.map((nft) => <StakedWildsCard key={nft.id} landId={landId} tokenId={nft.id} contractWilds={contractWilds} stakeAction={2} raidStatus={land.raidStatus} />)}
				</div>

				<div className="bg-gray-200 bg-opacity-80 p-4 pb-20 border-4 border-white w-96">
					<h4 className="font-bold text-xl">Birthers:</h4>
					{birthers && birthers.map((nft) => <StakedWildsCard key={nft.id} landId={landId} tokenId={nft.id} contractWilds={contractWilds} stakeAction={3} raidStatus={land.raidStatus} />)}
				</div>
			</div>
		</div>
	);
};

export default WildsLandDetails;
