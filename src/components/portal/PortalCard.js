import { useEffect, useState } from 'react';
import { useEscrowL1Account } from '../../hooks/useEscrowL1';

import StakedEscrowL1Card from './cards/stakedEscrowL1Card';

const PortalCard = () => {
	// const { accountEscrowL1 } = useEscrowL1Account();

	const [stakedNFT, setStakedNFT] = useState(undefined);

	// useEffect(() => {
	// 	if (accountEscrowL1) {
	// 		let _stakedNFT = [];
	// 		accountEscrowL1.ethemerals.forEach((nft) => {
	// 			_stakedNFT.push(nft);
	// 		});
	// 		setStakedNFT(_stakedNFT);
	// 	}
	// }, [accountEscrowL1]);

	return (
		<div className="bg-gray-200 bg-opacity-80 p-4 pb-20 border-4 border-white mt-16 mb-4 w-96">
			<h1>Portal</h1>
			{/* TODO - INFO ABOUT MERALS ON THE OTHER SIDE */}
			<h4>Currenty In Portal</h4>
			{stakedNFT && stakedNFT.length > 0 && stakedNFT.map((nft) => <StakedEscrowL1Card key={nft.id} nft={nft} />)}
		</div>
	);
};

export default PortalCard;
