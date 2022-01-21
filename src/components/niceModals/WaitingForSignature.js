import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useEffect, useState } from 'react';
import { useMiningStatus } from '../../context/TxContext';

const SpinnerSVG = () => (
	<svg className=" animate-spin-slow text-brandColor" width="80" height="80" viewBox="0 0 304 304" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g opacity="1">
			<path
				d="M152 304C68.0527 304 0 235.947 0 152C0 68.0527 68.0527 0 152 0L152 10.6431C73.9306 10.6431 10.6429 73.9308 10.6429 152C10.6429 230.069 73.9306 293.357 152 293.357C230.069 293.357 293.357 230.069 293.357 152L304 152C304 235.947 235.947 304 152 304Z"
				fill="currentColor"
			/>
		</g>
	</svg>
);

export default NiceModal.create(({ message }) => {
	const modal = useModal();
	const mining = useMiningStatus();
	const [processing, setProcessing] = useState(undefined);

	useEffect(() => {
		if (mining) {
			setProcessing(true);
		}
		if (!mining && processing) {
			setProcessing(false);
			modal.remove();
		}
		console.log(mining);
	}, [mining]);

	const toggle = () => {
		modal.remove();
	};

	return (
		<>
			<div onClick={toggle} className="fixed left-0 top-0 w-screen h-screen"></div>

			<div className=" w-11/12 max-w-420 h-96 center bg-opacity-100 rounded tracking-wide shadow-xl bg-white">
				<div className="flex justify-end">
					<span onClick={toggle} className="cursor-pointer p-4 text-black hover:text-gray-500">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
						</svg>
					</span>
				</div>
				<div className="text-center">
					<div className="flex justify-center py-6">
						<SpinnerSVG />
					</div>
					<div>
						<p className="text-xl">Waiting for Confirmation</p>
						<p className="px-6 py-4">{message && message}</p>
						{!mining && <p className="text-sm text-brandColor">Confirm this transaction in your wallet</p>}
						{processing && <p className="text-sm text-brandColor">Processing ...</p>}
					</div>
				</div>
			</div>
		</>
	);
});
