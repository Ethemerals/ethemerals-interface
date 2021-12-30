import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GET_LAND } from '../../queries/SubgraphWilds';
import { useGQLQuery } from '../../hooks/useGQLQuery';

import WildsStake from './actions/WildsStake';
import WildsUnstake from './actions/WildsUnstake';
import WildsRaidActions from './actions/WildsRaidActions';
import StakedWildsCard from './cards/stakedWildsCard';
import { useWildsContract, wildsParseInitValues } from '../../hooks/useWilds';

const worldMap = 'https://ethemerals-media.s3.amazonaws.com/wilds/worldmap.png';

const WildsLandDetails = () => {
	const { id } = useParams();
	let landId = id;
	const { data, status } = useGQLQuery(`land_${landId}`, GET_LAND, { id: landId }, { refetchOnMount: true });
	const [land, setLand] = useState(undefined);
	const { contractWilds } = useWildsContract();

	const [landParsed, setLandParsed] = useState(undefined);
	const [LCPs, setLCPs] = useState(undefined);

	useEffect(() => {
		if (status === 'success' && data && data.wildLand) {
			setLand(data.wildLand);
		}
	}, [status, data]);

	useEffect(() => {
		if (land) {
			const _land = wildsParseInitValues(land);
			setLCPs(land.lcp);
			setLandParsed(_land);
		}
	}, [land]);

	return (
		<div style={{ backgroundImage: `url(${worldMap})` }} className="h-screen w-full bg-center object-none fixed overflow-y-auto px-4">
			<div className="bg-gray-200 bg-opacity-80 p-4 pb-20 border-4 border-white mt-16 mb-4 w-96">
				<h1>Wilds: {landId}</h1>
				{landParsed && (
					<div>
						<p>Remaining ELFx: {landParsed.remaining}</p>
						<p>ELFx emmision rate: {landParsed.rate} per hour</p>
						<p>Base Defence: {landParsed.baseDefence}</p>
						<p>Raid Status: {landParsed.raidStatus}</p>
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
					{landParsed &&
						landParsed.defenders.map((nft) => <StakedWildsCard key={nft.id} landId={landId} tokenId={nft.id} contractWilds={contractWilds} stakeAction={1} raidStatus={land.raidStatus} />)}
					{land && <WildsRaidActions contractWilds={contractWilds} landId={landId} />}
				</div>

				<div className="bg-gray-200 bg-opacity-80 p-4 pb-20 border-4 border-white w-96">
					<h4 className="font-bold text-xl">Attackers:</h4>
					{landParsed &&
						landParsed.attackers.map((nft) => <StakedWildsCard key={nft.id} landId={landId} tokenId={nft.id} contractWilds={contractWilds} stakeAction={4} raidStatus={land.raidStatus} />)}
					<h4>Raid Actions</h4>
					{land && <WildsRaidActions contractWilds={contractWilds} landId={landId} />}
				</div>

				<div className="bg-gray-200 bg-opacity-80 p-4 pb-20 border-4 border-white w-96">
					<h4 className="font-bold text-xl">Looters:</h4>
					{landParsed && landParsed.looters.map((nft) => <StakedWildsCard key={nft.id} landId={landId} tokenId={nft.id} contractWilds={contractWilds} stakeAction={2} raidStatus={land.raidStatus} />)}
				</div>

				<div className="bg-gray-200 bg-opacity-80 p-4 pb-20 border-4 border-white w-96">
					<h4 className="font-bold text-xl">Birthers:</h4>
					{landParsed && landParsed.birthers.map((nft) => <StakedWildsCard key={nft.id} landId={landId} tokenId={nft.id} contractWilds={contractWilds} stakeAction={3} raidStatus={land.raidStatus} />)}
				</div>
			</div>
		</div>
	);
};

export default WildsLandDetails;
