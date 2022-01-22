import { useHistory } from 'react-router-dom';

const HubButton = () => {
	const history = useHistory();
	return (
		<div onClick={() => history.push(`/wilds/hub`)} className="bg-white rounded w-96 bg-opacity-80 p-4 cursor-pointer hover:bg-blue-100 shadow my-4">
			<h1>To Hub</h1>
		</div>
	);
};

export default HubButton;
