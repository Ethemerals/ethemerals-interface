import Moralis from 'moralis';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { getTypeFromId } from '../../hooks/useMeralUtils';

const MeralCards = ({ nft }) => {
	// "Meral_Mint_Sub"

	return (
		<div className="w-16 h-16 bg-yellow-50 m-2 border border-black text-xs">
			<p>Type:{nft.type}</p>
			<p>token:{nft.tokenId}</p>
		</div>
	);
};

const getBridgeProxyMerals = async () => {
	try {
		const result = await Moralis.Cloud.run('bridgeProxyMerals');
		return result;
	} catch (error) {
		throw new Error('get account error');
	}
};

const PortalProxied = () => {
	// const proxyNfts = undefined;
	const { data, isLoading } = useQuery('bridgeProxyMerals', () => getBridgeProxyMerals(), { refetchOnMount: true, refetchInterval: 10000 }); // TODO

	const [nfts, setNfts] = useState([]);
	useEffect(() => {
		if (data) {
			setNfts(data);
		} else {
			setNfts([]);
		}
	}, [data]);

	return (
		<div className="bg-gray-200 p-4 pb-20 m-4 w-96">
			<h1>Polygon Layer</h1>
			{/* TODO - INFO ABOUT MERALS ON THE OTHER SIDE */}
			<h4>Latest pMerals:</h4>
			<div className="flex-wrap flex justify-center overflow-hidden">{nfts && nfts.length > 0 && nfts.map((nft) => <MeralCards key={nft.tokenId} nft={nft} />)}</div>
		</div>
	);
};

export default PortalProxied;
