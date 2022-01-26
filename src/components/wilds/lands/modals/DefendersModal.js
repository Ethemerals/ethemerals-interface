import NiceModal, { useModal } from '@ebay/nice-modal-react';

import { useChain } from 'react-moralis';
import { useUser } from '../../../../hooks/useUser';
import { RaidStatus, StakeAction, useWildsLand } from '../../../../hooks/useWilds';
import { getIsLayer2, getOtherLayerChainName } from '../../../../utils/contracts/parseChainId';
import CloseButton from '../../../niceModals/buttons/CloseButton';
import LoginButton from '../../../niceModals/cards/LoginButton';
import SwitchNetworks from '../../../niceModals/cards/SwitchNetworks';
import { modalRegistry } from '../../../niceModals/RegisterModals';
import SlotDetailsButton from '../buttons/SlotDetailsButton';
import SlotsFullButton from '../buttons/SlotsFullButton';

import StakeButton from '../buttons/StakeButton';
import MeralListWildsLarge from '../cards/MeralListWildsLarge';

export default NiceModal.create(({ landId }) => {
	const modal = useModal();

	const { chainId } = useChain();
	let isLayer2 = getIsLayer2(chainId);

	const { defenders: nfts, wildsLand, attackers } = useWildsLand(landId);
	const { user } = useUser();

	const toggle = async () => {
		modal.remove();
	};

	const selectAndToggle = async (id) => {
		console.log('hi', id);
		// TODO
	};

	const buttonActions = async (id, type) => {
		console.log('buttonActions', id, type);

		NiceModal.show(modalRegistry.landUnstake, { landId, stakeAction: StakeAction.DEFEND.type, id });
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
						backgroundImage: "url('https://ethemerals-media.s3.amazonaws.com/wilds/defenders.jpg')",
					}}
					className="w-full h-52 bg-cover bg-center"
				></div>
				{/* CONTENT */}
				<div className="p-4">
					<h2>Defenders / Attackers / Raiding Modal</h2>
					<div className="py-4">
						<p>Short description about merals extracting excess ELF - purifying the land, making it safe etc etc</p>
						<p>If in 'Raid' This modal will be different</p>
						{!user && <LoginButton />}
						{!isLayer2 && <SwitchNetworks message={`Switch your Network to ${getOtherLayerChainName(chainId)}`} />}

						<div className="flex justify-center">{nfts && nfts.length < 5 ? <StakeButton landId={landId} stakeAction={StakeAction.DEFEND} /> : <SlotsFullButton />}</div>

						<h2>Defenders:</h2>
						<MeralListWildsLarge nfts={nfts} select={selectAndToggle} buttonActions={buttonActions} />
					</div>
					<div>
						{wildsLand && wildsLand.raidStatus === RaidStatus.RAIDING && (
							<>
								<div className="text-center">
									<SlotDetailsButton landId={landId} stakeAction={StakeAction.ATTACK.type} />
								</div>
								<h2>Attackers:</h2>
								<MeralListWildsLarge nfts={attackers} select={selectAndToggle} buttonActions={buttonActions} />
							</>
						)}
					</div>
					<div>{wildsLand && wildsLand.raidStatus === RaidStatus.DEFAULT && <div className="w-96 h-10 bg-yellow-50 text-center text-2xl">Not Raidable</div>}</div>
					<div>
						{wildsLand && wildsLand.raidStatus === RaidStatus.RAIDABLE && (
							<div className="text-center">
								<div className="w-96 h-10 bg-yellow-50 text-center text-2xl">Raidable</div>
								<SlotDetailsButton landId={landId} stakeAction={StakeAction.ATTACK.type} />
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
});
