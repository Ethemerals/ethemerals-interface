import { useState, useEffect } from 'react';

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
		<div className="ml-1 h-14 overflow-y-auto">
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

const FilterStatus = ({ data, setFilterList, filterList, filterByText = '' }) => {
	const [expand, setExpand] = useState(true);

	const toggleExpand = () => {
		setExpand(!expand);
	};

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

	return (
		<div className="text-black">
			<div onClick={toggleExpand} className="p-2 pl-4 font-bold border border-r-0 border-l-0 border-b-0 border-gray-300 flex items-center cursor-pointer">
				<span>{filterByText}</span>
				<span className="flex-grow"></span>
				<span>
					{!expand ? (
						<svg className="w-4 h-4" fill="none" stroke="gray" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
					) : (
						<svg className="w-4 h-4" fill="none" stroke="gray" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
						</svg>
					)}
				</span>
			</div>
			{expand && (
				<div className="mx-2">
					<SearchList items={data} filterList={filterList} filterByItem={filterByItem} />
				</div>
			)}
		</div>
	);
};

export default FilterStatus;
