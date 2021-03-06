import { useEffect, useState } from 'react';

import { Links } from '../../../constants/Links';
import { Addresses } from '../../../constants/contracts/Addresses';

import Images from '../../../constants/Images';

import { useUser, useUserAccount } from '../../../hooks/useUser';
import Gift from '../../ethemerals/modals/Gift';
import SummonPet from '../../ethemerals/modals/SummonPet';
import { shortenAddress } from '../../../utils';

const NFTActions = ({ nft }) => {
	const { account, mainIndex, userMerals } = useUserAccount();
	const { setUserData, isUserUpdating } = useUser();

	const [isOwned, setIsOwned] = useState(false);

	const [isInBattle, setIsInBattle] = useState(false);
	const [isGiftOpen, setIsGiftOpen] = useState(false);
	const [isSummonPetOpen, setIsSummonPetOpen] = useState(false);

	useEffect(() => {
		if (nft && nft.owner.id === Addresses.EternalBattle.toLowerCase()) {
			setIsInBattle(true);
		}
	}, [nft]);

	const toggleGift = () => {
		if (isOwned) {
			setIsGiftOpen(!isGiftOpen);
		}
	};

	const toggleSummon = () => {
		if (isOwned && !nft.petRedeemed) {
			setIsSummonPetOpen(!isSummonPetOpen);
		}
	};

	useEffect(() => {
		let owned = false;
		if (userMerals && userMerals.length > 0) {
			userMerals.forEach((meral) => {
				if (parseInt(meral.meralId) === parseInt(nft.meralId)) {
					owned = true;
				}
			});
		}
		setIsOwned(owned);
	}, [userMerals, nft]);

	if (!nft) {
		return null;
	}

	const selectMain = async (id) => {
		if (account && isOwned) {
			try {
				setUserData({
					meralMainId: parseInt(id),
				});
			} catch (error) {
				console.log(error);
			}
		}
	};

	const openSeaURL = `${Links.OPENSEAS}/${Addresses.Ethemerals}/${nft.tokenId}`;

	return (
		<div className="grid grid-cols-2 gap-2 px-2 text-sm text-white">
			{isInBattle ? (
				<div className="flex items-center rounded-lg cursor-default">
					<div className="w-8 h-8 mr-1 relative">
						<img className="center" width="24px" height="24px" alt="icon main" src={Images.iconMain} />
					</div>
					<p className="text-black">{'In Battle!'}</p>
				</div>
			) : account && isOwned && userMerals[mainIndex] && userMerals[mainIndex].meralId === nft.meralId ? (
				<div className="flex items-center rounded-lg cursor-default">
					<div className="w-8 h-8 mr-1 relative">
						<img className="center" width="24px" height="24px" alt="icon main" src={Images.iconMain} />
					</div>
					<p className="text-black">{!isUserUpdating ? 'Current Main' : 'Updating'}</p>
				</div>
			) : (
				<div
					onClick={() => selectMain(nft.meralId)}
					className={`flex items-center rounded-lg cursor-default text-white ${account && isOwned ? 'bg-pink-500 cursor-pointer hover:bg-pink-300 transition duration-200' : ''}`}
				>
					<div className="w-8 h-8 mr-1 relative">
						<img className="center" width="24px" height="24px" alt="icon main" src={Images.iconMain} />
					</div>
					{account && isOwned ? <p>{!isUserUpdating ? 'Select as Main' : 'Updating'}</p> : <p className="text-black">Owner: {shortenAddress(nft.owner.id, 2)}</p>}
				</div>
			)}

			<div
				onClick={toggleSummon}
				className={`flex items-center rounded-lg cursor-default ${
					account && isOwned && !nft.petRedeemed ? 'bg-blue-500 cursor-pointer hover:bg-blue-400 transition duration-200' : ' bg-customBlue-pale'
				}`}
			>
				<div className="w-8 h-8 mr-1 relative">
					<img className="center" width="20px" height="20px" alt="icon gift" src={Images.iconPet} />
				</div>
				{nft && !nft.petRedeemed ? <p>Summon Pet</p> : <p className="text-red-500">Pet Redeemed</p>}
			</div>

			{/* BID OR SELL */}
			{account && isOwned && (
				<a href={openSeaURL} target="blank" rel="noreferrer">
					<div className="flex items-center bg-red-600 rounded-lg cursor-pointer hover:bg-red-400 transition duration-200">
						<div className="w-8 h-8 mr-1 relative">
							<img className="center" width="20px" height="20px" alt="icon sell" src={Images.iconSell} />
						</div>
						<p>Sell</p>
					</div>
				</a>
			)}
			{!isOwned && (
				<a href={openSeaURL} target="blank" rel="noreferrer">
					<div className="flex items-center bg-green-600 rounded-lg cursor-pointer hover:bg-green-400 transition duration-200">
						<div className="w-8 h-8 mr-1 relative">
							<img className="center" width="20px" height="20px" alt="icon sell" src={Images.iconSell} />
						</div>
						<p>Bid</p>
					</div>
				</a>
			)}

			<div
				onClick={toggleGift}
				className={`flex items-center rounded-lg cursor-default ${account && isOwned ? 'bg-green-500 cursor-pointer hover:bg-green-400 transition duration-200' : ' bg-customBlue-pale'}`}
			>
				<div className="w-8 h-8 mr-1 relative">
					<img className="center" width="20px" height="20px" alt="icon gift" src={Images.iconGift} />
				</div>
				<p>Gift</p>
			</div>

			{isGiftOpen && <Gift nft={nft} toggle={toggleGift} />}
			{isSummonPetOpen && <SummonPet nft={nft} toggle={toggleSummon} />}
		</div>
	);
};

export default NFTActions;
