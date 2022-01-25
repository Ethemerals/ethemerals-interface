import Moralis from 'moralis';

import { useQuery } from 'react-query';
import MeralList from '../../niceModals/cards/MeralList';

const getBridgeProxyMerals = async () => {
	try {
		const result = await Moralis.Cloud.run('bridgeProxyMerals');
		return result;
	} catch (error) {
		throw new Error('get account error');
	}
};

const PortalProxied = () => {
	const { data } = useQuery('bridgeProxyMerals', () => getBridgeProxyMerals(), { refetchOnMount: true, refetchInterval: 10000 }); // TODO

	const selectAndToggle = async (id) => {
		console.log('hi', id);
		// TODO
	};

	return (
		<div className="bg-gray-200 p-4 pb-20 mx-2 w-96">
			<h1>Polygon</h1>
			<h4>Latest pMerals:</h4>

			<MeralList nfts={data} select={selectAndToggle} />
		</div>
	);
};

export default PortalProxied;
