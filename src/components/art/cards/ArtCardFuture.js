import { useHistory } from 'react-router';
import Countdown from 'react-countdown';
import format from 'date-fns/format';

const ArtCardFuture = ({ art }) => {
	const history = useHistory();
	const handleOnClick = () => {
		history.push(`/artgame/${art.id}`);
	};

	return (
		<div onClick={handleOnClick} className="w-64 h-96 bg-gray-50 cursor-pointer mt-8 mx-4 rounded-lg hover:shadow-md text-center overflow-hidden">
			<div
				style={{
					backgroundColor: '#FFDEE9',
					backgroundImage: 'linear-gradient(19deg, rgb(250, 172, 168) 0%, rgb(221, 214, 243) 100%)',
				}}
				className="w-full h-64 bg-gray-400 "
			>
				<p className="pt-24 text-red-500">NOT YET RELEASED</p>
			</div>
			<div className="mt-6">
				<h4 className="text-sm text-gray-500">Scheduled Release Date:</h4>
				<p>{format(art.releaseDate, 'do MMM h:maaa')}</p>

				<p className="text-center">
					<Countdown date={art.releaseDate}></Countdown>
				</p>
			</div>
		</div>
	);
};

export default ArtCardFuture;
