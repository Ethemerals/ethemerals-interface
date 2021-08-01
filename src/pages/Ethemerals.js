import { useState, useEffect } from 'react';
import Checkbox from 'rc-checkbox';
import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_NFTS_ORDERED } from '../queries/Subgraph';
import NFTPreviewCard from '../components/NFTPreviewCard';

const maxQuery = 100;
const NFTRecentlyMinted = () => {
	const { data, status } = useGQLQuery('nfts_mint', GET_NFTS_ORDERED, { orderBy: 'timestamp', first: maxQuery }, { refetchOnMount: true });
	const [nfts, setNfts] = useState({});
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
	const [nfts, setNfts] = useState({});
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

const NFTRewards = () => {
	const { data, status } = useGQLQuery('nfts_rewards', GET_NFTS_ORDERED, { orderBy: 'rewards', first: maxQuery }, { refetchOnMount: true });
	const [nfts, setNfts] = useState({});
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

const Ethemerals = () => {
	const [sortBy, setSortBy] = useState(0);
	const [singleOnly, setSingleOnly] = useState(true);

	useEffect(() => {
		console.log(singleOnly);
	}, [singleOnly]);

	const onChange = (e) => {
		setSingleOnly(e.target.checked);
	};

	return (
		<div className="scrollbar_pad">
			<div className="page_bg"></div>
			<div className="text-center text-sm text-gray-200 flex items-center justify-center mb-2 mt-8">
				<span className="text-xs font-bold px-2">SORT BY</span>
				<button
					onClick={() => setSortBy(1)}
					className={`${sortBy === 1 ? 'bg-indigo-700 text-gray-100' : 'bg-gray-600 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none font-bold`}
				>
					Honor Points
				</button>
				<button
					onClick={() => setSortBy(2)}
					className={`${sortBy === 2 ? 'bg-indigo-700 text-gray-100' : 'bg-gray-600 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none font-bold`}
				>
					ELF Balance
				</button>
				<button
					onClick={() => setSortBy(0)}
					className={`${sortBy === 0 ? 'bg-indigo-700 text-gray-100' : 'bg-gray-600 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none font-bold`}
				>
					Recently Minted
				</button>
				<span className="w-2"></span>
				<div className={`${sortBy === 0 ? 'opacity-100' : 'opacity-20'}`}>
					<label>
						<Checkbox defaultChecked onChange={onChange} disabled={false} />
					</label>
					<span className="text-xs font-bold px-2">SINGLE EDITIONS ONLY</span>
				</div>
			</div>

			<div className="flex flex-wrap mx-auto justify-center">
				{sortBy === 0 && <NFTRecentlyMinted singleOnly={singleOnly} />}
				{sortBy === 1 && <NFTScore />}
				{sortBy === 2 && <NFTRewards />}
			</div>
			<div className="h-40"></div>
		</div>
	);
};

export default Ethemerals;
