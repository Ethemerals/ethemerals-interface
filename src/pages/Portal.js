import { useState, useEffect } from 'react';

import { useEscrowL1Account } from '../hooks/useEscrowL1';

import { useUser, useUserAccount } from '../hooks/useUser';
import PortalCard from '../components/portal/PortalCard';
import EnterPortalButton from '../components/portal/buttons/EnterPortalButton';
import BridgeStatus from '../components/portal/BridgeStatus';
import PortalActive from '../components/portal/PortalActive';
import LeavePortalButton from '../components/portal/buttons/LeavePortalButton';

const Portal = () => {
	const { mainIndex, userNFTs } = useUserAccount();

	return (
		<div>
			<div style={{ maxWidth: '500px' }} className="my-8 w-11/12 sm:my-10 sm:w-full mx-auto bg-white p-6 pt-20 pb-10 rounded-lg bg-opacity-80">
				<EnterPortalButton />
				<LeavePortalButton />
			</div>
			<div className="flex">
				<PortalCard />
				<BridgeStatus />
				<PortalActive />
			</div>
		</div>
	);
};

export default Portal;
