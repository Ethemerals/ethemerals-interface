import { useState, useEffect } from 'react';
import useFuse from 'react-use-fuse';

const SearchItem = ({ item, filterList, filterByItem }) => {
	const [clicked, setClicked] = useState(undefined);

	useEffect(() => {
		if (filterList.indexOf(item.name) >= 0) {
			setClicked(true);
		} else {
			setClicked(false);
		}
	}, [filterList, item]);

	const onClicked = () => {
		filterByItem(item.name, !clicked);
		setClicked(!clicked);
	};

	return (
		<div onClick={onClicked} key={item.id} className="cursor-pointer flex items-center p-2">
			<div className={`w-3 h-3 ${clicked ? 'bg-yellow-400' : 'bg-white'} rounded-sm shadow-md mr-4`}></div>
			<div>{item.name}</div>
		</div>
	);
};

const SearchList = ({ items, filterList, filterByItem }) => {
	return (
		<div className="ml-1 h-48 overflow-y-auto">
			{items.map((item) => {
				let _item = item;
				if (item && item.item) {
					_item = item.item;
				}
				return <SearchItem key={_item.name} item={_item} filterList={filterList} filterByItem={filterByItem} />;
			})}
		</div>
	);
};

const FilterSearch = ({ data, setFilterList, filterList, keys, filterByText = '' }) => {
	const filterByItem = (item, add) => {
		const _filterList = filterList;
		if (add) {
			if (_filterList.indexOf(item) === -1) {
				_filterList.push(item);
				setFilterList([..._filterList]);
			}
		} else {
			const newFilterList = _filterList.filter((_item) => _item !== item);
			setFilterList(newFilterList);
		}
	};

	const options = {
		keys: keys,
		findAllMatches: true,
		useExtendedSearch: true,
	};

	const { result, search, term } = useFuse({
		data,
		options,
	});

	return (
		<div className="text-black mx-2 mt-4 border-white border">
			<div className="flex p-2 bg-white shadow">
				<span className="text-gray-400">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</span>
				<input className="pl-2 w-44 outline-none" onChange={(e) => search(e.target.value)} value={term} placeholder={`Filter ${filterByText}`} />
			</div>
			<SearchList items={result} filterList={filterList} filterByItem={filterByItem} />
		</div>
	);
};

export default FilterSearch;
