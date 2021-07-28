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
		<div>
			<div className="page_bg z-0"></div>
			<p className="text-center text-sm text-gray-400">
				<span className="text-xs font-bold">SORT BY</span>
				<button className="py-1 px-2 mx-2 rounded bg-gray-600 font-bold">Recently Minted</button>
				<button className="py-1 px-2 mx-2 rounded bg-gray-700">Highest Honor</button>
			</p>
			<p className="text-center text-sm my-2 text-gray-400">
				<span className="text-xs font-bold">SINGLE EDITIONS ONLY</span>
			</p>

			<div className="flex flex-wrap mx-auto justify-center">{ready && nfts.map((nft, index) => <NFTPreviewCard key={index} nft={nft} />)}</div>
			<div className="h-40"></div>
		</div>
	);
};

export default Ethemerals;
