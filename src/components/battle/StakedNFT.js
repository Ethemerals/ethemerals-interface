import { useState, useEffect } from 'react';
import useUserAccount from '../../hooks/useUserAccount';
import EternalBattleStatus from '../modals/actions/EternalBattleStatus';

const StakedNFT = ({ nft, contractPriceFeed, priceFeed }) => {
	const { account } = useUserAccount();
	const [isOwned, setIsOwned] = useState(false);

	const [isUnstakeOpen, setIsUnstakeOpen] = useState(false);

	const toggleUnstake = () => {
		setIsUnstakeOpen(!isUnstakeOpen);
	};

	useEffect(() => {
		if (account) {
			if (nft.previousOwner.id === account.id) {
				setIsOwned(true);
			}
		}
	}, [account, nft]);

	return (
		<>
			<div className={`flex bg-gray-600 items-center p-2`}>
				<p className="flex-grow">{`#${nft.id} ⚔️ ${nft.metadata.coin}`}</p>
				<button onClick={toggleUnstake} className="px-2 text-sm text-right text-gray-300 hover:text-white">
					{isOwned && <span className="mr-2">✅</span>}
					status
				</button>
			</div>
			{isUnstakeOpen && <EternalBattleStatus contractPriceFeed={contractPriceFeed} priceFeed={priceFeed} nft={nft} toggle={toggleUnstake} isOwned={isOwned} />}
		</>
	);
};

export default StakedNFT;
