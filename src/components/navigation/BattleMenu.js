import { useHistory } from 'react-router-dom';

const BattleMenu = ({ current }) => {
	const history = useHistory();
	return (
		<div className="flex flex-wrap items-center mx-auto mt-10 justify-center">
			<button
				onClick={() => history.push(`/battle/eternal`)}
				className={`${current === 'eternal' ? 'bg-indigo-700 text-gray-100' : 'bg-gray-600 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none font-bold`}
			>
				Eternal Battle
			</button>
			<button
				onClick={() => history.push(`/battle/wilds`)}
				className={`${current === 'wilds' ? 'bg-indigo-700 text-gray-100' : 'bg-gray-600 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none font-bold`}
			>
				Into The Wilds
			</button>
			<button
				onClick={() => history.push(`/battle/royale`)}
				className={`${current === 'royale' ? 'bg-indigo-700 text-gray-100' : 'bg-gray-600 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none font-bold`}
			>
				Battle Royale
			</button>
		</div>
	);
};

export default BattleMenu;
