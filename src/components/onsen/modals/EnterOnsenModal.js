import NiceModal, { useModal } from '@ebay/nice-modal-react';
import Moralis from 'moralis';
import { useState, useEffect } from 'react';
import { useChain } from 'react-moralis';
import { useQuery } from 'react-query';
import { useSendTx } from '../../../context/TxContext';

import { useOnsenContract } from '../../../hooks/useOnsen';
import { useUser, useUserAccount } from '../../../hooks/useUser';
import { getIsLayer2, getOtherLayerChainName } from '../../../utils/contracts/parseChainId';
import CloseButton from '../../niceModals/buttons/CloseButton';
import LoginButton from '../../niceModals/cards/LoginButton';

import MeralList from '../../niceModals/cards/MeralList';
import SwitchNetworks from '../../niceModals/cards/SwitchNetworks';
import { modalRegistry } from '../../niceModals/RegisterModals';
import MeralOnsenList from '../cards/MeralListOnsen';

const getUserStakedOnsenMerals = async ({ address }) => {
	try {
		const result = await Moralis.Cloud.run('getUserStakedOnsenMerals', { address });
		// const result = await Moralis.Cloud.run('getUserAccount', { address });
		return result;
	} catch (error) {
		throw new Error('get account error');
	}
};

export default NiceModal.create(({ stake }) => {
	const modal = useModal();

	const { chainId } = useChain();
	let isLayer2 = getIsLayer2(chainId);

	const sendTx = useSendTx();
	const { userPMerals: nfts } = useUserAccount();
	const { contractOnsen } = useOnsenContract();
	const { user, address } = useUser();

	const [stakedMerals, setStakedMerals] = useState([]);

	const { data, isLoading } = useQuery(`getUserStakedOnsenMerals`, () => getUserStakedOnsenMerals(address), { enabled: !!address, refetchOnMount: true }); // TODO

	useEffect(() => {
		if (data && !isLoading) {
			setStakedMerals(data);
		}
		return () => {
			setStakedMerals(false);
		};
	}, [data, isLoading]);

	const handleStake = async (id) => {
		if (stake) {
			await submitStake(id);
		} else {
			await submitUnstake(id);
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

	const submitUnstake = async (id) => {
		if (contractOnsen) {
			NiceModal.show(modalRegistry.waitingForSignature, { message: 'Retreiving Meral From Onsen' });
			try {
				const gasEstimate = await contractOnsen.estimateGas.unstake(id);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractOnsen.unstake(id, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'Leave Onsen', true, [`account_${address}`, `account_${contractOnsen.address}`, `nft_${id}`]);
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
			<div onClick={toggle} className="fixed left-0 top-0 w-screen h-screen bg-black bg-opacity-30 z-40"></div>
			<div
				style={{ minWidth: '512px', minHeight: '256px', maxWidth: '60%', maxHeight: '60%' }}
				className="absolute center animate-fadeOnFast z-40 overflow-scroll rounded bg-white border border-gray-600 p-4 shadow-lg"
			>
				<CloseButton toggle={toggle} />
				<h2>Select Your Meral</h2>
				{!user && <LoginButton />}
				{!isLayer2 && <SwitchNetworks message={`Switch your Network to ${getOtherLayerChainName(chainId)}`} />}
				{isLayer2 && stake && <MeralList nfts={nfts} select={selectAndToggle} />}
				{isLayer2 && !stake && <MeralOnsenList nfts={stakedMerals} select={selectAndToggle} />}
			</div>
		</>
	);
});
