import { useState, useEffect } from 'react';

import { useUserAccount } from '../../../hooks/useUser';

import { useNFTUtils } from '../../../hooks/useNFTUtils';

import { useWildsNFTStats } from '../../../hooks/useWilds';

import { useMeralImagePaths } from '../../../hooks/useMeralData';
import { GET_NFT_WILDS } from '../../../queries/SubgraphWilds';
import { useGQLQueryL1 } from '../../../hooks/useGQLQuery';
import WildsUnstake from '../actions/WildsUnstake';
import WildsRevive from '../actions/WildsRevive';

const StakedWildsCard = ({ landId, tokenId, contractWilds, stakeAction, raidStatus }) => {
	const { elements } = useNFTUtils();

	const { meralImagePaths } = useMeralImagePaths(tokenId);

	const { account } = useUserAccount();
	const { damage, stamina, lcp } = useWildsNFTStats(contractWilds, landId, tokenId);

	const [isOwned, setIsOwned] = useState(false);
	const [nft, setNft] = useState(undefined);
	const [nftLiveStats, setNftLiveStats] = useState(undefined);

	const { data, status } = useGQLQueryL1(`nft_${tokenId}`, GET_NFT_WILDS, { id: tokenId }, { refetchOnMount: true });

	const canLeave = (stakeAction === 1 || stakeAction === 4) && raidStatus !== '2';

	useEffect(() => {
		if (status === 'success' && data && data.ethemeral) {
			setNft(data.ethemeral);
		}
	}, [status, data, nft]);

	useEffect(() => {
		if (account && nft) {
			if (nft.previousOwner.id === account.id) {
				setIsOwned(true);
			}
		}
	}, [account, nft]);

	useEffect(() => {
		if (nft) {
			let _nftLiveStats = {
				score: damage ? nft.score - damage : nft.score,
				stamina: stamina ? stamina : '?',
				lcp: lcp ? lcp : '?',
			};
			setNftLiveStats(_nftLiveStats);
		}
	}, [damage, stamina, lcp, nft]);

	if (!meralImagePaths || !nft) {
		return (
			<div style={{ width: '280px' }} className="flex h-74 mb-1 mx-1 bg-blue-100 justify-center pt-6">
				<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			</div>
		);
	}

	const bgImg = meralImagePaths.thumbnail;

	return (
		<>
			<div style={{ backgroundColor: elements[nft.bgId].color, width: '280px' }} className="flex h-74 mb-1 mx-1 cursor-pointer hover:shadow-xl  opacity-90 hover:opacity-100 transition duration-300">
				<div className="relative">
					<img width="74" height="74" src={bgImg} alt="" />
					<span className="text-xs font-bold text-white z-10 bg-black bg-opacity-50 w-full absolute bottom-0 text-left">#{nft.id.padStart(4, '0')}</span>
				</div>

				<div style={{ width: '214px' }} className="bg-white">
					<h4 style={{ backgroundColor: elements[nft.bgId].color }} className="font-bold text-md uppercase pl-1 overflow-hidden whitespace-nowrap">
						{nft.metadata.coin}
					</h4>
					<div className="text-black w-full px-1 text-xs flex items-end font-bold">
						{nft && (
							<div>
								<p>
									<span className="text-gray-500 font-light">HP:</span> <span>{nftLiveStats && nftLiveStats.score}</span>
								</p>
								<p>
									<span className="text-gray-500 font-light">STAMINA:</span> <span>{nftLiveStats && nftLiveStats.stamina}</span>
								</p>
								<p>
									<span className="text-gray-500 font-light">LCP:</span> <span>{nftLiveStats && nftLiveStats.lcp}</span>
								</p>
							</div>
						)}

						<div className="flex-grow"></div>
						<div className="flex">
							{isOwned && <WildsUnstake contractWilds={contractWilds} landId={landId} tokenId={tokenId} canLeave={canLeave} />}
							{nftLiveStats && nftLiveStats.score < 25 && <WildsRevive contractWilds={contractWilds} landId={landId} tokenId={tokenId} canKiss={nftLiveStats.score < 25} />}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default StakedWildsCard;
