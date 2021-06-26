import { useEffect, useState } from 'react';
import Images from '../../constants/Images';
import Links from '../../constants/Links';

import useUserAccount from '../../hooks/useUserAccount';
import Gift from './actions/Gift';
import MakeMain from './actions/MakeMain';

const NFTActions = ({ nft }) => {
	const { account, address } = useUserAccount();

	const [isOwned, setIsOwned] = useState(false);
	const [isGiftOpen, setIsGiftOpen] = useState(false);

	const toggleGift = () => {
		setIsGiftOpen(!isGiftOpen);
	};

	useEffect(() => {
		let owned = false;
		if (account && account.ethemerals.length > 0) {
			account.ethemerals.forEach((userNft, index) => {
				if (userNft.id === nft.id) {
					owned = true;
				}
			});
		}
		setIsOwned(owned);
	}, [account, nft]);

	if (!isOwned) {
		return null;
	}

	return (
		<>
			<div className="w-48 h-64 bg-gray-900 top-40 right-4 fixed rounded-lg">
				<MakeMain id={nft.id} />
				<button onClick={toggleGift} className="bg-pink-700 p-4">
					Gift
				</button>
			</div>
			{isGiftOpen && <Gift nft={nft} toggle={toggleGift} />}
		</>
	);
};

export default NFTActions;
