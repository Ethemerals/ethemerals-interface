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
			<div className="h-40">Come back next week!</div>
		</div>
	);
};

export default Equipables;
