import BattleMenu from '../components/navigation/BattleMenu';
import HighestHonorBar from '../components/navigation/HighestHonorBar';

const BattleRoyale = () => {
	return (
		<>
			<div className="page_bg"></div>
			<BattleMenu current="royale" />
			<HighestHonorBar />
			<div className="text-center my-20">In progress</div>
		</>
	);
};

export default BattleRoyale;
