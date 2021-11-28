import { useHistory } from 'react-router';

const ArtCard = ({ tokenId }) => {
	const history = useHistory();
	const handleOnClick = () => {
		history.push(`/art/${tokenId}`);
	};
	return (
		<div onClick={handleOnClick} className="w-28 h-64 bg-gray-700 cursor-pointer">
			img{tokenId}
		</div>
	);
};

export default ArtCard;
