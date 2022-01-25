import NiceModal, { useModal } from '@ebay/nice-modal-react';

import { useChain } from 'react-moralis';
import { useUser } from '../../../../hooks/useUser';
import { StakeAction, useWildsLand } from '../../../../hooks/useWilds';
import { getIsLayer2, getOtherLayerChainName } from '../../../../utils/contracts/parseChainId';
import CloseButton from '../../../niceModals/buttons/CloseButton';
import LoginButton from '../../../niceModals/cards/LoginButton';
import SwitchNetworks from '../../../niceModals/cards/SwitchNetworks';
import StakeButton from '../buttons/StakeButton';
import MeralListWildsLarge from '../cards/MeralListWildsLarge';

export default NiceModal.create(({ landId }) => {
	const modal = useModal();

	const { chainId } = useChain();
	let isLayer2 = getIsLayer2(chainId);

	const { defenders: nfts } = useWildsLand(landId);
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
				style={{ minWidth: '512px', minHeight: '512px', maxWidth: '1200px', maxheight: '80%' }}
				className=" w-4/5 h-5/6 absolute center animate-fadeOnFast z-40 rounded bg-white border border-gray-600 shadow-lg overflow-y-auto"
			>
				{/* HEADER */}
				<CloseButton toggle={toggle} />

				{/* CONTENT */}
				<div className="w-3/4">
					<div className="p-4">
						<h2>Looters Modal</h2>
						<div className="py-4">
							<p>Short description about merals going and collecting loot etc</p>

							{!user && <LoginButton />}
							{!isLayer2 && <SwitchNetworks message={`Switch your Network to ${getOtherLayerChainName(chainId)}`} />}
						</div>
						<div>
							<div className="flex justify-center">
								<StakeButton landId={landId} stakeAction={StakeAction.LOOT} />
							</div>
							<h2>Looters:</h2>
							<MeralListWildsLarge nfts={nfts} select={selectAndToggle} />
						</div>
					</div>
				</div>

				{/* SIDEBAR */}
				<div
					style={{
						backgroundRepeat: 'no-repeat',
						backgroundImage: "url('https://ethemerals-media.s3.amazonaws.com/wilds/loot.jpg')",
					}}
					className="w-1/4 h-full flex-none absolute right-0 top-0 bg-cover bg-center"
				></div>
			</div>
		</>
	);
});
