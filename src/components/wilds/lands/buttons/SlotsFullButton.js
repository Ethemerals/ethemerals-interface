import NiceModal from '@ebay/nice-modal-react';

import { modalRegistry } from '../../../niceModals/RegisterModals';

const SlotsFullButton = () => {
	return (
		<>
			<div>
				<button className="w-64 h-10 px-4 py-2 bg-blue-100 rounded hover:bg-yellow-100">
					<span className="flex justify-center">Slots Full</span>
				</button>
			</div>
		</>
	);
};

export default SlotsFullButton;
