import { useEffect, useState } from 'react';
import { useEscrowL1Account } from '../../hooks/useEscrowL1';
import { useBridgeCollection } from '../../hooks/useBridge';
import { getTokenIdFromId, getTypeFromId } from '../../hooks/useMeralUtils';
import { useUserAccount } from '../../hooks/useUser';
import MeralList from '../niceModals/cards/MeralList';
import { useMoralisQuery } from 'react-moralis';
import { Addresses } from '../../constants/contracts/Addresses';

const ProcessingCards = ({ log }) => {
	// "Meral_Mint_Sub"
	let cueData = {
		tokenId: log.tokenId,
		event: 'Mint',
	};

	if (log.event === 'EscrowL1_Deposit_Sub') {
		cueData.event = 'Deposit';
		cueData.tokenId = getTokenIdFromId(log.tokenId);
	}
	if (log.event === 'EscrowL1_Withdraw_Sub') {
		cueData.event = 'Withdraw';
		cueData.tokenId = getTokenIdFromId(log.tokenId);
	}

	return (
		<div className="w-16 h-16 bg-yellow-50 m-2 border border-black text-xs">
			<p>token:{cueData.tokenId}</p>
			<p>process:</p>
			<p>{cueData.event}</p>
		</div>
	);
};

const HoldingCards = ({ nft }) => {
	// "Meral_Mint_Sub"

	return (
		<div className="w-16 h-16 bg-yellow-50 m-2 border border-black text-xs">
			<p>token:{getTokenIdFromId(nft.tokenId)}</p>
		</div>
	);
};

const PortalBridge = () => {
	const { bridgeLogsActive, bridgeLogsActiveCount } = useBridgeCollection();

	const [holding, setHolding] = useState([]);
	const { data, error, isLoading } = useMoralisQuery('EthNFTOwnersPending', (query) => query.equalTo('token_address', Addresses.Ethemerals).descending('block_number'), [], {
		live: true,
		onLiveEnter: (entity, all) => [...all, entity],
		onLiveCreate: (entity, all) => [...all, entity],
		onLiveDelete: (entity, all) => all.filter((e) => e.id !== entity.id),
		onLiveLeave: (entity, all) => all.filter((e) => e.id !== entity.id),
		onLiveUpdate: (entity, all) => all.map((e) => (e.id === entity.id ? entity : e)),
	});

	useEffect(() => {
		if (data && data.length > 0) {
			let _holding = [];
			data.forEach((token) => {
				let owner = token.get('owner_of');
				let tokenId = token.get('token_id');
				_holding.push({ tokenId, owner });
			});
			setHolding(_holding);
		} else {
			setHolding([]);
		}
	}, [data]);

	// useEffect(() => {
	// 	console.log('bridgeLogsActive', bridgeLogsActive);
	// 	console.log('bridgeLogsActiveCount', bridgeLogsActiveCount);
	// 	console.log('loadingBridgeLogsActive', loadingBridgeLogsActive);
	// }, [bridgeLogsActive, bridgeLogsActiveCount, loadingBridgeLogsActive]);

	return (
		<div className="bg-gray-200 p-4 pb-20 m-4 w-96">
			<h1>Bridge</h1>
			<p>Gateway Processing: {bridgeLogsActiveCount}</p>
			<div style={{ minHeight: '128px' }} className="flex-wrap flex justify-center">
				{bridgeLogsActive && bridgeLogsActive.length > 0 && bridgeLogsActive.map((log) => <ProcessingCards key={log.timestamp} log={log} />)}
			</div>

			<div className="pt-24"></div>
			<p>Merals Currently Transporting: {holding.length}</p>
			<div style={{ minHeight: '128px' }} className="flex-wrap flex justify-center">
				{holding && holding.length > 0 && holding.map((nft) => <HoldingCards key={nft.tokenId} nft={nft} />)}
			</div>

			{/* TODO - INFO ABOUT MERALS ON THE OTHER SIDE */}
			{/* <h4>Pending Transportation</h4>
			<MeralList nfts={escrowL1NFTs} />
			<h2>users:</h2>
			<MeralList nfts={userProxyNFTs} /> */}
		</div>
	);
};

export default PortalBridge;
