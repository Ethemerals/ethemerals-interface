import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCore } from '../../hooks/useCore';

import useUserAccount from '../../hooks/useUserAccount';
import Gift from './actions/Gift';
import WinnerFund from './actions/WinnerFund';
import MakeMain from './actions/MakeMain';

const NFTActions = ({ nft }) => {
	const { account } = useUserAccount();
	const { core } = useCore();

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
		setIsGiftOpen(!isGiftOpen);
	};

	const toggleWinnerFund = () => {
		setIsWinnerFundOpen(!isWinnerFundOpen);
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
			<div className="w-48 h-96 bg-gray-900 top-40 right-4 fixed rounded-lg">
				<MakeMain id={nft.id} />
				<br></br>
				<button onClick={toggleGift} className="bg-pink-700 p-4">
					Gift
				</button>
				<br></br>
				<Link to={`/redemption/${nft.id}`}>
					<button className="bg-pink-700 p-4">Drain ELF</button>
				</Link>
				{isOwnedWinning && (
					<>
						<br></br>
						<button onClick={toggleWinnerFund} className="bg-pink-700 p-4">
							Claim Highest Honor
						</button>
					</>
				)}
				<br></br>
				<Link to={`/resurrect/${nft.id}`}>
					<button disabled={nft.score > 25} className={`${nft.score < 25 ? 'bg-pink-700' : 'bg-gray-800 cursor-default'} p-4`}>
						Resurrect
					</button>
				</Link>
			</div>
			{isWinnerFundOpen && <WinnerFund nft={nft} toggle={toggleWinnerFund} />}
			{isGiftOpen && <Gift nft={nft} toggle={toggleGift} />}
		</>
	);
};

export default NFTActions;
