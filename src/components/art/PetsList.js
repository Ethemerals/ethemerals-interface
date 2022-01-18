import { useState, useEffect } from 'react';

import { useQuery } from 'react-query';
import PetDragableCard from './cards/PetDragableCard';
import { useUserAccount } from '../../hooks/useUser';
import PaginationBar from '../search/PaginationBar';
import { getPetsFiltered } from '../../hooks/usePetData';

const PetsList = ({ order, filters, allDropped }) => {
	const [nfts, setNfts] = useState(undefined);
	const [page, setPage] = useState(0);
	const { account } = useUserAccount();
	const [userNFTIds, setUserNFTIds] = useState([]);

	useEffect(() => {
		if (account && account.pets.length > 0) {
			let _userNFTIds = [];
			account.pets.forEach((nft) => {
				_userNFTIds.push(nft.id);
			});
			setUserNFTIds(_userNFTIds);
		}
	}, [account]);

	const { data, isError, isLoading } = useQuery([`petsFiltered`, filters, order, page], () => getPetsFiltered(filters, order, page), { refetchOnMount: false, keepPreviousData: true }); // TODO
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
					<div>
						{nfts &&
							nfts.map((nft) => {
								let dropped = false;
								allDropped.forEach((element) => {
									if (element.tokenId === nft.tokenId) {
										dropped = true;
										return;
									}
								});
								return <PetDragableCard key={nft.tokenId} nft={nft} owned={userNFTIds.indexOf(nft.tokenId) >= 0} dropped={dropped} />;
							})}
					</div>

					{nfts && nfts.length > 49 && <PaginationBar handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} page={page} setPage={setPage} />}
				</>
			)}
		</div>
	);
};

export default PetsList;
