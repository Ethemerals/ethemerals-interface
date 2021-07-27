import { useState, useEffect } from 'react';
import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_NFTS } from '../queries/Subgraph';
import NFTPreviewCard from '../components/NFTPreviewCard';

const Ethemerals = () => {
	const { data, status } = useGQLQuery('nfts', GET_NFTS, {}, { refetchOnMount: true });

	const [nfts, setNfts] = useState({});
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (status === 'success' && data && data.ethemerals) {
			setNfts(data.ethemerals);
			setReady(true);
		}
	}, [status, data]);

	return (
		<div className="page-container">
			<p>
				Sort By:
				<button className="p-2 m-2 rounded bg-brandColor-purple">Recently Minted</button>
				<button className="p-2 m-2 rounded bg-brandColor-purple">Highest Honor</button>
			</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xxl:grid-cols-5 max-w-max mx-auto">
				{ready && nfts.map((nft, index) => <NFTPreviewCard key={index} nft={nft} />)}
			</div>
		</div>
	);
};

export default Ethemerals;
