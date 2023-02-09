const CloseSVG = () => (
	<svg width="10" height="10" viewBox="0 0 50 49" fill="none" xmlns="http://www.w3.org/2000/svg">
		<line x1="5.65685" y1="4" x2="45" y2="43.3431" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
		<line x1="5" y1="43.3431" x2="44.3431" y2="4" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
	</svg>
);

const FilterBar = ({ filterList, setFilterList }) => {
	const onRemove = (item) => {
		const _filterList = filterList;
		const newFilterList = _filterList.filter((_item) => _item !== item);
		setFilterList(newFilterList);
	};

	return (
		<div className="flex items-center text-black">
			{filterList.map((filterItem) => (
				<button key={filterItem} onClick={() => onRemove(filterItem)} className="p-1 mx-1 bg-white border border-gray-400 cursor-pointer flex hover:shadow-lg">
					<span className="pl-1">{filterItem}</span>
					<span className="pl-2 text-gray-300 hover:gray-blue-400">
						<CloseSVG />
					</span>
				</button>
			))}
		</div>
	);
};

export default FilterBar;
