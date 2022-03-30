import NiceModal from '@ebay/nice-modal-react';
import { useEffect, useState } from 'react';

import Images from '../../../constants/Images';

import { useUserAccount } from '../../../hooks/useUser';

import { modalRegistry } from '../../niceModals/RegisterModals';

const NFTPolyActions = ({ nft }) => {
	const { account, userMerals } = useUserAccount();

	const [isOwned, setIsOwned] = useState(false);

	const showRegisterModal = () => {
		NiceModal.show(modalRegistry.registerMeral);
	};

	useEffect(() => {
		let owned = false;

		// TODO
		if (parseInt(process.env.REACT_APP_NETWORK) !== 1) {
			if (userMerals && userMerals.length > 0) {
				userMerals.forEach((meral) => {
					if (parseInt(meral.meralId) === parseInt(nft.meralId)) {
						owned = true;
					}
				});
			}
		}

		setIsOwned(owned);
	}, [userMerals, nft]);

	if (!nft) {
		return null;
	}

	return (
		<div className="grid grid-cols-1 gap-2 px-2 text-sm text-white">
			<button
				disabled={!isOwned}
				onClick={showRegisterModal}
				className={`flex items-center rounded-lg cursor-default ${account && isOwned ? 'bg-blue-400 cursor-pointer hover:bg-blue-300 transition duration-200' : 'bg-customBlue-pale'}`}
			>
				<div className="w-8 h-8 mr-1 relative">
					<img className="center" width="22px" height="22px" alt="icon wing" src={Images.iconAvatar} />
				</div>
				<p>Activate Proxy</p>
			</button>
		</div>
	);
};

export default NFTPolyActions;
