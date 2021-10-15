import { useState, useEffect } from 'react';
import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_NFTS_FILTERED } from '../queries/Subgraph';
import NFTPreviewCard from '../components/NFTPreviewCard';
import { useHistory, useParams } from 'react-router-dom';
import { useAllColors } from '../hooks/useColorTraits';

const NFTMC = ({ allColors }) => {
	const { data, status } = useGQLQuery('nfts_mc', GET_NFTS_FILTERED, { refetchOnMount: false });
	const [nfts, setNfts] = useState([]);

	useEffect(() => {
		if (status === 'success' && data && data.ethemerals) {
			setNfts(data.ethemerals);
		}
	}, [status, data]);

	return nfts.map((nft, index) => <NFTPreviewCard key={index} nft={nft} color={allColors[nft.id]} />);
};

const EthemeralsMC = () => {
	const { sort } = useParams();
	const history = useHistory();
	const { allColors } = useAllColors();
	const [aeIsLoading, setAeIsLoading] = useState(true);

	const [sortBy, setSortBy] = useState(2);

	useEffect(() => {
		if (allColors && allColors.length > 0) {
			setAeIsLoading(false);
		}
	}, [allColors]);

	useEffect(() => {
		if (sort >= 0 && sort <= 4) {
			setSortBy(parseInt(sort));
		}
	}, [sort]);

	return (
		<div className="scrollbar_pad">
			<div className="page_bg"></div>
			<div className="text-sm font-bold text-white sm:hidden mt-4 text-center">SORT BY</div>
			<div className="flex items-center mx-auto mt-2 sm:mt-10 text-sm sm:text-base justify-center">
				<button
					onClick={() => history.push(`/ethemerals`)}
					className={`${sortBy === 1 ? 'bg-indigo-500' : 'bg-indigo-300 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none`}
				>
					Minted
				</button>
				<button
					onClick={() => history.push(`/ethemerals/mc`)}
					className={`${sortBy === 2 ? 'bg-indigo-500' : 'bg-indigo-300 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none`}
				>
					Marketcap Rank
				</button>
			</div>
			<div style={{ height: '54px' }}></div>

			<div className="flex flex-wrap mx-auto justify-center">
				<NFTMC orderDirection="asc" allColors={allColors} />
			</div>

			<div className="h-40"></div>
		</div>
	);
};

export default EthemeralsMC;
