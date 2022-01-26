import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useEffect, useState } from 'react';
import { useChain } from 'react-moralis';
import { useSendTx } from '../../../../context/TxContext';

import { useUser, useUserAccount } from '../../../../hooks/useUser';
import { StakeAction, useWildsContract, useWildsLand } from '../../../../hooks/useWilds';
import { getIsLayer2, getOtherLayerChainName } from '../../../../utils/contracts/parseChainId';
import CloseButton from '../../../niceModals/buttons/CloseButton';

import MeralList from '../../../niceModals/cards/MeralList';
import SwitchNetworks from '../../../niceModals/cards/SwitchNetworks';
import { modalRegistry } from '../../../niceModals/RegisterModals';

const MeralIconLarge = ({ nft }) => {
	return (
		<div className="w-44 h-72 bg-yellow-50 m-2 border border-black text-xs hover:bg-yellow-100 cursor-pointer relative">
			<p>
				type:{nft.type} / {nft.tokenId}
			</p>

			<p>HP {nft.hp}</p>
			<p>XP {nft.xp}</p>
			<p>ELF {nft.elf}</p>
			<p>atk {nft.atk}</p>
			<p>def {nft.def}</p>
			<p>spd {nft.spd}</p>
			<p>{nft.name}</p>
		</div>
	);
};

export default NiceModal.create(({ landId, stakeAction, id }) => {
	const modal = useModal();

	const { chainId } = useChain();
	let isLayer2 = getIsLayer2(chainId);

	const sendTx = useSendTx();
	const { wildsLand } = useWildsLand(landId);
	const { contractWilds } = useWildsContract();
	const { address } = useUser();

	const [meral, setMeral] = useState(undefined);

	useEffect(() => {
		if (wildsLand) {
			let nfts = [];
			if (stakeAction === StakeAction.DEFEND.type) {
				nfts = wildsLand.defenders;
			}
			if (stakeAction === StakeAction.LOOT.type) {
				nfts = wildsLand.looters;
			}
			if (stakeAction === StakeAction.BIRTH.type) {
				nfts = wildsLand.birthers;
			}
			if (stakeAction === StakeAction.ATTACK.type) {
				nfts = wildsLand.attackers;
			}
			setMeral(nfts.find((a) => a.meralId == id));
		}
	}, [wildsLand, stakeAction, id]);

	const submitUnstake = async (id) => {
		if (contractWilds) {
			NiceModal.show(modalRegistry.waitingForSignature, { message: `Retrieving Meral from Wilds Land ${landId}` });
			try {
				const gasEstimate = await contractWilds.estimateGas.unstake(parseInt(id));
				console.log('hi');
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractWilds.unstake(parseInt(id), { gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'Leave Land', true, [`account_${address}`, `account_${contractWilds.address}`, `getWildsLand_${landId}`, `nft_${id}`]);
			} catch (error) {
				NiceModal.remove(modalRegistry.waitingForSignature);
				console.log(`${error.data} \n${error.message}`);
			}
		} else {
			console.log('error');
		}
	};

	const onSubmit = async () => {
		await submitUnstake(id);
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
				<h2 className="text-center">Retrieve Meral from Land</h2>
				<div className="text-center">
					<button onClick={onSubmit} className="p-4 bg-blue-200 hover:bg-blue-100 rounded-md">
						Confirm
					</button>
				</div>
				{!isLayer2 && <SwitchNetworks message={`Switch your Network to ${getOtherLayerChainName(chainId)}`} />}
				<div className="flex justify-center">{meral && <MeralIconLarge nft={meral} />}</div>
			</div>
		</>
	);
});
