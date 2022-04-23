import { useHistory } from 'react-router-dom';

import Images from '../../../constants/Images';

const NFTPolyActions = ({ nft }) => {
	const history = useHistory();

	const handleOnClick = () => {
		history.push(`/register`);
	};

	if (!nft) {
		return null;
	}

	return (
		<div className="grid grid-cols-1 gap-2 px-2 text-sm text-white">
			<button onClick={handleOnClick} className={`flex items-center rounded-lg bg-blue-400 cursor-pointer hover:bg-blue-300 transition duration-200`}>
				<div className="w-8 h-8 mr-1 relative">
					<img className="center" width="22px" height="22px" alt="icon wing" src={Images.iconAvatar} />
				</div>
				<p>Virtual Gateway</p>
			</button>
		</div>
	);
};

export default NFTPolyActions;
