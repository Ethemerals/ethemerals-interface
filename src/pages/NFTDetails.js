import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';

import { useAddress } from '../hooks/Web3Context';
import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_NFT } from '../queries/Subgraph';
import useParseAction from '../hooks/useParseActions';

import NFTActions from '../components/modals/NFTActions';

import { shortenAddress, formatELF } from '../utils';

const ActionLink = (action) => {
	const [actionString, txLink] = useParseAction(action);

	return (
		<a href={txLink} target="_blank" rel="noreferrer" className="flex items-center hover:text-blue-400">
			{actionString}
			<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
				<polyline points="15 3 21 3 21 9"></polyline>
				<line x1="10" y1="14" x2="21" y2="3"></line>
			</svg>
		</a>
	);
};

const NFTDetails = () => {
	const address = useAddress();
	const history = useHistory();

	const { id } = useParams();
	const { data, status, isLoading } = useGQLQuery(`nft_${id}`, GET_NFT, { id: id }, { refetchOnMount: true });

	const [nft, setNFT] = useState({});
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (status === 'success' && data && data.ethemeral) {
			setNFT(data.ethemeral);
			setReady(true);
		}
	}, [status, data]);

	if (!ready || isLoading !== false || status !== 'success') {
		return <p>Loading {id}</p>;
	}

	return (
		<div>
			<h1>NFT Details</h1>
			<button type="button" onClick={() => history.goBack()}>
				Go back
			</button>
			{address && <NFTActions nft={nft} />}

			<div className="w-420 p-4 m-4 bg-gray-700 rounded shadow-lg">
				<h2 className="capitalize">{`${nft.metadata.coin} #${nft.id}`}</h2>
				<p>{nft.edition} of 10</p>

				<p>{nft.score} Honor Points</p>
				<p>{formatELF(nft.rewards)} Ethemeral Life Force</p>
				<h4 className="text-xl pt-2">Stats:</h4>
				<ul>
					<li>{nft.metadata.subClass}</li>
					<li>Special: {nft.metadata.special1}</li>
					<li>attack: {nft.metadata.attack}</li>
					<li>defence: {nft.metadata.defence}</li>
					<li>speed: {nft.metadata.speed}</li>
					<li>artist: {nft.metadata.artist}</li>
					<li>creator: {shortenAddress(nft.creator.id)}</li>
					<li>owner: {shortenAddress(nft.owner.id)}</li>
					<li>mint date: {nft.timestamp}</li>
				</ul>
				<h4 className="text-xl pt-2">Scorecard:</h4>
				<ul>
					<li>battles: {nft.scorecard.battles}</li>
					<li>wins: {nft.scorecard.wins}</li>
					<li>revived: {nft.scorecard.revived}</li>
					<li>resurrected: {nft.scorecard.resurrected}</li>
					<li>reaped: {nft.scorecard.reaped}</li>
					<li>drained: {nft.scorecard.drained}</li>
				</ul>

				<h4 className="text-xl pt-2">History:</h4>
				<ul>{status === 'success' && nft && nft.actions.length > 0 && nft.actions.map((action, index) => <li key={index}>{ActionLink(action)}</li>)}</ul>
			</div>
		</div>
	);
};

export default NFTDetails;
