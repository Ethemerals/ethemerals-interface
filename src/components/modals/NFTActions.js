import { useEffect, useState } from 'react';
import Images from '../../constants/Images';
import Links from '../../constants/Links';

import useUserAccount from '../../hooks/useUserAccount';
import NFTGift from './actions/NFTGift';
import NFTMakeMain from './actions/NFTMakeMain';

const NFTActions = ({ nft }) => {
	const { account } = useUserAccount();

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
				<button onClick={toggleGift} className="bg-pink-700 p-4">
					Gift
				</button>
				<NFTMakeMain account={account} id={nft.id} />
			</div>
			{isGiftOpen && <NFTGift nft={nft} toggle={toggleGift} />}
		</>
	);
};

export default NFTActions;
