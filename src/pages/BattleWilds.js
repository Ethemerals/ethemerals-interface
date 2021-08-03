import BattleMenu from '../components/navigation/BattleMenu';
import HighestHonorBar from '../components/navigation/HighestHonorBar';

const BattleWilds = () => {
	return (
		<>
			<div className="page_bg"></div>
			<BattleMenu current="wilds" />
			<HighestHonorBar />
			<div className="text-center my-20">In progress</div>
		</>
	);
};

export default BattleWilds;
