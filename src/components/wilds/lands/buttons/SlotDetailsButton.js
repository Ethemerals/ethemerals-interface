import NiceModal from '@ebay/nice-modal-react';
import { StakeAction } from '../../../../hooks/useWilds';
import { modalRegistry } from '../../../niceModals/RegisterModals';

const SlotDetails = ({ landId, stakeAction }) => {
	let buttonString = 'Details';

	if (stakeAction === StakeAction.ATTACK.type) {
		buttonString = 'Enter Raid';
	}

	const showModal = (stakeAction) => {
		if (stakeAction === StakeAction.DEFEND.type) {
			showDefendersModal();
		}
		if (stakeAction === StakeAction.ATTACK.type) {
			showAttackersModal();
		}
		if (stakeAction === StakeAction.LOOT.type) {
			showLootersModal();
		}
		if (stakeAction === StakeAction.BIRTH.type) {
			showBirthersModal();
		}
	};

	const showDefendersModal = () => {
		NiceModal.show(modalRegistry.openDefenders, { landId });
	};
	const showAttackersModal = () => {
		NiceModal.show(modalRegistry.openAttackers, { landId });
	};
	const showLootersModal = () => {
		NiceModal.show(modalRegistry.openLooters, { landId });
	};
	const showBirthersModal = () => {
		NiceModal.show(modalRegistry.openBirthers, { landId });
	};

	return (
		<>
			<div>
				<button onClick={() => showModal(stakeAction)} className="w-64 h-10 px-4 py-2 bg-blue-100 rounded hover:bg-yellow-100">
					<span className="flex justify-center">{buttonString}</span>
				</button>
			</div>
		</>
	);
};

export default SlotDetails;
