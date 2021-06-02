const MoreLinksButton = ({ large, toggle }) => {
	return (
		<button className={`py-2 px-2 bg-gray-600 hover:bg-yellow-400 text-white rounded-xl transition duration-300 ${large ? 'ml-2' : 'mr-2 right-0 absolute'} `} onClick={toggle}>
			<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
				<path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
			</svg>
		</button>
	);
};

export default MoreLinksButton;
