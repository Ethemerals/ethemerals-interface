import { useState, useEffect } from 'react';
import NFTPreviewCard from './cards/NFTPreviewCard';
import { useQuery } from 'react-query';
import PaginationBar from '../search/PaginationBar';
import { gql, GraphQLClient } from 'graphql-request';
import { Links } from '../../constants/Links';
import { formatFilters } from '../../utils';

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

const GET_MERALS_BY_ID = gql`
	query ($first: Int!, $ids: [String]) {
		merals(first: $first, where: { burnt: false, status: "2", id_in: $ids }) {
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

const getSyncedMerals = (meralsL1, meralsL2) => {
	let syncedMerals = [];
	for (let i = 0; i < meralsL1.length; i++) {
		let meralL1 = meralsL1[i];
		for (let j = 0; j < meralsL2.length; j++) {
			let meralL2 = meralsL2[j];
			if (meralL1.meralId === meralL2.meralId) {
				meralL1.hp = meralL2.hp;
				meralL1.xp = meralL2.xp;
				meralL1.elf = meralL2.elf;
				meralL1.atk = meralL2.atk;
				meralL1.def = meralL2.def;
				meralL1.spd = meralL2.spd;
				meralL1.element = meralL2.element;
			}
		}
		syncedMerals.push(meralL1);
	}
	return syncedMerals;
};

const getMerals = async (page, orderBy, orderDirection, filters) => {
	const endpoint = Links.SUBGRAPH_ENDPOINT_L1;
	const graphQLClient = new GraphQLClient(endpoint);

	const endpoint2 = Links.SUBGRAPH_ENDPOINT_L2;
	const graphQLClient2 = new GraphQLClient(endpoint2);
	let amount = 50;

	let meralIds = [];
	try {
		let fetchData;
		const filtersString = formatFilters(filters);
		const dataL1 = await graphQLClient.request(getNFTsFiltered(`first: ${amount}, skip: ${page * amount}, orderBy: ${orderBy}, orderDirection: ${orderDirection}`, filtersString));

		if (orderBy !== 'timestamp') {
			const dataL2 = await graphQLClient2.request(getNFTsFiltered(`first: ${amount}, skip: ${page * amount}, orderBy: ${orderBy}, orderDirection: ${orderDirection}`, filtersString));

			let syncedMerals = getSyncedMerals(dataL1.merals, dataL2.merals);

			let missingMeralsL2 = [];

			dataL2.merals.forEach((meral) => {
				let match = false;
				syncedMerals.forEach((syncedMeral) => {
					if (meral.meralId === syncedMeral.meralId) {
						match = true;
					}
				});
				if (!match) {
					missingMeralsL2.push(meral);
				}
			});

			syncedMerals = [...syncedMerals, ...missingMeralsL2];

			// SORT

			syncedMerals.sort((a, b) => {
				return parseInt(b[orderBy]) - parseInt(a[orderBy]);
			});

			// IF SKIP - prune TODO

			if (syncedMerals.length > amount) {
				fetchData = syncedMerals.slice(0, 50);
			} else {
				fetchData = syncedMerals;
			}
		} else {
			if (dataL1 && dataL1.merals) {
				dataL1.merals.forEach((meral) => {
					meralIds.push(meral.meralId);
				});
			}

			const dataL2 = await graphQLClient2.request(GET_MERALS_BY_ID, { ids: meralIds, first: amount });
			fetchData = getSyncedMerals(dataL1.merals, dataL2.merals);
		}

		return fetchData;
	} catch (error) {
		console.log(error);
		throw new Error('get merals error');
	}
};

const Merals = ({ order, filters }) => {
	const [nfts, setNfts] = useState(undefined);
	const [page, setPage] = useState(0);

	useEffect(() => {
		setPage(0);
	}, [order, filters]);

	const { isLoading, data } = useQuery([`nfts_${order.orderBy}_${order.orderDirection}_${JSON.stringify(filters)}`, page], () => getMerals(page, order.orderBy, order.orderDirection, filters), {
		keepPreviousData: true,
	});

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
