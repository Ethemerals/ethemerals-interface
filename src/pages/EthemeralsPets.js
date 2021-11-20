import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import FilterSearch from '../components/FilterSearch';
import { metaPetName } from '../constants/MetadataStats';
import FilterBar from '../components/FilterBar';
import Pets from './sections/Pets';

// ethemerals(where: { coin_in: ["Bitcoin"], bgId_in: ["18", "1"]}) {
// ethemerals(first: 10, skip: 0, orderBy: atk, orderDirection: desc) {

const petData = [];
for (let i = 0; i < metaPetName.length; i++) {
	petData.push({
		name: metaPetName[i],
	});
}

const dropdownOptions = [
	{ value: 'timestamp_asc', label: 'Oldest Mint' },
	{ value: 'timestamp_desc', label: 'Latest Mint' },
	{ value: 'rarity', label: 'Highest Rarity' },
	{ value: 'atk', label: 'Highest Attack' },
	{ value: 'def', label: 'Highest Defence' },
	{ value: 'spd', label: 'Highest Speed' },
];

const EthemeralsPets = () => {
	const [nameFilterList, setNameFilterList] = useState([]);
	const [order, setOrder] = useState({ orderBy: 'timestamp', orderDirection: 'asc' });
	const [shouldFilter, setShouldFilter] = useState(false);
	const [filters, setFilters] = useState({});

	useEffect(() => {
		setShouldFilter(false);
		let _filters = {};
		if (nameFilterList.length > 0) {
			setShouldFilter(true);
			_filters.name_in = nameFilterList;
		}
		// console.log(nameFilterList);

		setFilters(_filters);
	}, [nameFilterList]);

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
					<div className="flex mb-8 mt-1">
						<Link to="/ethemerals/merals">
							<div className="py-1 px-4 m-4 mr-0 text-lg text-gray-600 cursor-pointer bg-white shadow-md hover:text-yellow-500 hover:shadow-lg">Merals</div>
						</Link>
						<Link to="/ethemerals/pets">
							<div className="py-1 px-4 m-4 ml-2 text-lg text-brandColor cursor-pointer bg-white shadow-md">Pets</div>
						</Link>
					</div>
					<div className="pl-4 mb-2 text-sm">FILTER</div>

					<div className="">{petData && <FilterSearch data={petData} setFilterList={setNameFilterList} keys={['name']} filterList={nameFilterList} filterByText="Pet Type" />}</div>
				</aside>

				<main style={{ left: '256px', width: 'calc(100% - 256px)' }} className="mt-20 py-2 absolute">
					<div className="flex items-center pl-4 h-8">
						<FilterBar setFilterList={setNameFilterList} filterList={nameFilterList} />
						<div className="flex-grow"></div>
						<span className="text-white text-xs font-bold px-2">SORT BY:</span>
						<div className="mr-4 w-48 shadow-md">
							<Dropdown options={dropdownOptions} onChange={onSortByChange} value={dropdownOptions[0]} placeholder="Select an option" />
						</div>
					</div>

					<Pets order={order} shouldFilter={shouldFilter} filters={filters} />
				</main>
			</div>
		</div>
	);
};

export default EthemeralsPets;
