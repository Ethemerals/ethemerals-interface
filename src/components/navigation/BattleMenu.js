import { useHistory } from 'react-router-dom';

const BattleMenu = ({ current }) => {
	const history = useHistory();
	return (
		<div className="flex items-center mx-auto mt-10 text-sm sm:text-xl justify-center">
			<button
				onClick={() => history.push(`/battle/eternal`)}
				className={`${current === 'eternal' ? 'bg-indigo-500' : 'bg-indigo-300 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none`}
			>
				Eternal Battle
			</button>
			<button
				onClick={() => history.push(`/battle/wilds`)}
				className={`${current === 'wilds' ? 'bg-indigo-500' : 'bg-indigo-300 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none`}
			>
				Into The Wilds
			</button>
			<button
				onClick={() => history.push(`/battle/royale`)}
				className={`${current === 'royale' ? 'bg-indigo-500' : 'bg-indigo-300 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none`}
			>
				Battle Royale
			</button>
		</div>
	);
};

export default BattleMenu;
