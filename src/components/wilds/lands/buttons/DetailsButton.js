import NiceModal from '@ebay/nice-modal-react';
import { modalRegistry } from '../../../niceModals/RegisterModals';

const SlotDetails = () => {
	const showModal = () => {
		NiceModal.show(modalRegistry.sendDefender);
	};

	return (
		<>
			<div>
				<button onClick={showModal} className="w-64 h-10 px-4 py-2 bg-blue-100 rounded hover:bg-yellow-100">
					<span className="flex justify-center">Slot Details</span>
				</button>
			</div>
		</>
	);
};

export default SlotDetails;
