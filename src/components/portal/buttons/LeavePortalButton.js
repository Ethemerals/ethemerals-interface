import NiceModal from '@ebay/nice-modal-react';
import { modalRegistry } from '../../niceModals/RegisterModals';

const LeavePortalButton = () => {
	const showModal = () => {
		NiceModal.show(modalRegistry.leavePortal);
	};

	return (
		<>
			<div className="relative">
				<button onClick={showModal} className="w-72 h-10 px-4 py-2 bg-blue-100 rounded hover:bg-yellow-100 m-2">
					<span className="flex justify-center">Deactivate Poly Merals</span>
				</button>
			</div>
		</>
	);
};

export default LeavePortalButton;
