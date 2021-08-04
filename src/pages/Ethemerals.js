import { useState, useEffect } from 'react';
import Checkbox from 'rc-checkbox';
import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_NFTS_ORDERED } from '../queries/Subgraph';
import NFTPreviewCard from '../components/NFTPreviewCard';
import { useHistory, useParams } from 'react-router-dom';

const maxQuery = 100;

const NFTRecentlyMintedSingle = () => {
	const { data, status } = useGQLQuery('nfts_minted_single', GET_NFTS_ORDERED, { orderBy: 'timestamp', first: maxQuery * 2 }, { refetchOnMount: true });
	const [nfts, setNfts] = useState([]);
	const [nftsSorted, setNftsSorted] = useState([]);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (status === 'success' && data && data.ethemerals) {
			setNfts(data.ethemerals);
			setNftsSorted(data.ethemerals);
			setReady(true);
		}
	}, [status, data]);

	useEffect(() => {
		if (nfts && nfts.length > 0) {
			let nftsFiltered = nfts.filter((nft) => nft.edition <= 1);
			setNftsSorted(nftsFiltered);
		}
	}, [nfts]);

	if (!ready || nftsSorted.length < 1) {
		return null;
	}
	return nftsSorted.map((nft, index) => <NFTPreviewCard key={index} nft={nft} />);
};

const NFTRecentlyMinted = () => {
	const { data, status } = useGQLQuery('nfts_minted', GET_NFTS_ORDERED, { orderBy: 'timestamp', first: parseInt(maxQuery * 1.5) }, { refetchOnMount: true });
	const [nfts, setNfts] = useState([]);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (status === 'success' && data && data.ethemerals) {
			setNfts(data.ethemerals);
			setReady(true);
		}
	}, [status, data]);

	if (!ready || nfts.length < 1) {
		return null;
	}
	return nfts.map((nft, index) => <NFTPreviewCard key={index} nft={nft} />);
};

const NFTScore = () => {
	const { data, status } = useGQLQuery('nfts_score', GET_NFTS_ORDERED, { orderBy: 'score', first: maxQuery }, { refetchOnMount: true });
	const [nfts, setNfts] = useState([]);
	const [nftsSorted, setNftsSorted] = useState([]);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (status === 'success' && data && data.ethemerals) {
			setNfts(data.ethemerals);
			setReady(true);
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
					return parseInt(a.timestamp) - parseInt(b.timestamp);
				}
				return -1;
			});
			setNftsSorted(nftsToSort);
		}
	}, [nfts]);

	if (!ready || nftsSorted.length < 1) {
		return null;
	}
	return nftsSorted.map((nft, index) => <NFTPreviewCard key={index} nft={nft} />);
};

const NFTRewards = () => {
	const { data, status } = useGQLQuery('nfts_rewards', GET_NFTS_ORDERED, { orderBy: 'rewards', first: maxQuery }, { refetchOnMount: true });
	const [nfts, setNfts] = useState([]);
	const [nftsSorted, setNftsSorted] = useState([]);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (status === 'success' && data && data.ethemerals) {
			setNfts(data.ethemerals);
			setReady(true);
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
					return parseInt(a.timestamp) - parseInt(b.timestamp);
				}
				return -1;
			});
			setNftsSorted(nftsToSort);
		}
	}, [nfts]);

	if (!ready || nftsSorted.length < 1) {
		return null;
	}
	return nftsSorted.map((nft, index) => <NFTPreviewCard key={index} nft={nft} />);
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

	const onChange = (e) => {
		if (e.target.checked) {
			history.push(`/ethemerals/0`);
		} else {
			history.push(`/ethemerals/1`);
		}
	};

	return (
		<div className="scrollbar_pad">
			<div className="page_bg"></div>
			<div className="flex flex-wrap items-center mx-auto mt-10 justify-center">
				<span className="text-xs font-bold px-2 text-gray-800">SORT BY</span>

				<button
					onClick={() => history.push(`/ethemerals/2`)}
					className={`${sortBy === 2 ? 'bg-indigo-700 text-gray-100' : ' bg-indigo-400 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none font-bold`}
				>
					Honor Points
				</button>
				<button
					onClick={() => history.push(`/ethemerals/3`)}
					className={`${sortBy === 3 ? 'bg-indigo-700 text-gray-100' : 'bg-indigo-400 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none font-bold`}
				>
					ELF Balance
				</button>
				<span className="w-14"></span>
				<button
					onClick={() => history.push(`/ethemerals/0`)}
					className={`${sortBy < 2 ? 'bg-indigo-700 text-gray-100' : 'bg-indigo-400 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none font-bold`}
				>
					Recently Minted
				</button>
				<span className="w-2"></span>
				<div className={`${sortBy < 2 ? 'opacity-100' : 'opacity-30'}`}>
					<label>
						{sortBy === 1 && <Checkbox defaultChecked={false} onChange={onChange} disabled={false} />}
						{sortBy === 0 && <Checkbox defaultChecked={true} onChange={onChange} disabled={false} />}
						{sortBy > 1 && <Checkbox defaultChecked={false} disabled={true} />}
					</label>
					<span className="text-xs font-bold px-2 text-gray-800">SINGLE EDITIONS ONLY</span>
				</div>
				<div className="md:flex md:w-0.5 flex-none w-full"></div>
			</div>

			<div className="flex flex-wrap mx-auto justify-center">
				{sortBy === 0 && <NFTRecentlyMintedSingle />}
				{sortBy === 1 && <NFTRecentlyMinted />}
				{sortBy === 2 && <NFTScore />}
				{sortBy === 3 && <NFTRewards />}
			</div>

			<div className="h-40"></div>
		</div>
	);
};

export default Ethemerals;
