import { useHistory } from 'react-router';

const ArtFeature = ({ tokenId }) => {
	const history = useHistory();
	const handleOnClick = () => {
		history.push(`/artgame/${tokenId}`);
	};

	return (
		<div>
			<div className="page_bg"></div>
			<div className="w-full h-420 bg-gray-50 m-4">
				feature art
				<div className="flex justify-center">
					<div>
						<div className="bg-gray-700 w-64 h-64 ">img here {tokenId}</div>

						<button onClick={handleOnClick} className="bg-yellow-400 text-xl text-bold px-4 py-2 my-10 rounded-lg shadow-lg hover:bg-yellow-300 transition duration-300">
							Claim
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ArtFeature;
