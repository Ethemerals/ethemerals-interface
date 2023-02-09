import { useState, useEffect } from 'react';

import { useQuery } from 'react-query';
import PetDragableCard from './cards/PetDragableCard';
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
		pets(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
			id
			tokenId
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
      tokenId
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
		throw new Error('get account error');
	}
};

const PetsList = ({ order, shouldFilter, filters, allDropped }) => {
	const [nfts, setNfts] = useState(undefined);
	const [page, setPage] = useState(0);
	const { userPets } = useUserAccount();
	const [userNFTIds, setUserNFTIds] = useState([]);

	useEffect(() => {
		if (userPets && userPets.length > 0) {
			let _userNFTIds = [];
			userPets.forEach((nft) => {
				_userNFTIds.push(nft.id);
			});
			setUserNFTIds(_userNFTIds);
		}
	}, [userPets]);

	const { isLoading, isError, data } = useQuery(
		[`pets_${order.orderBy}_${order.orderDirection}_${shouldFilter}_${JSON.stringify(filters)}`, page],
		() => getPets(page, order.orderBy, order.orderDirection, shouldFilter, filters),
		{
			keepPreviousData: true,
		}
	); // TODO

	useEffect(() => {
		if (data && !isLoading) {
			setNfts(data.pets);
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
								return <PetDragableCard key={nft.id} nft={nft} owned={userNFTIds.indexOf(nft.tokenId) >= 0} dropped={dropped} />;
							})}
					</div>

					{nfts && nfts.length > 49 && <PaginationBar handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} page={page} setPage={setPage} />}
				</>
			)}
		</div>
	);
};

export default PetsList;
