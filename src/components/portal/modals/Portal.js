import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useEffect } from 'react';
import { useChain } from 'react-moralis';
import { useOnsenAccount } from '../../../hooks/useOnsen';
import { useUser } from '../../../hooks/useUser';
import { getIsLayer2 } from '../../../utils/contracts/parseChainId';
import CloseButton from '../../niceModals/buttons/CloseButton';
import LoginButton from '../../niceModals/cards/LoginButton';

import MeralList from '../../niceModals/cards/MeralList';
import SwitchNetworks from '../../niceModals/cards/SwitchNetworks';
import EnterPortalButton from '../buttons/EnterPortalButton';
import LeavePortalButton from '../buttons/LeavePortalButton';
import PortalBridge from '../cards/PortalBridge';
import PortalMain from '../cards/PortalMain';
import PortalProxied from '../cards/PortalProxied';
// import EnterOnsenButton from '../buttons/EnterOnsenButton';
// import LeaveOnsenButton from '../buttons/LeaveOnsenButton';

export default NiceModal.create(() => {
	const modal = useModal();

	const { chainId } = useChain();
	let isLayer2 = getIsLayer2(chainId);

	const { onsenNFTs } = useOnsenAccount();
	const { user } = useUser();

	const toggle = async () => {
		modal.remove();
	};

	const selectAndToggle = async (id) => {
		console.log('hi', id);
		// TODO
	};

	return (
		<>
			<div onClick={toggle} className="fixed left-0 top-0 w-screen h-screen bg-black bg-opacity-30 z-30"></div>
			<div
				style={{ minWidth: '512px', minHeight: '512px', maxWidth: '1024px', maxheight: '80%' }}
				className=" w-4/5 h-5/6 absolute center animate-fadeOnFast z-40 rounded bg-white border border-gray-600 shadow-lg overflow-y-auto"
			>
				{/* HEADER */}
				<CloseButton toggle={toggle} />
				<div
					style={{
						backgroundRepeat: 'no-repeat',
						backgroundImage: "url('https://ethemerals-media.s3.amazonaws.com/wilds/portal.jpg')",
					}}
					className="w-full h-24 md:h-44 bg-cover bg-center"
				></div>
				{/* CONTENT */}
				<div className="p-4">
					<h2>Enter The Portal</h2>
					<div className="py-4">
						<p>Short description about sending Merals into the Eth to Poly portal</p>
						{!user && <LoginButton />}
						{isLayer2 && <SwitchNetworks message={'Switch your Network to Ethereum'} />}

						<div className="flex justify-center">
							<EnterPortalButton />
							<LeavePortalButton />
						</div>

						<div className="flex justify-center items-stretch mt-4">
							<PortalMain />
							<PortalBridge />
							<PortalProxied />
						</div>
					</div>
				</div>
			</div>
		</>
	);
});
