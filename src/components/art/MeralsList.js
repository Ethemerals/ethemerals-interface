import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import MeralDragableCard from './cards/MeralDragableCard';
import { useUserAccount } from '../../hooks/useUser';
import { getMeralsFiltered } from '../../hooks/useMeralData';
import PaginationBar from '../search/PaginationBar';

const MeralsList = ({ order, filters, allDropped }) => {
	const [nfts, setNfts] = useState(undefined);
	const { userNFTs } = useUserAccount();
	const [userNFTIds, setUserNFTIds] = useState([]);
	const [page, setPage] = useState(0);

	useEffect(() => {
		if (userNFTs && userNFTs.length > 0) {
			let _userNFTIds = [];
			userNFTs.forEach((nft) => {
				_userNFTIds.push(nft.tokenId);
			});
			setUserNFTIds(_userNFTIds);
		}
	}, [userNFTs]);

	const { data, isError, isLoading } = useQuery([`meralsFiltered`, filters, order, page, 'firstEditions'], () => getMeralsFiltered(filters, order, page, true), {
		refetchOnMount: false,
		keepPreviousData: true,
	}); // TODO
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
								return <MeralDragableCard key={nft.meralId} nft={nft} owned={userNFTIds.indexOf(nft.tokenId) >= 0} dropped={dropped} />;
							})}
					</div>

					{nfts && nfts.length > 49 && <PaginationBar handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} page={page} setPage={setPage} />}
				</>
			)}
		</div>
	);
};

export default MeralsList;
