import { useState } from 'react';
import { useHistory } from 'react-router';

import Links from '../../constants/Links';

const ArtFeature = ({ tokenId }) => {
	// GET ARTDATA
	const [isClaimed, setIsClaimed] = useState(false);
	const history = useHistory();

	const handleOnClick = () => {
		history.push(`/art/${tokenId}`);
	};
	const handleOnClickGame = () => {
		history.push(`/artgame/${tokenId}`);
	};

	return (
		<div className="w-full">
			<div className="py-20 block sm:grid sm:grid-cols-2 sm:py-24 relative sm:w-11/12 sm:mx-auto">
				<div className="w-4/5 mx-auto">
					<img onClick={handleOnClick} src={`https://ethemerals-media.s3.amazonaws.com/art/${tokenId}.jpg`} alt="Feature art" />
				</div>

				<div className="mx-auto mt-4 sm:mt-0 sm:mx-0 w-4/5 h-3/4 relative lg:top-1/4">
					<p className="text-gray-400 text-sm">Kingdom of the Ethemerals - World Building Collection</p>
					<p className="text-gray-400 text-sm">Item #{tokenId} Single Edition</p>
					<h1 className="text-3xl md:text-5xl pt-4">Title revealed once claimed...</h1>

					<p className="pt-8 text-gray-400 text-sm">Created by</p>
					<p className="pt-1 text-lg">
						<a href={Links.TWITTER} target="_blank" rel="noreferrer" className="hover:text-blue-300 transition duration-300">
							@ Artist Name
						</a>
					</p>
					<div className="flex mt-8 md:mt-16 space-x-4">
						<button
							onClick={handleOnClick}
							className="bg-gray-50 w-44 text-gray-600 text-bold px-4 py-2 rounded-lg shadow-lg hover:bg-blue-100 transition duration-300 flex justify-center items-center"
						>
							View artwork
						</button>
						<button
							onClick={handleOnClickGame}
							className="bg-gray-50 w-44 text-gray-600 text-bold px-4 py-2 rounded-lg shadow-lg hover:bg-blue-100 transition duration-300 flex justify-center items-center"
						>
							Claim artwork
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ArtFeature;
