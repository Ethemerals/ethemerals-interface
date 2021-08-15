import { useState, useEffect } from 'react';
import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_NFTS_ORDERED } from '../queries/Subgraph';
import NFTPreviewCard from '../components/NFTPreviewCard';
import { useHistory, useParams } from 'react-router-dom';

const maxQuery = 100;

const NFTRecentlyMinted = () => {
	const { data, status } = useGQLQuery('nfts_minted', GET_NFTS_ORDERED, { orderBy: 'timestamp', first: maxQuery }, { refetchOnMount: true });
	const [nfts, setNfts] = useState([]);

	useEffect(() => {
		if (status === 'success' && data && data.ethemerals) {
			setNfts(data.ethemerals);
		}
	}, [status, data]);

	return nfts.map((nft, index) => <NFTPreviewCard key={index} nft={nft} />);
};

const NFTScore = () => {
	const { data, status } = useGQLQuery('nfts_score', GET_NFTS_ORDERED, { orderBy: 'score', first: maxQuery }, { refetchOnMount: true });
	const [nfts, setNfts] = useState([]);
	const [nftsSorted, setNftsSorted] = useState([]);

	useEffect(() => {
		if (status === 'success' && data && data.ethemerals) {
			setNfts(data.ethemerals);
		}
	}, [status, data]);

	useEffect(() => {
		if (nfts && nfts.length > 0) {
			let nftsToSort = nfts;
			nftsToSort.sort((a, b) => {
				const aScore = parseInt(a.score);
				const bScore = parseInt(b.score);
				if (aScore - bScore < 0) {
					return 1;
				}
				if (aScore - bScore === 0) {
					return parseInt(b.timestamp) - parseInt(a.timestamp);
				}
				return -1;
			});
			setNftsSorted(nftsToSort);
		}
	}, [nfts]);

	return nftsSorted.map((nft, index) => <NFTPreviewCard key={index} nft={nft} />);
};

const NFTRewards = () => {
	const { data, status } = useGQLQuery('nfts_rewards', GET_NFTS_ORDERED, { orderBy: 'rewards', first: maxQuery }, { refetchOnMount: true });
	const [nfts, setNfts] = useState([]);
	const [nftsSorted, setNftsSorted] = useState([]);

	useEffect(() => {
		if (status === 'success' && data && data.ethemerals) {
			setNfts(data.ethemerals);
		}
	}, [status, data]);

	useEffect(() => {
		if (nfts && nfts.length > 0) {
			let nftsToSort = nfts;
			nftsToSort.sort((a, b) => {
				const aRewards = parseInt(a.rewards);
				const bRewards = parseInt(b.rewards);
				if (aRewards - bRewards < 0) {
					return 1;
				}
				if (aRewards - bRewards === 0) {
					return parseInt(b.timestamp) - parseInt(a.timestamp);
				}
				return -1;
			});
			setNftsSorted(nftsToSort);
		}
	}, [nfts]);

	return nftsSorted.map((nft, index) => <NFTPreviewCard key={index} nft={nft} rewards={true} />);
};

const Ethemerals = () => {
	const { sort } = useParams();
	const history = useHistory();

	const [sortBy, setSortBy] = useState(2);

	useEffect(() => {
		if (sort >= 0 && sort <= 4) {
			setSortBy(parseInt(sort));
		}
	}, [sort]);

	return (
		<div className="scrollbar_pad">
			<div className="page_bg"></div>
			<div className="text-sm font-bold text-white sm:hidden mt-4 text-center">SORT BY</div>
			<div className="flex items-center mx-auto mt-2 sm:mt-10 text-sm sm:text-xl justify-center">
				<span className="text-xs font-bold px-2 text-white hidden sm:flex">SORT BY</span>

				<button
					onClick={() => history.push(`/ethemerals/2`)}
					className={`${sortBy === 2 ? 'bg-indigo-500' : 'bg-indigo-300 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none`}
				>
					Honor Points
				</button>
				<button
					onClick={() => history.push(`/ethemerals/3`)}
					className={`${sortBy === 3 ? 'bg-indigo-500' : 'bg-indigo-300 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none`}
				>
					ELF Balance
				</button>
				<button
					onClick={() => history.push(`/ethemerals/1`)}
					className={`${sortBy < 2 ? 'bg-indigo-500' : 'bg-indigo-300 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none`}
				>
					Recently Minted
				</button>
			</div>

			<div className="flex flex-wrap mx-auto justify-center">
				{sortBy === 1 && <NFTRecentlyMinted />}
				{sortBy === 2 && <NFTScore />}
				{sortBy === 3 && <NFTRewards />}
			</div>

			<div className="h-40"></div>
		</div>
	);
};

export default Ethemerals;
