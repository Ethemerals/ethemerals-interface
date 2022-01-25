import { AddressZero } from '@ethersproject/constants';
import { useEffect, useState } from 'react';

import { useBridgeCollection } from '../../../hooks/useBridge';
import { getTokenIdFromId, getTypeFromId } from '../../../hooks/useMeralUtils';

import { useMoralisQuery } from 'react-moralis';
import { Addresses } from '../../../constants/contracts/Addresses';

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
			<p>Type:{nft.type}</p>
			<p>token:{nft.tokenId}</p>
		</div>
	);
};

const PortalBridge = () => {
	const { bridgeLogsActive, bridgeLogsActiveCount } = useBridgeCollection();

	const [meralMint, setMeralMint] = useState([]);
	const [pMeralMint, setPMeralMint] = useState([]);
	const [pMeralBurn, setpMeralBurn] = useState([]);

	const { data: ethData } = useMoralisQuery(
		'EthNFTTransfers',
		(query) => query.equalTo('token_address', Addresses.Ethemerals.toLowerCase()).limit(20).equalTo('from_address', AddressZero).equalTo('confirmed', false).descending('block_number'),
		[],
		{
			live: true,
			onLiveEnter: (entity, all) => [...all, entity],
			onLiveCreate: (entity, all) => [...all, entity],
			onLiveDelete: (entity, all) => all.filter((e) => e.id !== entity.id),
			onLiveLeave: (entity, all) => all.filter((e) => e.id !== entity.id),
			onLiveUpdate: (entity, all) => all.map((e) => (e.id === entity.id ? entity : e)),
		}
	);

	const { data: polyData } = useMoralisQuery('PolyMeralTransfer', (query) => query.limit(20).notEqualTo('confirmed', true).descending('block_number'), [], {
		live: true,
		onLiveEnter: (entity, all) => [...all, entity],
		onLiveCreate: (entity, all) => [...all, entity],
		onLiveDelete: (entity, all) => all.filter((e) => e.id !== entity.id),
		onLiveLeave: (entity, all) => all.filter((e) => e.id !== entity.id),
		onLiveUpdate: (entity, all) => all.map((e) => (e.id === entity.id ? entity : e)),
	});

	useEffect(() => {
		if (ethData && ethData.length > 0) {
			let _minting = [];
			ethData.forEach((token) => {
				let tokenId = token.get('token_id');
				_minting.push({ type: 1, tokenId });
			});
			setMeralMint(_minting);
		} else {
			setMeralMint([]);
		}
		return () => {
			setMeralMint([]);
		};
	}, [ethData]);

	useEffect(() => {
		if (polyData && polyData.length > 0) {
			let _minting = [];
			let _burning = [];
			polyData.forEach((token) => {
				let from = token.get('from');
				let to = token.get('to');
				let id = token.get('tokenId');
				let type = getTypeFromId(id);
				let tokenId = getTokenIdFromId(id);
				let meral = { type, tokenId };
				if (from === AddressZero) {
					_minting.push(meral);
				}
				if (to === AddressZero) {
					_burning.push(meral);
				}
			});
			setpMeralBurn(_burning);
			setPMeralMint(_minting);
		} else {
			setpMeralBurn([]);
			setPMeralMint([]);
		}
		return () => {
			setpMeralBurn([]);
			setPMeralMint([]);
		};
	}, [polyData]);

	return (
		<div className="bg-gray-200 p-4 pb-20 mx-2 w-96">
			<h1>Bridge Status</h1>
			<p>Gateway Processing: {bridgeLogsActiveCount}</p>
			<div style={{ minHeight: '64px' }} className="flex-wrap flex justify-center">
				{bridgeLogsActive && bridgeLogsActive.length > 0 && bridgeLogsActive.map((log) => <ProcessingCards key={log.timestamp} log={log} />)}
			</div>

			{/* {meralMint && meralMint.length > 0 && */}

			{meralMint && meralMint.length > 0 && (
				<div className=" bg-yellow-100 p-2 my-2">
					<p>Meral Data Migration: {meralMint.length}</p>
					<div style={{ minHeight: '64px' }} className="flex-wrap flex justify-center">
						{meralMint && meralMint.length > 0 && meralMint.map((nft, index) => <HoldingCards key={index} nft={nft} />)}
					</div>
				</div>
			)}

			{pMeralMint && pMeralMint.length > 0 && (
				<div className=" bg-green-100 p-2 my-2">
					<p>pMerals In the process of being Born: {pMeralMint.length}</p>
					<div style={{ minHeight: '64px' }} className="flex-wrap flex justify-center">
						{pMeralMint && pMeralMint.length > 0 && pMeralMint.map((nft, index) => <HoldingCards key={index} nft={nft} />)}
					</div>
				</div>
			)}

			{pMeralBurn && pMeralBurn.length > 0 && (
				<div className=" bg-red-100 p-2 my-2">
					<p>pMerals marked for Burning: {pMeralBurn.length}</p>
					<div style={{ minHeight: '64px' }} className="flex-wrap flex justify-center">
						{pMeralBurn && pMeralBurn.length > 0 && pMeralBurn.map((nft, index) => <HoldingCards key={index} nft={nft} />)}
					</div>
				</div>
			)}

			{/* TODO - INFO ABOUT MERALS ON THE OTHER SIDE */}
			{/* <h4>Pending Transportation</h4>
			<MeralList nfts={escrowL1NFTs} />
			<h2>users:</h2>
			<MeralList nfts={userProxyNFTs} /> */}
		</div>
	);
};

export default PortalBridge;
