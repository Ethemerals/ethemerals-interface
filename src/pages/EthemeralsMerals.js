import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import FilterSearch from '../components/FilterSearch';
import { metaCoinName, metaMainclass, metaSubclass, metaCostumes, metaEyeColors, metaHairColors, metaSkinColors } from '../constants/MetadataStats';
import FilterBar from '../components/FilterBar';
import Merals from '../components/ethemerals/Merals';

// ethemerals(where: { coin_in: ["Bitcoin"], bgId_in: ["18", "1"]}) {
// ethemerals(first: 10, skip: 0, orderBy: atk, orderDirection: desc) {

const coinData = [];
for (let i = 0; i < metaCoinName.length; i++) {
	coinData.push({
		name: metaCoinName[i],
	});
}

const mainclassData = [];
for (let i = 0; i < metaMainclass.length; i++) {
	mainclassData.push({
		name: metaMainclass[i],
	});
}

const subclassData = [];
for (let i = 0; i < metaSubclass.length; i++) {
	subclassData.push({
		name: metaSubclass[i],
	});
}

const costumeData = [];
for (let i = 0; i < metaCostumes.length; i++) {
	costumeData.push({
		name: metaCostumes[i],
	});
}

const eyeColorData = [];
for (let i = 0; i < metaEyeColors.length; i++) {
	eyeColorData.push({
		name: metaEyeColors[i],
	});
}

const hairColorData = [];
for (let i = 0; i < metaHairColors.length; i++) {
	hairColorData.push({
		name: metaHairColors[i],
	});
}

const skinColorData = [];
for (let i = 0; i < metaSkinColors.length; i++) {
	skinColorData.push({
		name: metaSkinColors[i],
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

const EthemeralsMerals = () => {
	const [coinFilterList, setCoinFilterList] = useState([]);
	const [elementFilterList, setElementFilterList] = useState([]);
	const [subclassFilterList, setSubclassFilterList] = useState([]);
	const [costumeFilterList, setCostumeFilterList] = useState([]);
	const [eyeFilterList, setEyeFilterList] = useState([]);
	const [hairFilterList, setHairFilterList] = useState([]);
	const [skinFilterList, setSkinFilterList] = useState([]);

	const [order, setOrder] = useState({ orderBy: 'timestamp', orderDirection: 'asc' });
	const [shouldFilter, setShouldFilter] = useState(false);
	const [filters, setFilters] = useState({});

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

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
		if (subclassFilterList.length > 0) {
			setShouldFilter(true);
			_filters.subClass_in = subclassFilterList;
		}
		if (costumeFilterList.length > 0) {
			setShouldFilter(true);
			_filters.costume_in = costumeFilterList;
		}
		if (eyeFilterList.length > 0) {
			setShouldFilter(true);
			_filters.eyes_in = eyeFilterList;
		}
		if (hairFilterList.length > 0) {
			setShouldFilter(true);
			_filters.hair_in = hairFilterList;
		}
		if (skinFilterList.length > 0) {
			setShouldFilter(true);
			_filters.skin_in = skinFilterList;
		}

		setFilters(_filters);
	}, [coinFilterList, elementFilterList, subclassFilterList, costumeFilterList, eyeFilterList, hairFilterList, skinFilterList]);

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
				<aside style={{ minWidth: '212px', width: '212px', backgroundColor: 'hsl(212, 39%, 90%)' }} className="h-screen top-12 fixed border-r border-gray-400 overflow-y-auto">
					<div className="flex mb-8 mt-1">
						<Link to="/ethemerals/merals">
							<div className="py-1 px-4 m-4 mr-0 text-lg text-brandColor cursor-pointer bg-white shadow-md">Merals</div>{' '}
						</Link>
						<Link to="/ethemerals/pets">
							<div className="py-1 px-4 m-4 ml-2 text-lg text-gray-600 cursor-pointer bg-white shadow-md hover:text-yellow-500 hover:shadow-lg">Pets</div>
						</Link>
					</div>
					<div className="pl-4 mb-2 text-sm">FILTER</div>

					<div className="">
						{coinData && <FilterSearch data={coinData} setFilterList={setCoinFilterList} keys={['name']} filterList={coinFilterList} filterByText="Coin" />}
						{elementsData && <FilterSearch data={elementsData} setFilterList={setElementFilterList} keys={['name']} filterList={elementFilterList} filterByText="Element" />}
						{subclassData && <FilterSearch data={subclassData} setFilterList={setSubclassFilterList} keys={['name']} filterList={subclassFilterList} filterByText="Subclass" />}
						{costumeData && <FilterSearch data={costumeData} setFilterList={setCostumeFilterList} keys={['name']} filterList={costumeFilterList} filterByText="Outfit" />}
						{eyeColorData && <FilterSearch data={eyeColorData} setFilterList={setEyeFilterList} keys={['name']} filterList={eyeFilterList} filterByText="Eye Color" />}
						{hairColorData && <FilterSearch data={hairColorData} setFilterList={setHairFilterList} keys={['name']} filterList={hairFilterList} filterByText="Hair Color" />}
						{skinColorData && <FilterSearch data={skinColorData} setFilterList={setSkinFilterList} keys={['name']} filterList={skinFilterList} filterByText="Skin Color" />}
					</div>
				</aside>

				<main style={{ left: '212px', width: 'calc(100% - 212px)' }} className="mt-16 py-2 absolute">
					<div className="flex items-center pl-4 h-8">
						<FilterBar setFilterList={setCoinFilterList} filterList={coinFilterList} />
						<FilterBar setFilterList={setElementFilterList} filterList={elementFilterList} />
						<FilterBar setFilterList={setSubclassFilterList} filterList={subclassFilterList} />
						<FilterBar setFilterList={setCostumeFilterList} filterList={costumeFilterList} />
						<FilterBar setFilterList={setEyeFilterList} filterList={eyeFilterList} />
						<FilterBar setFilterList={setHairFilterList} filterList={hairFilterList} />
						<FilterBar setFilterList={setSkinFilterList} filterList={skinFilterList} />
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

export default EthemeralsMerals;
