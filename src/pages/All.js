import { useState, useEffect } from 'react';
import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_NFTS_FILTERED } from '../queries/Subgraph';

import { useParams } from 'react-router-dom';
import { useNFTUtils } from '../hooks/useNFTUtils';

const NFTMC = () => {
	const { getNFTImages } = useNFTUtils();
	const { data, status } = useGQLQuery('nfts_mc', GET_NFTS_FILTERED, { refetchOnMount: false });
	const [nfts, setNfts] = useState([]);

	useEffect(() => {
		if (status === 'success' && data && data.ethemerals) {
			setNfts(data.ethemerals);
		}
	}, [status, data]);

	return nfts.map((nft, index) => (
		<div className="border-white border">
			<p className="text-black text-xl px-2 py-1">{nft.metadata.coin}</p>
			<p className="text-black px-2 py-1">{nft.metadata.subClass}</p>
			<img style={{ width: '630px', height: '720px' }} className="" src={getNFTImages(nft.metadata.id).large} alt="" />
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
		<div className="scrollbar_pad">
			<div className="page_bg"></div>

			<div className="flex flex-wrap mx-auto justify-center">{sortBy === 2 && <NFTMC orderDirection="asc" />}</div>

			<div className="h-40"></div>
		</div>
	);
};

export default All;
