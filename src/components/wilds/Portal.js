import { useUser, useUserAccount } from '../../hooks/useUser';

import EnterPortalButton from '../portal/buttons/EnterPortalButton';
import LeavePortalButton from '../portal/buttons/LeavePortalButton';
import PortalMain from '../portal/PortalMain';
import PortalBridge from '../portal/PortalBridge';
import PortalProxied from '../portal/PortalProxied';
import WorldMapButton from './buttons/WorldMapButton';
import HubButton from './buttons/HubButton';

const Portal = () => {
	return (
		<div className="bg_wilds_hub h-screen w-full fixed overflow-y-auto px-4">
			<div className="pt-28 p-4 text-center">
				<EnterPortalButton />
				<LeavePortalButton />
			</div>
			<div className="flex justify-center">
				<PortalMain />
				<PortalBridge />
				<PortalProxied />
			</div>
			<HubButton />
			<WorldMapButton />
		</div>
	);
};

export default Portal;
