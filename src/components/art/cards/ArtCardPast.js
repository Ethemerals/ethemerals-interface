import { useHistory } from 'react-router';
import Countdown from 'react-countdown';
import format from 'date-fns/format';

const ArtCardPast = ({ art }) => {
	const history = useHistory();
	const handleOnClick = () => {
		history.push(`/art/${art.id}`);
	};

	let imgUrl = `https://ethemerals-media.s3.amazonaws.com/art/${art.id}.jpg`;
	return (
		<div onClick={handleOnClick} className="w-64 h-96 bg-gray-50 cursor-pointer mt-8 mx-4 rounded-lg hover:shadow-md overflow-hidden">
			<div style={{ backgroundImage: `url(${imgUrl})` }} className="w-full h-64 bg-gray-400 bg-cover bg-center"></div>
			<div className="relative h-32">
				<h4 className="text-xl p-2 overflow-hidden font-bold">{art.title}</h4>
				<p className="px-2 text-gray-400 text-xs">Created by</p>
				<p className="px-2">
					<a href={art.artistLink} target="_blank" rel="noreferrer" className="hover:text-blue-300 transition duration-300">
						{`@ ${art.artist}`}
					</a>
				</p>
				{art.claimed ? (
					<div className="bg-blue-100 absolute bottom-0 w-full text-center text-xs py-1">CLAIMED</div>
				) : (
					<div className="bg-green-50 absolute bottom-0 w-full text-center text-xs py-1">UNCLAIMED</div>
				)}
			</div>
		</div>
	);
};

export default ArtCardPast;
