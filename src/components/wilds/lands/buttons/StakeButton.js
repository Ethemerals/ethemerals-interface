import NiceModal from '@ebay/nice-modal-react';

import { modalRegistry } from '../../../niceModals/RegisterModals';

const StakeButton = ({ landId, stakeAction }) => {
	const showModal = () => {
		NiceModal.show(modalRegistry.landStakeSelect, { landId, stakeAction });
	};

	return (
		<>
			<div>
				<button onClick={showModal} className="w-64 h-10 px-4 py-2 bg-blue-100 rounded hover:bg-yellow-100">
					<span className="flex justify-center">Send Meral To {stakeAction.name}</span>
				</button>
			</div>
		</>
	);
};

export default StakeButton;
