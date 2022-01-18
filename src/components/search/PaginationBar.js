import { useState, useEffect } from 'react';

const ListButton = ({ listNumbers, index, activeIndex, handleClick }) => {
	return (
		<li
			onClick={() => handleClick(index)}
			className={`cursor-pointer first:ml-0 text-sm font-bold flex w-6 h-6 rounded items-center justify-center relative text-white border-white border ${
				activeIndex === index ? 'bg-blue-400 border-blue-400' : 'hover:bg-brandColor-pale bg-blue-100 transition duration-200 focus:outline-none'
			}`}
		>
			{listNumbers[index]}
		</li>
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

const PaginationBar = ({ handlePreviousPage, handleNextPage, page, setPage }) => {
	return (
		<div className="flex items-center mx-auto text-sm sm:text-base justify-center my-4">
			<button
				type="button"
				onClick={handlePreviousPage}
				disabled={page === 0}
				className="cursor-pointer text-blue-300 flex items-center hover:text-brandColor-pale transition duration-200 focus:outline-none mr-2"
			>
				<div className="w-5 h-5">
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
				className="cursor-pointer text-blue-300 flex items-center hover:text-brandColor-pale transition duration-200 focus:outline-none ml-2"
			>
				<div className="w-5 h-5" style={{ transform: 'rotate(180deg)' }}>
					<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10s10-4.477,10-10C22,6.477,17.523,2,12,2z M15,17h-3l-4-5l4-5h3l-4,5 L15,17z"></path>
					</svg>
				</div>
			</button>
		</div>
	);
};

export default PaginationBar;
