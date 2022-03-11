import NiceModal from '@ebay/nice-modal-react';
import { useForm } from 'react-hook-form';
import { useSendTx } from '../../../context/TxContext';
import { modalRegistry } from '../../niceModals/RegisterModals';

const WildsRaidActions = ({ contractWilds, landId, tokenId }) => {
	const { register, handleSubmit } = useForm();

	const sendTx = useSendTx();

	// TODO ENUMS
	const onSubmitRaidAction_ATK = async (data) => {
		await handleRaidAction(data.toTokenId, data.fromTokenId, 0);
	};
	const onSubmitRaidAction_ATK_ALL = async (data) => {
		await handleRaidAction(data.toTokenId, data.fromTokenId, 1);
	};
	const onSubmitRaidAction_MAGIC_ATK = async (data) => {
		await handleRaidAction(data.toTokenId, data.fromTokenId, 2);
	};
	const onSubmitRaidAction_SPD_ATK = async (data) => {
		await handleRaidAction(data.toTokenId, data.fromTokenId, 3);
	};
	const onSubmitRaidAction_ENRAGE = async (data) => {
		await handleRaidAction(data.toTokenId, data.fromTokenId, 4);
	};
	const onSubmitRaidAction_HEAL = async (data) => {
		await handleRaidAction(data.toTokenId, data.fromTokenId, 5);
	};
	const onSubmitRaidAction_HEAL_ALL = async (data) => {
		await handleRaidAction(data.toTokenId, data.fromTokenId, 6);
	};
	const onSubmitRaidAction_CONCENTRATE = async (data) => {
		await handleRaidAction(data.toTokenId, data.fromTokenId, 7);
	};

	const handleRaidAction = async (to, from, actionType) => {
		if (contractWilds) {
			NiceModal.show(modalRegistry.waitingForSignature, { message: `Leave ${tokenId} from Battle!` });
			try {
				const gasEstimate = await contractWilds.estimateGas.raidAction(to, from, actionType);
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractWilds.raidAction(to, from, actionType, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'raid action', true, [`calculateStamina_${from}`, `calculateDamage_${to}`, `calculateDamage_${from}`, 'account', 'user', `land_${landId}`, 'lands']);
			} catch (error) {
				NiceModal.remove(modalRegistry.waitingForSignature);
				console.log(`${error.data} \n${error.message}`);
			}
		} else {
			console.log('no wallet');
		}
	};

	return (
		<>
			<div className="flex items-center py-2">
				<div>
					to:
					<input className="w-16 h-8 p-2 bg-green-100 shadow-inner border border-gray-300 text-black" {...register('toTokenId')} />
				</div>
				<div>
					from:
					<input className="w-16 h-8 p-2 bg-green-100 shadow-inner border border-gray-300 text-black" {...register('fromTokenId')} />
				</div>
			</div>
			<div className="text-sm">
				<button onClick={handleSubmit(onSubmitRaidAction_ATK)} className=" bg-gray-600 px-2 shadow text-white py-1 hover:bg-green-600 hover:shadow-lg transition duration-300">
					Attack Single
				</button>
				<button onClick={handleSubmit(onSubmitRaidAction_ATK_ALL)} className=" bg-gray-600 px-2 shadow text-white py-1 hover:bg-green-600 hover:shadow-lg transition duration-300">
					Attack All
				</button>
				<button onClick={handleSubmit(onSubmitRaidAction_MAGIC_ATK)} className=" bg-gray-600 px-2 shadow text-white py-1 hover:bg-green-600 hover:shadow-lg transition duration-300">
					Magic Atk
				</button>
				<button onClick={handleSubmit(onSubmitRaidAction_SPD_ATK)} className=" bg-gray-600 px-2 shadow text-white py-1 hover:bg-green-600 hover:shadow-lg transition duration-300">
					Speed Atk
				</button>
				<button onClick={handleSubmit(onSubmitRaidAction_ENRAGE)} className=" bg-gray-600 px-2 shadow text-white py-1 hover:bg-green-600 hover:shadow-lg transition duration-300">
					Enrage
				</button>
				<button onClick={handleSubmit(onSubmitRaidAction_HEAL)} className=" bg-gray-600 px-2 shadow text-white py-1 hover:bg-green-600 hover:shadow-lg transition duration-300">
					Heal
				</button>
				<button onClick={handleSubmit(onSubmitRaidAction_HEAL_ALL)} className=" bg-gray-600 px-2 shadow text-white py-1 hover:bg-green-600 hover:shadow-lg transition duration-300">
					Heal All
				</button>
				<button onClick={handleSubmit(onSubmitRaidAction_CONCENTRATE)} className=" bg-gray-600 px-2 shadow text-white py-1 hover:bg-green-600 hover:shadow-lg transition duration-300">
					Concentrate
				</button>
			</div>
		</>
	);
};

export default WildsRaidActions;
