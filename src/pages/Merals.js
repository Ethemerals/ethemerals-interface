import { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import NFTPreviewCard from '../components/NFTPreviewCard';
import Links from '../constants/Links';
import { GraphQLClient } from 'graphql-request';
import { useQuery } from 'react-query';

const endpoint = Links.SUBGRAPH_ENDPOINT;
const graphQLClient = new GraphQLClient(endpoint);

const GET_NFTS = gql`
	query ($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!) {
		ethemerals(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
			id
			timestamp
			score
			rewards
			atk
			def
			spd
			baseId
			bgId
			metadata {
				id
				coin
				subClass
			}
		}
	}
`;

const getNFTsFiltered = (variables, filters) => {
	return `
	query {
		ethemerals(${variables}, where: ${filters}) {
			id
			timestamp
			score
			rewards
			atk
			def
			spd
			baseId
			bgId
			metadata {
				id
				coin
				subClass
			}
		}
	}
`;
};

const formatFilters = (filters) => {
	let _filters = [];

	for (const key in filters) {
		_filters.push(`${key}: ${JSON.stringify(filters[key])}`);
	}

	return `{${_filters}}`;
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
		throw new Error('get account error');
	}
};

const ListButton = ({ listNumbers, index, activeIndex, handleClick }) => (
	<li
		onClick={() => handleClick(index)}
		className={`cursor-pointer first:ml-0 text-sm font-bold flex w-6 h-6 rounded items-center justify-center relative text-white border-white border ${
			activeIndex === index ? 'bg-indigo-400 border-indigo-400' : 'hover:bg-brandColor-pale transition duration-200 focus:outline-none'
		}`}
	>
		{listNumbers[index]}
	</li>
);

const PaginationBar = ({ handlePreviousPage, handleNextPage, page, setPage }) => {
	return (
		<div className="flex items-center mx-auto text-sm sm:text-base justify-center my-4">
			<button
				type="button"
				onClick={handlePreviousPage}
				disabled={page === 0}
				className="cursor-pointer text-indigo-300 flex items-center hover:text-brandColor-pale transition duration-200 focus:outline-none mr-4"
			>
				<div className="w-6 h-6">
					<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10s10-4.477,10-10C22,6.477,17.523,2,12,2z M15,17h-3l-4-5l4-5h3l-4,5 L15,17z"></path>
					</svg>
				</div>
			</button>

			<PageNumbers page={page} setPage={setPage} />
			<button
				type="button"
				onClick={handleNextPage}
				disabled={page === 19}
				className="cursor-pointer text-indigo-300 flex items-center hover:text-brandColor-pale transition duration-200 focus:outline-none ml-4"
			>
				<div className="w-6 h-6" style={{ transform: 'rotate(180deg)' }}>
					<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10s10-4.477,10-10C22,6.477,17.523,2,12,2z M15,17h-3l-4-5l4-5h3l-4,5 L15,17z"></path>
					</svg>
				</div>
			</button>
		</div>
	);
};
const PageNumbers = ({ page, setPage }) => {
	const [listNumbers, setListNumbers] = useState([1, 2, 3, 4, 5]);
	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		// HARDCODED
		let pageOffset = page + 1;
		setActiveIndex(2);
		if (pageOffset <= 3) {
			setListNumbers([1, 2, 3, 4, 5]);
			setActiveIndex(page);
		}

		if (pageOffset > 3) {
			setListNumbers([pageOffset - 2, pageOffset - 1, pageOffset, pageOffset + 1, pageOffset + 2]);
		}

		if (pageOffset >= 18) {
			setListNumbers([16, 17, 18, 19, 20]);
		}
		if (pageOffset === 19) {
			setActiveIndex(3);
		}
		if (pageOffset === 20) {
			setActiveIndex(4);
		}
	}, [page]);

	const handleClick = (index) => {
		setPage(listNumbers[index] - 1);
	};
	// listNumbers, index, activeIndex, handleClick
	return (
		<ul className="flex list-none flex-wrap space-x-1">
			<ListButton listNumbers={listNumbers} index={0} activeIndex={activeIndex} handleClick={handleClick} />
			<ListButton listNumbers={listNumbers} index={1} activeIndex={activeIndex} handleClick={handleClick} />
			<ListButton listNumbers={listNumbers} index={2} activeIndex={activeIndex} handleClick={handleClick} />
			<ListButton listNumbers={listNumbers} index={3} activeIndex={activeIndex} handleClick={handleClick} />
			<ListButton listNumbers={listNumbers} index={4} activeIndex={activeIndex} handleClick={handleClick} />
		</ul>
	);
};

const Merals = ({ order, shouldFilter, filters }) => {
	const [page, setPage] = useState(0);

	useEffect(() => {
		setPage(0);
	}, [order, shouldFilter, filters]);

	const { isLoading, isError, data } = useQuery(
		[`nfts_${order.orderBy}_${order.orderDirection}_${shouldFilter}_${JSON.stringify(filters)}`, page],
		() => getMerals(page, order.orderBy, order.orderDirection, shouldFilter, filters),
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
					{data && data.ethemerals.length > 0 && <PaginationBar handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} page={page} setPage={setPage} />}
					<div className="flex flex-wrap mx-auto justify-center">{data && data.ethemerals.map((nft) => <NFTPreviewCard key={nft.id} nft={nft} rewards={order.orderBy === 'rewards'} />)}</div>
					{data && data.ethemerals.length > 0 && <PaginationBar handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} page={page} setPage={setPage} />}
				</>
			)}
		</div>
	);
};

export default Merals;
