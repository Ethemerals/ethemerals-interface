import { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import NFTPreviewCard from '../components/NFTPreviewCard';
import { useHistory } from 'react-router-dom';
import Links from '../constants/Links';
import { GraphQLClient } from 'graphql-request';
import { useQuery } from 'react-query';
import { useAllColors } from '../hooks/useColorTraits';

const GET_NFTS = gql`
	query ($first: Int!, $skip: Int!) {
		ethemerals(first: $first, skip: $skip, orderBy: "timestamp", orderDirection: "asc") {
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

const endpoint = Links.SUBGRAPH_ENDPOINT;
const graphQLClient = new GraphQLClient(endpoint);

const getMerals = async (page) => {
	let amount = 50;
	try {
		const fetchData = await graphQLClient.request(GET_NFTS, { first: amount, skip: page * amount });
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

const Ethemerals = () => {
	const history = useHistory();
	const { allColors } = useAllColors();
	const [aeIsLoading, setAeIsLoading] = useState(true);

	const [page, setPage] = useState(0);

	const { isLoading, isError, error, data, isFetching, isPreviousData } = useQuery([`nfts`, page], () => getMerals(page), { keepPreviousData: true }); // TODO

	useEffect(() => {
		if (allColors && allColors.length > 0) {
			setAeIsLoading(false);
		}
	}, [allColors]);

	const handleNextPage = () => {
		setPage((old) => old + 1);
	};

	const handlePreviousPage = () => {
		setPage((old) => Math.max(old - 1, 0));
	};

	return (
		<div className="scrollbar_pad">
			<div className="page_bg"></div>
			<div className="text-sm font-bold text-white sm:hidden mt-4 text-center">SORT BY</div>
			<div className="flex items-center mx-auto mt-2 sm:mt-10 text-sm sm:text-base justify-center">
				<button onClick={() => history.push(`/ethemerals`)} className={`bg-indigo-500 py-1 px-2 mx-1 rounded focus:outline-none`}>
					Minted
				</button>
				<button onClick={() => history.push(`/ethemerals/mc`)} className={`bg-indigo-300 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none`}>
					Marketcap Rank
				</button>
			</div>

			<div className="flex items-center mx-auto text-sm sm:text-base justify-center my-4">
				<button
					type="button"
					onClick={handlePreviousPage}
					disabled={page === 0}
					className="cursor-pointer text-gray-50 flex items-center hover:text-brandColor-pale transition duration-200 focus:outline-none mr-4"
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
					className="cursor-pointer text-gray-50 flex items-center hover:text-brandColor-pale transition duration-200 focus:outline-none ml-4"
				>
					<div className="w-6 h-6" style={{ transform: 'rotate(180deg)' }}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10s10-4.477,10-10C22,6.477,17.523,2,12,2z M15,17h-3l-4-5l4-5h3l-4,5 L15,17z"></path>
						</svg>
					</div>
				</button>
			</div>
			{/* {isFetching ? <span> Loading...</span> : null} */}
			{isLoading && aeIsLoading ? (
				<div className="flex flex-wrap mx-auto justify-center">Loading ...</div>
			) : isError ? (
				<div></div>
			) : (
				<div className="flex flex-wrap mx-auto justify-center">{data && allColors && data.ethemerals.map((nft, index) => <NFTPreviewCard key={index} nft={nft} color={allColors[index]} />)}</div>
			)}

			<div className="h-40"></div>
		</div>
	);
};

export default Ethemerals;
