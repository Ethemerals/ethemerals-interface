import { useEffect, useState } from 'react';
import { useEscrowL1Account } from '../../hooks/useEscrowL1';
import { getTypeFromId } from '../../hooks/useMeralUtils';

const StakedCard = ({ nft }) => {
	let type = getTypeFromId(nft.meralId);
	return (
		<div className="w-16 h-16 bg-yellow-50 m-2 border border-black text-xs">
			<p>type:{nft.type}</p>
			<p>{nft.tokenId}</p>
			{type === 1 && <p>{nft.coin}</p>}
      
		</div>
	);
};

const PortalCard = () => {
	const { escrowL1NFTs, escrowL1Account } = useEscrowL1Account();

	useEffect(() => {
		// console.log(escrowL1NFTs);
		// console.log(escrowL1Account);
	}, [escrowL1NFTs, escrowL1Account]);

	return (
		<div className="bg-gray-200 bg-opacity-80 p-4 pb-20 border-4 border-white mt-16 mb-4 w-96">
			<h1>Portal</h1>
			{/* TODO - INFO ABOUT MERALS ON THE OTHER SIDE */}
			<h4>Currenty In Portal</h4>
			<div className="flex-wrap flex"> {escrowL1NFTs && escrowL1NFTs.length > 0 && escrowL1NFTs.map((nft) => <StakedCard key={nft.meralId} nft={nft} />)}</div>
		</div>
	);
};

export default PortalCard;
