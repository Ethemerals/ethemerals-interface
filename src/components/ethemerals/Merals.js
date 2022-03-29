import { useState, useEffect } from 'react';
import NFTPreviewCard from './cards/NFTPreviewCard';
import { useQuery } from 'react-query';
import PaginationBar from '../search/PaginationBar';
import { gql, GraphQLClient } from 'graphql-request';
import { Links } from '../../constants/Links';
import { formatFilters } from '../../utils';

const endpoint = Links.SUBGRAPH_ENDPOINT_L1;
const graphQLClient = new GraphQLClient(endpoint);

const GET_NFTS = gql`
	query ($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!) {
		merals(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: { burnt: false }) {
			id
			type
			tokenId
			meralId
			timestamp
			hp
			elf
			xp
			atk
			def
			spd
			element
			cmId
			coin
			subclass
			mainclass
		}
	}
`;

const getNFTsFiltered = (variables, filters) => {
	return `
	query {
		merals(${variables}, where: ${filters}) {
			id
      type
			tokenId
			meralId
			timestamp
			hp
			elf
			xp
			atk
			def
			spd
			element
			cmId
			coin
			subclass
			mainclass
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
		console.log(error);
		throw new Error('get merals error');
	}
};

const Merals = ({ order, shouldFilter, filters }) => {
	const [nfts, setNfts] = useState(undefined);
	const [page, setPage] = useState(0);

	useEffect(() => {
		setPage(0);
	}, [order, shouldFilter, filters]);

	const { isLoading, data } = useQuery(
		[`nfts_${order.orderBy}_${order.orderDirection}_${shouldFilter}_${JSON.stringify(filters)}`, page],
		() => getMerals(page, order.orderBy, order.orderDirection, shouldFilter, filters),
		{
			keepPreviousData: true,
		}
	); // TODO

	useEffect(() => {
		if (data && data.merals && !isLoading) {
			setNfts(data.merals);
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
