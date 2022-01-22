import { useUser, useUserAccount } from '../../hooks/useUser';

import EnterPortalButton from '../portal/buttons/EnterPortalButton';
import LeavePortalButton from '../portal/buttons/LeavePortalButton';
import PortalMain from '../portal/PortalMain';
import PortalBridge from '../portal/PortalBridge';
import PortalProxied from '../portal/PortalProxied';

const Portal = () => {
	return (
		<div className="bg_wilds h-screen w-full pt-20 fixed overflow-y-auto">
			<div className="pt-28 p-4 text-center">
				<EnterPortalButton />
				<LeavePortalButton />
			</div>
			<div className="flex justify-center">
				<PortalMain />
				<PortalBridge />
				<PortalProxied />
			</div>
		</div>
	);
};

export default Portal;
