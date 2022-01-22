import { useHistory } from 'react-router-dom';

const WorldMapButton = () => {
	const history = useHistory();
	return (
		<div onClick={() => history.push(`/wilds/world`)} className="bg-white rounded w-96 bg-opacity-80 p-4 cursor-pointer hover:bg-blue-100 shadow my-4">
			<h1>To World Map</h1>
		</div>
	);
};

export default WorldMapButton;
