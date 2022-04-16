import { useRegisterMerals } from '../../../hooks/useMeralManager';

import MeralList from './MeralList';

const PendingValidation = () => {
	const { pendingMerals } = useRegisterMerals();

	const selectAndToggle = async (id) => {
		console.log('hi', id);
		// TODO
	};

	const styleBoxshadow = {
		boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.4)',
	};

	return (
		<div className="text-black w-full">
			<h2 style={{ textShadow: '1px 1px 0px slateblue' }} className="mt-8 pb-0 text-base font-bold text-white p-4">
				PENDING VALIDATION
			</h2>
			<div style={styleBoxshadow} className="bg-white p-4 pb-8 rounded-md">
				<div className="flex items-center py-2 pb-8">
					<span className=" text-xs ">After Registering, validators will validate ownership and base Meral stats. If successful the Virtual Meral will be minted and sent to your wallet</span>
				</div>
				<div className="bg-gray-100 rounded-md py-4">{pendingMerals && <MeralList nfts={pendingMerals} select={selectAndToggle} />}</div>
			</div>
		</div>
	);
};

export default PendingValidation;
