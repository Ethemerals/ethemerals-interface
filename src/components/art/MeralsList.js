import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import MeralDragableCard from './cards/MeralDragableCard';
import { useUserAccount } from '../../hooks/useUser';
import PaginationBar from '../search/PaginationBar';
import { Links } from '../../constants/Links';
import { GraphQLClient } from 'graphql-request';
import gql from 'graphql-tag';
import { formatFilters } from '../../utils';

const endpoint = Links.SUBGRAPH_ENDPOINT_L1;
const graphQLClient = new GraphQLClient(endpoint);

const GET_NFTS = gql`
	query ($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!) {
		merals(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
			id
			tokenId
			timestamp
			element
			cmId
			owner
			coin
			subclass
		}
	}
`;

const getNFTsFiltered = (variables, filters) => {
	return `
	query {
		merals(${variables}, where: ${filters}) {
			id
      tokenId
			timestamp
			element
      cmId
      owner
      coin
      subclass
		}
	}
`;
};

const getMerals = async (page, orderBy, orderDirection, shouldFilter, filters) => {
	let amount = 50;
	try {
		let fetchData;
		if (shouldFilter) {
			const filtersString = formatFilters(filters);
			fetchData = await graphQLClient.request(getNFTsFiltered(`first: ${amount}, skip: ${page * amount}, orderBy: ${orderBy}, orderDirection: ${orderDirection}`, filtersString));
		} else {
			fetchData = await graphQLClient.request(GET_NFTS, { first: amount, skip: page * amount, orderBy, orderDirection });
		}
		return fetchData;
	} catch (error) {
		throw new Error('get merals error');
	}
};

const MeralsList = ({ order, shouldFilter, filters, allDropped }) => {
	const [nfts, setNfts] = useState(undefined);
	const { userMerals } = useUserAccount();
	const [userMeralsIds, setUserMeralsIds] = useState([]);
	const [page, setPage] = useState(0);

	useEffect(() => {
		if (userMerals && userMerals.length > 0) {
			let _userMeralsIds = [];
			userMerals.forEach((nft) => {
				_userMeralsIds.push(nft.tokenId);
			});
			setUserMeralsIds(_userMeralsIds);
		}
	}, [userMerals]);

	const { isLoading, isError, data } = useQuery(
		[`meral_art_${order.orderBy}_${order.orderDirection}_${shouldFilter}_${JSON.stringify(filters)}`, page],
		() => getMerals(page, order.orderBy, order.orderDirection, shouldFilter, filters),
		{
			keepPreviousData: true,
		}
	);

	// const { data, isError, isLoading } = useQuery([`meralsFiltered`, filters, order, page, 'firstEditions'], () => getMeralsFiltered(filters, order, page, true), {
	// 	refetchOnMount: false,
	// 	keepPreviousData: true,
	// }); // TODO
	useEffect(() => {
		if (data && !isLoading) {
			setNfts(data.merals);
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
							nfts.length > 0 &&
							nfts.map((nft) => {
								let dropped = false;
								allDropped.forEach((element) => {
									if (element.tokenId === nft.tokenId) {
										dropped = true;
										return;
									}
								});
								return <MeralDragableCard key={nft.id} nft={nft} owned={userMeralsIds.indexOf(nft.tokenId) >= 0} dropped={dropped} />;
							})}
					</div>

					{nfts && nfts.length > 49 && <PaginationBar handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} page={page} setPage={setPage} />}
				</>
			)}
		</div>
	);
};

export default MeralsList;
