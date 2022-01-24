import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useChain } from 'react-moralis';
import { useOnsenAccount } from '../../../hooks/useOnsen';
import { useUser } from '../../../hooks/useUser';
import { getIsLayer2, getOtherLayerChainName } from '../../../utils/contracts/parseChainId';
import CloseButton from '../../niceModals/buttons/CloseButton';
import LoginButton from '../../niceModals/cards/LoginButton';

import SwitchNetworks from '../../niceModals/cards/SwitchNetworks';
import EnterOnsenButton from '../buttons/EnterOnsenButton';
import LeaveOnsenButton from '../buttons/LeaveOnsenButton';
import MeralListOnsen from '../cards/MeralListOnsen';

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
						backgroundImage: "url('https://static.displate.com/857x1200/displate/2021-02-18/e81f4ff8dedec2a9f86fd0a2fe183c14_83b935a5ee01e62c6e0842d895c3bc26.jpg')",
					}}
					className="w-full h-72 md:h-96 bg-yellow-200 bg-cover bg-center"
				></div>
				{/* CONTENT */}
				<div className="p-4">
					<h2>Relax in the Onsen</h2>
					<div className="py-4">
						<p>Short description about xp hp and elf</p>
						{!user && <LoginButton />}
						{!isLayer2 && <SwitchNetworks message={`Switch your Network to ${getOtherLayerChainName(chainId)}`} />}

						<div className="flex justify-center">
							<EnterOnsenButton />
							<LeaveOnsenButton />
						</div>
						<h2>Merals currently in the Onsen:</h2>
						<MeralListOnsen nfts={onsenNFTs} select={selectAndToggle} />
					</div>
				</div>
			</div>
		</>
	);
});
