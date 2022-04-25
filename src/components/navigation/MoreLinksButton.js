import NiceModal from '@ebay/nice-modal-react';

import { modalRegistry } from '../niceModals/RegisterModals';

const MoreLinksButton = ({ large }) => {
	const toggle = (large) => {
		NiceModal.show(modalRegistry.moreLinks, { large });
	};

	return (
		<button
			className="w-10 h-10 mx-2 focus:outline-none bg-white flex items-center justify-center hover:bg-brandColor-pale rounded transition duration-300 border border-brandColor-purple text-brandColor-purple"
			onClick={() => toggle(large)}
		>
			<svg width="24px" height="24px" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
				<path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
			</svg>
		</button>
	);
};

export default MoreLinksButton;
