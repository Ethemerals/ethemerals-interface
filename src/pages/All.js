import { useState, useEffect } from 'react';
import { useGQLQueryL1 } from '../hooks/useGQLQuery';
import { GET_NFTS_FILTERED } from '../queries/Subgraph';

import { useParams } from 'react-router-dom';
import { getMeralImagesByTokenId } from '../hooks/useMeralData';

const NFTMC = () => {
	const { data, status } = useGQLQueryL1('nfts_mc', GET_NFTS_FILTERED, { refetchOnMount: false });
	const [nfts, setNfts] = useState([]);

	useEffect(() => {
		if (status === 'success' && data && data.ethemerals) {
			setNfts(data.ethemerals);
		}
	}, [status, data]);

	return nfts.map((nft) => (
		<div key={nft.id} className="border-white border">
			<p className="text-black text-xl px-2 py-1">{nft.name}</p>
			<p className="text-black px-2 py-1">{nft.subClass}</p>
			<img width="630" height="720" className="" src={getMeralImagesByTokenId(nft.tokenId).large} alt="" />{' '}
		</div>
	));
};

const All = () => {
	const { sort } = useParams();

	const [sortBy, setSortBy] = useState(2);

	useEffect(() => {
		if (sort >= 0 && sort <= 4) {
			setSortBy(parseInt(sort));
		}
	}, [sort]);

	return (
		<div>
			<div className="page_bg"></div>

			<div className="flex flex-wrap mx-auto justify-center">{sortBy === 2 && <NFTMC orderDirection="asc" />}</div>

			<div className="h-40"></div>
		</div>
	);
};

export default All;
