import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useChain } from 'react-moralis';
import { useSendTx } from '../../../../context/TxContext';

import { useUser, useUserAccount } from '../../../../hooks/useUser';
import { useWildsContract } from '../../../../hooks/useWilds';
import { getIsLayer2, getOtherLayerChainName } from '../../../../utils/contracts/parseChainId';
import CloseButton from '../../../niceModals/buttons/CloseButton';
import LoginButton from '../../../niceModals/cards/LoginButton';

import MeralList from '../../../niceModals/cards/MeralList';
import SwitchNetworks from '../../../niceModals/cards/SwitchNetworks';
import { modalRegistry } from '../../../niceModals/RegisterModals';

export default NiceModal.create(({ landId, stakeAction }) => {
	const modal = useModal();

	const { chainId } = useChain();
	let isLayer2 = getIsLayer2(chainId);

	const sendTx = useSendTx();
	const { userPMerals: nfts } = useUserAccount();
	const { contractWilds } = useWildsContract();
	const { user, address } = useUser();

	const submitStake = async (id) => {
		if (contractWilds) {
			NiceModal.show(modalRegistry.waitingForSignature, { message: `Sending Meral to ${stakeAction.name} Wilds Land ${landId}` });
			try {
				const gasEstimate = await contractWilds.estimateGas.stake(parseInt(landId), parseInt(id), stakeAction.type);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractWilds.stake(parseInt(landId), parseInt(id), stakeAction.type, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'Enter Land', true, [`account_${address}`, `account_${contractWilds.address}`, `getWildsLand_${landId}`, `nft_${id}`]);
			} catch (error) {
				NiceModal.remove(modalRegistry.waitingForSignature);
				console.log(`${error.data} \n${error.message}`);
			}
		} else {
			console.log('error');
		}
	};

	const selectAndToggle = async (id) => {
		await submitStake(id);
		toggle();
	};

	const toggle = async () => {
		modal.remove();
	};

	return (
		<>
			<div onClick={toggle} className="fixed left-0 top-0 w-screen h-screen bg-black bg-opacity-30 z-40"></div>
			<div
				style={{ minWidth: '512px', minHeight: '256px', maxWidth: '60%', maxHeight: '60%' }}
				className="absolute center animate-fadeOnFast z-40 overflow-scroll rounded bg-white border border-gray-600 p-4 shadow-lg"
			>
				<CloseButton toggle={toggle} />
				<h2>Select Your Meral</h2>

				{!user && <LoginButton />}
				{!isLayer2 && <SwitchNetworks message={`Switch your Network to ${getOtherLayerChainName(chainId)}`} />}
				{isLayer2 && <MeralList nfts={nfts} select={selectAndToggle} />}
			</div>
		</>
	);
});
