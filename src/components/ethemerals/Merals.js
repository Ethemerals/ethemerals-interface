import { useState, useEffect } from 'react';
import NFTPreviewCard from './cards/NFTPreviewCard';
import { useQuery } from 'react-query';
import { getMeralsFiltered } from '../../hooks/useMeralData';
import PaginationBar from '../search/PaginationBar';

const Merals = ({ order, filters }) => {
	const [nfts, setNfts] = useState(undefined);
	const [page, setPage] = useState(0);

	const { data, isLoading } = useQuery([`meralsFiltered`, filters, order, page], () => getMeralsFiltered(filters, order, page), { refetchOnMount: false, keepPreviousData: true }); // TODO
	useEffect(() => {
		if (data && !isLoading) {
			setNfts(data);
		}
	}, [data, isLoading]);

	useEffect(() => {
		setPage(0);
	}, [order, filters]);

	const handleNextPage = () => {
		setPage((old) => old + 1);
	};

	const handlePreviousPage = () => {
		setPage((old) => Math.max(old - 1, 0));
	};

	return (
		<div>
			{isLoading ? (
				<div className="flex py-4 justify-center">Loading...</div>
			) : (
				<>
					{<PaginationBar handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} page={page} setPage={setPage} />}{' '}
					<div className="flex flex-wrap mx-auto justify-center">{nfts && nfts.map((nft) => <NFTPreviewCard key={nft.meralId} nft={nft} isFetching={isLoading} />)}</div>
					{nfts && nfts.length > 49 && <PaginationBar handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} page={page} setPage={setPage} />}
				</>
			)}
		</div>
	);
};

export default Merals;
