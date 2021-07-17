import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useCore } from '../../hooks/useCore';

import Images from '../../constants/Images';

import useUserAccount from '../../hooks/useUserAccount';
import Gift from './actions/Gift';
import WinnerFund from './actions/WinnerFund';
import { shortenAddress } from '../../utils';

const NFTActions = ({ nft }) => {
	const { account, mutateUser, mainIndex, userNFTs } = useUserAccount();
	const { core } = useCore();
	const history = useHistory();

	const [isOwned, setIsOwned] = useState(false);
	const [isOwnedWinning, setIsOwnedWinning] = useState(false);
	const [isWinnerFundOpen, setIsWinnerFundOpen] = useState(false);
	const [isGiftOpen, setIsGiftOpen] = useState(false);

	useEffect(() => {
		if (account && core) {
			if (nft.id === core.winningCoin) {
				if (account.ethemerals.length > 0) {
					setIsOwnedWinning(false);
					account.ethemerals.forEach((userNft) => {
						if (userNft.id === core.winningCoin) {
							setIsOwnedWinning(true);
						}
					});
				}
			}
		}
	}, [account, core, nft]);

	const toggleGift = () => {
		if (isOwned) {
			setIsGiftOpen(!isGiftOpen);
		}
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

	if (!nft) {
		return null;
	}

	const selectMain = (id) => {
		if (account && isOwned) {
			mutateUser.mutate({ address: account.id, main: id });
		}
	};

	const handleSell = (id) => {
		console.log('sell', id);
	};

	const handleBuy = (id) => {
		console.log('buy', id);
	};

	return (
		<div className="grid grid-cols-2 gap-2 px-4">
			{account && isOwned && userNFTs[mainIndex].id === nft.id ? (
				<div className="flex items-center col-span-2 rounded-lg opacity-100 cursor-default">
					<div className="w-8 h-8 mr-1 relative">
						<img className="center" width="26px" height="26px" alt="icon main" src={Images.iconMain} />
					</div>
					<p>Current Main Ethemeral</p>
				</div>
			) : (
				<div
					onClick={() => selectMain(nft.id)}
					className={`flex items-center col-span-2 rounded-lg opacity-40 cursor-default ${
						account && isOwned ? 'opacity-70 cursor-pointer hover:opacity-100 hover:bg-brandColor-dark transition duration-200' : ''
					}`}
				>
					<div className="w-8 h-8 mr-1 relative">
						<img className="center" width="26px" height="26px" alt="icon main" src={Images.iconMain} />
					</div>
					{account && isOwned ? <p>Select as Main</p> : <p>Owner: {shortenAddress(nft.owner.id)}</p>}
				</div>
			)}

			{account && isOwned ? (
				<div onClick={() => handleSell(nft.id)} className="flex items-center rounded-lg opacity-70 cursor-pointer hover:opacity-100 hover:bg-yellow-400 transition duration-200">
					<div className="w-8 h-8 mr-1 relative">
						<img className="center" width="20px" height="20px" alt="icon sell" src={Images.iconSell} />
					</div>
					<p>Sell</p>
				</div>
			) : (
				<div onClick={() => handleBuy(nft.id)} className="flex items-center rounded-lg cursor-pointer hover:opacity-100 hover:bg-yellow-400 transition duration-200">
					<div className="w-8 h-8 mr-1 relative">
						<img className="center" width="20px" height="20px" alt="icon sell" src={Images.iconSell} />
					</div>
					<p>Buy</p>
				</div>
			)}

			<div
				onClick={() => {
					if (isOwned) {
						history.push(`/redemption/${nft.id}`);
					}
				}}
				className={`flex items-center rounded-lg opacity-40 cursor-default ${account && isOwned ? 'opacity-70 cursor-pointer hover:opacity-100 hover:bg-yellow-400 transition duration-200' : ''}`}
			>
				<div className="w-8 h-8 mr-1 relative">
					<img className="center" width="20px" height="20px" alt="icon drain" src={Images.iconDrain} />
				</div>
				<p>Redeem ELF</p>
			</div>

			<div
				onClick={toggleGift}
				className={`flex items-center rounded-lg opacity-40 cursor-default ${account && isOwned ? 'opacity-70 cursor-pointer hover:opacity-100 hover:bg-yellow-400 transition duration-200' : ''}`}
			>
				<div className="w-8 h-8 mr-1 relative">
					<img className="center" width="20px" height="20px" alt="icon gift" src={Images.iconGift} />
				</div>
				<p>Gift</p>
			</div>

			<div
				onClick={() => {
					if (isOwned) {
						history.push(`/resurrect/${nft.id}`);
					}
				}}
				className={`flex items-center rounded-lg opacity-40 cursor-default ${account && isOwned ? 'opacity-70 cursor-pointer hover:opacity-100 hover:bg-yellow-400 transition duration-200' : ''}`}
			>
				<div className="w-8 h-8 mr-1 relative">
					<img className="center" width="26px" height="26px" alt="icon wing" src={Images.iconWings} />
				</div>
				<p>Resurrect</p>
			</div>
			{isGiftOpen && <Gift nft={nft} toggle={toggleGift} />}
		</div>
	);
};

export default NFTActions;
