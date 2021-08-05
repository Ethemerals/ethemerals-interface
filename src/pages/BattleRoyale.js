import BattleMenu from '../components/navigation/BattleMenu';
import HighestHonorBar from '../components/navigation/HighestHonorBar';

const BattleRoyale = () => {
	return (
		<div className="scrollbar_pad">
			<div className="page_bg"></div>
			<HighestHonorBar />
			<BattleMenu current="royale" />

			<div className="text-center my-20">In progress</div>
		</div>
	);
};

export default BattleRoyale;
