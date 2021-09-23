import { useState, useEffect } from 'react';
import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_ITEMS_ORDERED, GET_PETS_ORDERED } from '../queries/Subgraph';
import EquipablePreviewCard from '../components/EquipablePreviewCard';
import { useHistory, useParams } from 'react-router-dom';
import EquipableItemPreviewCard from '../components/EquipableItemPreviewCard';

const maxQuery = 120;

const PetsMinted = ({ orderDirection }) => {
	const { data, status } = useGQLQuery('pets_minted', GET_PETS_ORDERED, { orderBy: 'timestamp', orderDirection: orderDirection, first: maxQuery }, { refetchOnMount: true });
	const [nfts, setNfts] = useState([]);

	useEffect(() => {
		if (status === 'success' && data && data.pets) {
			setNfts(data.pets);
		}
	}, [status, data]);

	return nfts.map((nft, index) => <EquipablePreviewCard key={index} nft={nft} />);
};

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

const Equipables = () => {
	const { type } = useParams();
	const history = useHistory();

	const [showType, setShowType] = useState();

	useEffect(() => {
		if (!showType) {
			setShowType('pets');
		} else {
			setShowType(type);
		}
	}, [type]);

	return (
		<div className="scrollbar_pad">
			<div className="page_bg"></div>
			<div className="text-sm font-bold text-white sm:hidden mt-4 text-center">FILTER</div>
			<div className="flex items-center mx-auto mt-2 sm:mt-10 text-sm sm:text-base justify-center">
				<span className="text-xs font-bold px-2 text-white hidden sm:flex">FILTER</span>

				<button
					onClick={() => history.push(`/equipables/pets`)}
					className={`${showType === 'pets' ? 'bg-indigo-500' : 'bg-indigo-300 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none`}
				>
					Pets
				</button>
				<button
					onClick={() => history.push(`/equipables/items`)}
					className={`${showType === 'items' ? 'bg-indigo-500' : 'bg-indigo-300 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none`}
				>
					Items
				</button>
			</div>
			<div className="flex flex-wrap mx-auto justify-center">
				{showType === 'pets' && <PetsMinted orderDirection="desc" />}
				{showType === 'items' && <ItemsMinted orderDirection="desc" />}
			</div>
			<div className="h-40"></div>
		</div>
	);
};

export default Equipables;
