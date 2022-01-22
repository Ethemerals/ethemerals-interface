import { useEffect, useState } from 'react';
import { useEscrowL1Account } from '../../hooks/useEscrowL1';

import { getTypeFromId } from '../../hooks/useMeralUtils';
import { useUserAccount } from '../../hooks/useUser';

import MeralListStatic from '../niceModals/cards/MeralListStatic';
const PortalMain = () => {
	const { escrowL1NFTs, escrowL1Account } = useEscrowL1Account();
	const { userPMerals } = useUserAccount();

	return (
		<div className="bg-gray-200 p-4 pb-20 m-4 w-96">
			<h1>Portal</h1>
			{/* TODO - INFO ABOUT MERALS ON THE OTHER SIDE */}
			<h4>Recently Entered:</h4>
			<MeralListStatic nfts={escrowL1NFTs} />
		</div>
	);
};

export default PortalMain;
