import { useState, useEffect } from 'react';
import useUserAccount from '../../hooks/useUserAccount';
import UnstakeEternalBattle from '../modals/actions/UnstakeEternalBattle';

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
	}, [account]);

	return (
		<>
			<div className={`flex space-x-3 ${isOwned ? 'bg-gray-800' : 'bg-gray-600'} `}>
				<p>{nft.metadata.coin}</p>
				<button onClick={toggleUnstake} className="bg-indigo-900 rounded-lg">
					Check Status
				</button>
			</div>
			{isUnstakeOpen && <UnstakeEternalBattle contractPriceFeed={contractPriceFeed} priceFeed={priceFeed} nft={nft} toggle={toggleUnstake} isOwned={isOwned} />}
		</>
	);
};

export default StakedNFT;
