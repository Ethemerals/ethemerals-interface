import NiceModal from '@ebay/nice-modal-react';
import { modalRegistry } from '../../niceModals/RegisterModals';

const GatewayStatus = () => {
	const onSubmitFaucet = async () => {
		NiceModal.show(modalRegistry.faucet);
	};

	return (
		<div className="w-1/3 rounded-md relative overflow-hidden bg-blue-200 text-center p-4">
			<p className="pb-4">VALIDATOR STATUS</p>

			<div
				onClick={onSubmitFaucet}
				className="px-4 py-2 text-xs shadow-md font-bold cursor-pointer relative rounded-md border-blue-600 border text-white bg-blue-500 hover:bg-blue-400 hover:text-blue-40 transition 300"
			>
				<span>REQUEST MATIC</span>
			</div>
		</div>
	);
};
export default GatewayStatus;
