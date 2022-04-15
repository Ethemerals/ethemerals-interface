import { useRegisterMerals } from '../../../hooks/useMeralManager';

import MeralList from './MeralList';

const MintedProxyMerals = () => {
	const { proxiedMerals } = useRegisterMerals();

	const selectAndToggle = async (id) => {
		console.log('hi', id);
		// TODO
	};

	const styleBoxshadow = {
		boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.4)',
	};

	return (
		<div className="text-black w-full">
			<h2 className="mt-8 pb-2 text-xl text-white p-4">MINTED PROXY MERALS</h2>
			<div style={styleBoxshadow} className="bg-white p-4 pb-8 rounded-md">
				<div className="flex items-center py-2 pb-8">
					<span className=" text-xs ">Validated and minted Polygon Proxy Merals. These Merals are now available to be used in The Wilds!</span>
				</div>
				<div className="bg-gray-100 rounded-md py-4">{proxiedMerals && <MeralList nfts={proxiedMerals} select={selectAndToggle} />}</div>
			</div>
		</div>
	);
};

export default MintedProxyMerals;
