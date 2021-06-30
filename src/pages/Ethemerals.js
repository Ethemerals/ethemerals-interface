import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_NFTS } from '../queries/Subgraph';

import { shortenAddress } from '../utils';

const NFTCard = ({ nft }) => {
	return (
		<div className="w-64 h-96 p-4 m-4 bg-gray-700 rounded shadow-lg">
			<Link to={`/ethemeral/${nft.id}`}>
				<h2 className="capitalize">{`${nft.metadata.coin} #${nft.id}`}</h2>
				<p>{nft.edition} of 10</p>
			</Link>
			<p>{nft.score} Honor Points</p>
			<h4>Stats:</h4>
			<ul>
				<li>{nft.metadata.subClass}</li>
				<li>Special: {nft.metadata.special1}</li>
				<li>attack: {nft.metadata.attack}</li>
				<li>defence: {nft.metadata.defence}</li>
				<li>speed:{nft.metadata.speed}</li>
				<li>owner:{shortenAddress(nft.owner.id)}</li>
			</ul>
		</div>
	);
};
const Ethemerals = () => {
	const { data, status } = useGQLQuery('nfts', GET_NFTS);

	const [nfts, setNfts] = useState({});
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (status === 'success' && data && data.ethemerals) {
			setNfts(data.ethemerals);
			setReady(true);
		}
	}, [status, data]);

	return (
		<div>
			<h1>Ethemerals</h1>
			<p>
				Sort By:
				<button className="p-2 m-2 rounded bg-brandColor-purple">Recently Minted</button>
				<button className="p-2 m-2 rounded bg-brandColor-purple">Marketcap Rank</button>
				<button className="p-2 m-2 rounded bg-brandColor-purple">Highest Honor</button>
			</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xxl:grid-cols-5 max-w-max mx-auto">{ready && nfts.map((nft, index) => <NFTCard key={index} nft={nft} />)}</div>
		</div>
	);
};

export default Ethemerals;
