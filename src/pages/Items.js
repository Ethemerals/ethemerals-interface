import { useState, useEffect } from 'react';
import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_ITEMS_ORDERED } from '../queries/Subgraph';
import { useHistory, useParams } from 'react-router-dom';
import EquipableItemPreviewCard from '../components/EquipableItemPreviewCard';

const maxQuery = 120;

const ItemsMinted = ({ orderDirection }) => {
	const { data, status } = useGQLQuery('items_minted', GET_ITEMS_ORDERED, { orderBy: 'timestamp', orderDirection: orderDirection, first: maxQuery }, { refetchOnMount: true });
	const [nfts, setNfts] = useState([]);

	useEffect(() => {
		if (status === 'success' && data && data.items) {
			setNfts(data.items);
		}
	}, [status, data]);

	return nfts.map((nft, index) => <EquipableItemPreviewCard key={index} nft={nft} />);
};

const ItemsRarity = ({ orderDirection }) => {
	const { data, status } = useGQLQuery('items_rarity', GET_ITEMS_ORDERED, { orderBy: 'rarity', orderDirection: orderDirection, first: maxQuery }, { refetchOnMount: true });
	const [nfts, setNfts] = useState([]);

	useEffect(() => {
		if (status === 'success' && data && data.items) {
			setNfts(data.items);
		}
	}, [status, data]);

	return nfts.map((nft, index) => <EquipableItemPreviewCard key={index} nft={nft} />);
};

const Items = () => {
	const { sort } = useParams();
	const history = useHistory();

	const [sortBy, setSortBy] = useState(0);

	useEffect(() => {
		if (sort >= 0 && sort <= 4) {
			setSortBy(parseInt(sort));
		}
	}, [sort]);

	return (
		<div className="scrollbar_pad">
			<div className="page_bg"></div>
			<div className="text-sm font-bold text-white sm:hidden mt-4 text-center">FILTER</div>
			<div className="flex items-center mx-auto mt-2 sm:mt-10 text-sm sm:text-base justify-center">
				<span className="text-xs font-bold px-2 text-white hidden sm:flex">SORT BY</span>

				<button
					onClick={() => history.push(`/items/0`)}
					className={`${sortBy === 0 ? 'bg-indigo-500' : 'bg-indigo-300 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none`}
				>
					Rarity
				</button>
				<button
					onClick={() => history.push(`/items/1`)}
					className={`${sortBy === 1 ? 'bg-indigo-500' : 'bg-indigo-300 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none`}
				>
					Token Number
				</button>
			</div>
			<div className="flex flex-wrap mx-auto justify-center">
				{sortBy === 0 && <ItemsMinted orderDirection="desc" />}
				{sortBy === 1 && <ItemsRarity orderDirection="desc" />}
			</div>
			<div className="h-40"></div>
		</div>
	);
};

export default Items;
