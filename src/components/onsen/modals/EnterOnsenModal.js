import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useChain } from 'react-moralis';
import { useSendTx } from '../../../context/TxContext';

import { useOnsenAccount, useOnsenContract } from '../../../hooks/useOnsen';
import { useUser, useUserAccount } from '../../../hooks/useUser';
import { getIsLayer2 } from '../../../utils/contracts/parseChainId';
import CloseButton from '../../niceModals/buttons/CloseButton';
import LoginButton from '../../niceModals/cards/LoginButton';

import MeralList from '../../niceModals/cards/MeralList';
import SwitchNetworks from '../../niceModals/cards/SwitchNetworks';
import { modalRegistry } from '../../niceModals/RegisterModals';

export default NiceModal.create(({ stake }) => {
	const modal = useModal();

	const { chainId } = useChain();
	let isLayer2 = getIsLayer2(chainId);

	const sendTx = useSendTx();
	const { userPMerals: nfts } = useUserAccount();
	const { contractOnsen } = useOnsenContract();

	const { user, address } = useUser();

	const handleStake = async (id) => {
		if (stake) {
			console.log('enter', id);
			await submitStake(id);
		} else {
			console.log('leave', id);
		}
	};

	const submitStake = async (id) => {
		if (contractOnsen) {
			NiceModal.show(modalRegistry.waitingForSignature, { message: 'Sending Meral Into Onsen' });
			try {
				const gasEstimate = await contractOnsen.estimateGas.stake(id);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractOnsen.stake(id, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'Enter Onsen', true, [`account_${address}`, `account_${contractOnsen.address}`, `nft_${id}`]);
			} catch (error) {
				NiceModal.remove(modalRegistry.waitingForSignature);
				console.log(`${error.data} \n${error.message}`);
			}
		} else {
			console.log('error');
		}
	};

	const selectAndToggle = async (id) => {
		await handleStake(id);
		toggle();
	};

	const toggle = async () => {
		modal.remove();
	};

	return (
		<>
			<div onClick={toggle} className="fixed left-0 top-0 w-screen h-screen bg-black bg-opacity-30"></div>
			<div
				style={{ minWidth: '512px', minHeight: '256px', maxWidth: '60%', maxHeight: '60%' }}
				className="absolute center animate-fadeOnFast z-40 overflow-scroll rounded bg-white border border-gray-600 p-4 shadow-lg"
			>
				<CloseButton toggle={toggle} />
				<h2>Select Your Meral</h2>
				{!user && <LoginButton />}
				{!isLayer2 && <SwitchNetworks message={'Switch your Network to Polygon'} />}
				{isLayer2 && <MeralList nfts={nfts} select={selectAndToggle} />}
			</div>
		</>
	);
});
