import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import PetsPreviewCard from './cards/PetsPreviewCard';
import { getPetsFiltered } from '../../hooks/usePetData';
import PaginationBar from '../search/PaginationBar';

const Pets = ({ order, filters }) => {
	const [nfts, setNfts] = useState(undefined);
	const [page, setPage] = useState(0);

	const { data, isLoading, isError } = useQuery([`petsFiltered`, filters, order, page], () => getPetsFiltered(filters, order, page), { refetchOnMount: false, keepPreviousData: true }); // TODO
	useEffect(() => {
		if (data && !isLoading) {
			setNfts(data);
		}
	}, [data, isLoading]);

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
			) : isError ? (
				<div className="flex py-4 justify-center">Error...</div>
			) : (
				<>
					{data && <PaginationBar handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} page={page} setPage={setPage} />}
					<div className="flex flex-wrap mx-auto justify-center">{nfts && nfts.map((nft) => <PetsPreviewCard key={nft.tokenId} nft={nft} />)}</div>
					{nfts && nfts.length > 49 && <PaginationBar handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} page={page} setPage={setPage} />}
				</>
			)}
		</div>
	);
};

export default Pets;
