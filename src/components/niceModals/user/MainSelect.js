import NiceModal, { useModal } from '@ebay/nice-modal-react';

import { useUser, useUserAccount } from '../../../hooks/useUser';
import MeralThumbnail from '../../ethemerals/cards/MeralThumbnail';

export default NiceModal.create(() => {
	const modal = useModal();
	const { userMerals } = useUserAccount();
	const { setUserData, user } = useUser();

	const toggle = async () => {
		modal.remove();
	};

	const selectAndToggle = async (id) => {
		if (userMerals && user) {
			setUserData({ meralMainId: parseInt(id) });
		}
		toggle();
	};

	if (!userMerals) {
		return <></>;
	}

	return (
		<>
			<div className="w-full h-full absolute top-0 animate-fadeOnFast z-30 overflow-visible">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 bg-opacity-50 bg-black"></div>
				<div className="center shadow-xl rounded bg-white">
					<h2 className="text-center p-4">Select a Meral:</h2>
					<div className="flex flex-wrap justify-center px-6 pb-12 pt-6 gap-4">
						{userMerals.map((nft) => {
							return <MeralThumbnail key={nft.meralId} nft={nft} select={selectAndToggle} />;
						})}
					</div>
				</div>
			</div>
		</>
	);
});
