import { useEscrowL1Account } from '../../../hooks/useEscrowL1';
import MeralList from '../../niceModals/cards/MeralList';

const PortalMain = () => {
	const { escrowL1NFTs } = useEscrowL1Account();
	const selectAndToggle = async (id) => {
		console.log('hi', id);
		// TODO
	};

	return (
		<div className="bg-gray-50 p-4 pb-20 mx-2 w-400 border border-black">
			<h1>Gateway</h1>
			{/* TODO - INFO ABOUT MERALS ON THE OTHER SIDE */}
			<h4>Recently Entered:</h4>
			<MeralList nfts={escrowL1NFTs} select={selectAndToggle} />
		</div>
	);
};

export default PortalMain;
