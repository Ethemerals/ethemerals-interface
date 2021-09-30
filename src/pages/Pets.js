import { useState, useEffect } from 'react';
import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_PETS_ORDERED } from '../queries/Subgraph';
import EquipablePreviewCard from '../components/EquipablePreviewCard';
import { useHistory, useParams } from 'react-router-dom';

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

const PetsRarity = ({ orderDirection }) => {
	const { data, status } = useGQLQuery('pets_rarity', GET_PETS_ORDERED, { orderBy: 'rarity', orderDirection: orderDirection, first: maxQuery }, { refetchOnMount: true });
	const [nfts, setNfts] = useState([]);

	useEffect(() => {
		if (status === 'success' && data && data.pets) {
			setNfts(data.pets);
		}
	}, [status, data]);

	return nfts.map((nft, index) => <EquipablePreviewCard key={index} nft={nft} />);
};

const Pets = () => {
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
					onClick={() => history.push(`/pets/0`)}
					className={`${sortBy === 0 ? 'bg-indigo-500' : 'bg-indigo-300 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none`}
				>
					Rarity
				</button>
				<button
					onClick={() => history.push(`/pets/1`)}
					className={`${sortBy === 1 ? 'bg-indigo-500' : 'bg-indigo-300 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none`}
				>
					Token Number
				</button>
			</div>
			<div className="flex flex-wrap mx-auto justify-center">
				{sortBy === 0 && <PetsMinted orderDirection="desc" />}
				{sortBy === 1 && <PetsRarity orderDirection="desc" />}
			</div>
			<div className="h-40"></div>
		</div>
	);
};

export default Pets;
