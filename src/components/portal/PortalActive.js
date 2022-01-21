import { useEffect, useState } from 'react';
import { useEscrowL1Account } from '../../hooks/useEscrowL1';
import { getTypeFromId } from '../../hooks/useMeralUtils';
import { useUserProxyMerals } from '../../hooks/useUser';

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

const PortalActive = () => {
	const { escrowL1NFTs, escrowL1Account } = useEscrowL1Account();
	const { proxyNfts } = useUserProxyMerals();

	return (
		<div className="bg-gray-200 bg-opacity-80 p-4 pb-20 border-4 border-white mt-16 mb-4 w-96">
			<h1>Wilds</h1>
			{/* TODO - INFO ABOUT MERALS ON THE OTHER SIDE */}
			<h4>Active</h4>
			<div className="flex-wrap flex"> {proxyNfts && proxyNfts.length > 0 && proxyNfts.map((nft) => <StakedCard key={nft.meralId} nft={nft} />)}</div>
		</div>
	);
};

export default PortalActive;
