import { useState, useEffect } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import FilterSearch from '../components/FilterSearch';
import { metaCoinName } from '../constants/MetadataStats';
import FilterBar from '../components/FilterBar';
import Merals from './Merals';

// ethemerals(where: { coin_in: ["Bitcoin"], bgId_in: ["18", "1"]}) {
// ethemerals(first: 10, skip: 0, orderBy: atk, orderDirection: desc) {

const coinData = [];
for (let i = 0; i < metaCoinName.length; i++) {
	coinData.push({
		id: i,
		name: metaCoinName[i],
	});
}

const elementsData = [{ name: 'Void' }, { name: 'Earth' }, { name: 'Fire' }, { name: 'Water' }, { name: 'Wind' }];

const elementsToIds = (elements) => {
	let ids = [];
	elements.forEach((element) => {
		if (element === 'Void') {
			ids = ids.concat(['0', '1', '2', '3', '4']);
		}
		if (element === 'Earth') {
			ids = ids.concat(['5', '6', '7', '8', '9']);
		}
		if (element === 'Fire') {
			ids = ids.concat(['10', '11', '12', '13']);
		}
		if (element === 'Water') {
			ids = ids.concat(['14', '15', '16', '17', '18']);
		}
		if (element === 'Wind') {
			ids = ids.concat(['19', '20', '21', '22', '23', '24']);
		}
	});
	return ids;
};

const dropdownOptions = [
	{ value: 'timestamp_asc', label: 'Oldest Mint' },
	{ value: 'timestamp_desc', label: 'Latest Mint' },
	{ value: 'score', label: 'Highest HP' },
	{ value: 'rewards', label: 'Highest ELF' },
	{ value: 'atk', label: 'Highest Attack' },
	{ value: 'def', label: 'Highest Defence' },
	{ value: 'spd', label: 'Highest Speed' },
];

const Ethemerals = () => {
	const [coinFilterList, setCoinFilterList] = useState([]);
	const [elementFilterList, setElementFilterList] = useState([]);
	const [order, setOrder] = useState({ orderBy: 'timestamp', orderDirection: 'asc' });
	const [shouldFilter, setShouldFilter] = useState(false);
	const [filters, setFilters] = useState({});

	useEffect(() => {
		setShouldFilter(false);
		let _filters = {};
		if (coinFilterList.length > 0) {
			setShouldFilter(true);
			_filters.coin_in = coinFilterList;
		}
		if (elementFilterList.length > 0) {
			setShouldFilter(true);
			_filters.bgId_in = elementsToIds(elementFilterList);
		}

		setFilters(_filters);
	}, [coinFilterList, elementFilterList]);

	// useEffect(() => {
	// 	console.log(shouldFilter, filters);
	// }, [filters, shouldFilter]);

	const onSortByChange = (sortBy) => {
		let _order = order;

		_order.orderBy = sortBy.value;
		_order.orderDirection = 'desc';

		if (sortBy.value === 'timestamp_asc') {
			_order.orderBy = 'timestamp';
			_order.orderDirection = 'asc';
		}
		if (sortBy.value === 'timestamp_desc') {
			_order.orderBy = 'timestamp';
			_order.orderDirection = 'desc';
		}
		setOrder({ orderBy: _order.orderBy, orderDirection: _order.orderDirection });
	};

	return (
		<div>
			<div className="page_bg"></div>
			{/* MAIN */}
			<div className="">
				{/* SIDEBAR */}
				<aside style={{ minWidth: '256px', width: '256px', backgroundColor: 'hsl(212, 39%, 90%)' }} className="h-screen top-16 fixed border-r border-gray-400 overflow-y-auto">
					<div className="flex mb-8">
						<div className="p-4 cursor-pointer text-brandColor border-brandColor border border-b-2 border-l-0 border-r-0 border-t-0">Merals</div>
						{/* <div className="p-4 cursor-pointer text-gray-400">Pets</div> */}
					</div>
					<div className="pl-4 text-sm">FILTER</div>

					<div className="">
						{coinData && <FilterSearch data={coinData} setFilterList={setCoinFilterList} keys={['name']} filterList={coinFilterList} filterByText="by Coin" />}
						{elementsData && <FilterSearch data={elementsData} setFilterList={setElementFilterList} keys={['name']} filterList={elementFilterList} filterByText="by Element" />}
					</div>
				</aside>

				<main style={{ left: '256px', width: 'calc(100% - 256px)' }} className="mt-20 py-2 absolute">
					<div className="flex items-center pl-4 h-8">
						<FilterBar setFilterList={setCoinFilterList} filterList={coinFilterList} />
						<FilterBar setFilterList={setElementFilterList} filterList={elementFilterList} />
						<div className="flex-grow"></div>
						<span className="text-white text-xs font-bold px-2">SORT BY:</span>
						<div className="mr-4 w-48 shadow-md">
							<Dropdown options={dropdownOptions} onChange={onSortByChange} value={dropdownOptions[0]} placeholder="Select an option" />
						</div>
					</div>

					<Merals order={order} shouldFilter={shouldFilter} filters={filters} />
				</main>
			</div>
		</div>
	);
};

export default Ethemerals;
