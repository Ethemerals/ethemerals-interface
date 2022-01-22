import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Links } from '../../../constants/Links';
import { Addresses } from '../../../constants/contracts/Addresses';

import Images from '../../../constants/Images';

import { useUser, useUserAccount } from '../../../hooks/useUser';
import Gift from '../../modals/actions/Gift';
import SummonPet from '../../modals/actions/SummonPet';
import { shortenAddress } from '../../../utils';

const NFTActions = ({ nft }) => {
	const { account, mainIndex, userNFTs } = useUserAccount();
	const { setUserData, isUserUpdating } = useUser();
	const history = useHistory();

	const [isOwned, setIsOwned] = useState(false);

	const [isStaked, setIsStaked] = useState(false);
	const [isInBattle, setIsInBattle] = useState(false);
	const [isGiftOpen, setIsGiftOpen] = useState(false);
	const [isSummonPetOpen, setIsSummonPetOpen] = useState(false);

	useEffect(() => {
		if (nft && nft.owner === Addresses.EscrowL1.toLowerCase()) {
			setIsStaked(true);
		}
		if (nft && nft.owner === Addresses.EternalBattle.toLowerCase()) {
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
		if (account && account.merals.length > 0) {
			account.merals.forEach((userNft) => {
				if (userNft.meralId === nft.meralId) {
					owned = true;
				}
			});
		}
		setIsOwned(owned);
	}, [account, nft]);

	if (!nft) {
		return null;
	}

	const selectMain = async (id) => {
		if (account && isOwned) {
			try {
				setUserData({
					meralMainId: id,
				});
			} catch (error) {
				console.log(error);
			}
		}
	};

	const openSeaURL = `${Links.OPENSEAS}/${Addresses.Ethemerals}/${nft.tokenId}`;

	return (
		<div className="grid grid-cols-2 gap-2 px-2 text-sm text-white">
			{isStaked || isInBattle ? (
				<div className="flex items-center col-span-2 rounded-lg cursor-default">
					<div className="w-8 h-8 mr-1 relative">
						<img className="center" width="26px" height="26px" alt="icon main" src={Images.iconMain} />
					</div>
					<p className="text-black">{isStaked ? 'Shes In The Poly Portal!' : 'In Battle!'}</p>
				</div>
			) : account && isOwned && userNFTs[mainIndex] && userNFTs[mainIndex].meralId === nft.meralId ? (
				<div className="flex items-center col-span-2 rounded-lg cursor-default">
					<div className="w-8 h-8 mr-1 relative">
						<img className="center" width="26px" height="26px" alt="icon main" src={Images.iconMain} />
					</div>
					<p className="text-black">{!isUserUpdating ? 'Current Main Ethemeral' : 'Updating'}</p>
				</div>
			) : (
				<div
					onClick={() => selectMain(nft.meralId)}
					className={`flex items-center col-span-2 rounded-lg cursor-default text-white ${account && isOwned ? 'bg-pink-500 cursor-pointer hover:bg-pink-300 transition duration-200' : ''}`}
				>
					<div className="w-8 h-8 mr-1 relative">
						<img className="center" width="26px" height="26px" alt="icon main" src={Images.iconMain} />
					</div>
					{account && isOwned ? <p>{!isUserUpdating ? 'Select as Main' : 'Updating'}</p> : <p className="text-black">Owner: {shortenAddress(nft.owner)}</p>}
				</div>
			)}

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
			{!isOwned && !isInBattle && (
				<a href={openSeaURL} target="blank" rel="noreferrer">
					<div className="flex items-center bg-green-600 rounded-lg cursor-pointer hover:bg-green-400 transition duration-200">
						<div className="w-8 h-8 mr-1 relative">
							<img className="center" width="20px" height="20px" alt="icon sell" src={Images.iconSell} />
						</div>
						<p>Bid</p>
					</div>
				</a>
			)}
			{isInBattle && (
				<a href={openSeaURL} target="blank" rel="noreferrer">
					<div className="flex items-center bg-customBlue-pale rounded-lg cursor-pointer">
						<div className="w-8 h-8 mr-1 relative">
							<img className="center" width="20px" height="20px" alt="icon sell" src={Images.iconSell} />
						</div>
						<p>Bid</p>
					</div>
				</a>
			)}

			<div
				onClick={() => {
					if (isOwned && false) {
						history.push(`/redemption/${nft.tokenId}`);
					}
				}}
				// TODO
				className={`flex items-center rounded-lg cursor-default ${
					account && isOwned && false ? 'bg-brandColor cursor-pointer hover:bg-brandColor-pale transition duration-200' : ' bg-customBlue-pale'
				}`}
			>
				<div className="w-8 h-8 mr-1 relative">
					<img className="center" width="20px" height="20px" alt="icon drain" src={Images.iconDrain} />
				</div>
				<p>Redeem ELF</p>
			</div>

			<div
				onClick={toggleGift}
				className={`flex items-center rounded-lg cursor-default ${account && isOwned ? 'bg-green-500 cursor-pointer hover:bg-green-400 transition duration-200' : ' bg-customBlue-pale'}`}
			>
				<div className="w-8 h-8 mr-1 relative">
					<img className="center" width="20px" height="20px" alt="icon gift" src={Images.iconGift} />
				</div>
				<p>Gift</p>
			</div>

			<div
				onClick={() => {
					if (isOwned && false) {
						history.push(`/resurrect/${nft.tokenId}`);
					}
				}}
				// TODO
				className={`flex items-center rounded-lg cursor-default ${account && isOwned && false ? 'bg-blue-400 cursor-pointer hover:bg-blue-300 transition duration-200' : 'bg-customBlue-pale'}`}
			>
				<div className="w-8 h-8 mr-1 relative">
					<img className="center" width="26px" height="26px" alt="icon wing" src={Images.iconWings} />
				</div>
				<p>Resurrect</p>
			</div>

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

			{isGiftOpen && <Gift nft={nft} toggle={toggleGift} />}
			{isSummonPetOpen && <SummonPet nft={nft} toggle={toggleSummon} />}
		</div>
	);
};

export default NFTActions;
