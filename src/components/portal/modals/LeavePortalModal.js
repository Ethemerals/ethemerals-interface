import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useEffect, useState } from 'react';
import { useChain } from 'react-moralis';
import { useSendTx } from '../../../context/TxContext';

import { useEscrowL1Contract } from '../../../hooks/useEscrowL1';
import { getTokenIdFromId, getTypeFromId } from '../../../hooks/useMeralUtils';
import { useUser, useUserAccount } from '../../../hooks/useUser';
import { getIsLayer2 } from '../../../utils/contracts/parseChainId';
import CloseButton from '../../niceModals/buttons/CloseButton';
import LoginButton from '../../niceModals/cards/LoginButton';

import MeralList from '../../niceModals/cards/MeralList';
import SwitchNetworks from '../../niceModals/cards/SwitchNetworks';
import { modalRegistry } from '../../niceModals/RegisterModals';

export default NiceModal.create(() => {
	const modal = useModal();

	const { chainId } = useChain();
	let isLayer2 = getIsLayer2(chainId);

	const sendTx = useSendTx();
	const { userPMerals: nfts } = useUserAccount();

	const { contractEscrowL1 } = useEscrowL1Contract();
	const { user, address } = useUser();

	const handleWithdraw = async (id) => {
		if (contractEscrowL1) {
			toggle();
			await submitWithdraw(id);
		}
	};

	const submitWithdraw = async (id) => {
		if (contractEscrowL1 && nfts) {
			NiceModal.show(modalRegistry.waitingForSignature, { message: 'Withdrawing Meral From Portal' });
			try {
				let tokenId = getTokenIdFromId(id);
				let type = getTypeFromId(id);
				const gasEstimate = await contractEscrowL1.estimateGas.withdraw(type, tokenId);

				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractEscrowL1.withdraw(type, tokenId, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'Leave Portal', true, [`account_${address}`, `account_${contractEscrowL1.address}`, `nft_${id}`]);
			} catch (error) {
				NiceModal.remove(modalRegistry.waitingForSignature);
				console.log(`${error.data} \n${error.message}`);
			}
		} else {
			console.log('error');
		}
	};

	const selectAndToggle = async (id) => {
		await handleWithdraw(id);
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
				{isLayer2 && <SwitchNetworks message={'Switch your Network to Ethereum'} />}
				{!isLayer2 && <MeralList nfts={nfts} select={selectAndToggle} />}
			</div>
		</>
	);
});
