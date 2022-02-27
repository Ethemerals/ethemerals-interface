import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import PetsPreviewCard from './cards/PetsPreviewCard';
import PaginationBar from '../search/PaginationBar';
import gql from 'graphql-tag';
import { Links } from '../../constants/Links';
import { GraphQLClient } from 'graphql-request';
import { formatFilters } from '../../utils';

const endpoint = Links.SUBGRAPH_ENDPOINT_L1;
const graphQLClient = new GraphQLClient(endpoint);

const GET_NFTS = gql`
	query ($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!) {
		pets(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
			id
			timestamp
			baseId
			atk
			def
			spd
			rarity
			name
		}
	}
`;

const getNFTsFiltered = (variables, filters) => {
	return `
	query {
		pets(${variables}, where: ${filters}) {
			id
			timestamp
			baseId
			atk
			def
			spd
			rarity
      name
		}
	}
`;
};

const getPets = async (page, orderBy, orderDirection, shouldFilter, filters) => {
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
		throw new Error('get pets error');
	}
};

const Pets = ({ order, shouldFilter, filters }) => {
	const [page, setPage] = useState(0);

	useEffect(() => {
		setPage(0);
	}, [order, shouldFilter, filters]);

	const { isLoading, isError, data } = useQuery(
		[`pets_${order.orderBy}_${order.orderDirection}_${shouldFilter}_${JSON.stringify(filters)}`, page],
		() => getPets(page, order.orderBy, order.orderDirection, shouldFilter, filters),
		{
			keepPreviousData: true,
		}
	); // TODO

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
					<div className="flex flex-wrap mx-auto justify-center">{data && data.pets.map((nft) => <PetsPreviewCard key={nft.id} nft={nft} />)}</div>
					{data && data.pets.length > 49 && <PaginationBar handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} page={page} setPage={setPage} />}
				</>
			)}
		</div>
	);
};

export default Pets;
