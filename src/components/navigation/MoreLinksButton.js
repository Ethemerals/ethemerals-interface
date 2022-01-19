const MoreLinksButton = ({ large, toggle }) => {
	return (
		<button
			className={`w-10 h-10 focus:outline-none flex items-center justify-center bg-brandColor-purple hover:bg-yellow-400 text-white rounded transition duration-300 ${
				large ? 'ml-2' : 'mr-1 right-0 absolute'
			} `}
			onClick={toggle}
		>
			<svg width="24px" height="24px" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
				<path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
			</svg>
		</button>
	);
};

export default MoreLinksButton;
