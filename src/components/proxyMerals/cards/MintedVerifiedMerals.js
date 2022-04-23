import { useRegisterMerals } from '../../../hooks/useMeralManager';

import MeralList from './MeralList';

const MintedVerifiedMerals = () => {
	const { verifiedMerals } = useRegisterMerals();

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
				YOUR VIRTUALIZED MERALS
			</h2>
			<div style={styleBoxshadow} className="bg-white p-4 pb-8 rounded-md">
				<div className="flex items-center py-2 pb-8">
					<span className="text-sm text-gray-700">These Merals are now available to be used in The Wilds! For the Ethemerals Collection, matadata will be synced</span>
				</div>
				<div className="bg-gray-100 rounded-md py-4">{verifiedMerals && <MeralList nfts={verifiedMerals} select={selectAndToggle} />}</div>
			</div>
		</div>
	);
};

export default MintedVerifiedMerals;
