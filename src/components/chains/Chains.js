import { useEffect, useState } from 'react';
import { PolygonLogo, ETHLogo } from './Logos';
import { useChain, useMoralis } from 'react-moralis';

const networks = [
	{
		key: '0x1',
		value: 'Ethereum',
		icon: <ETHLogo />,
	},
	{
		key: '0x4',
		value: 'Rinkeby Testnet',
		icon: <ETHLogo />,
	},
	{
		key: '0x89',
		value: 'Polygon',
		icon: <PolygonLogo />,
	},
	{
		key: '0x13881',
		value: 'Mumbai',
		icon: <PolygonLogo />,
	},
];

function Chains() {
	const { switchNetwork, chainId, chain } = useChain();
	const { isAuthenticated } = useMoralis();
	const [selected, setSelected] = useState({});

	useEffect(() => {
		if (!chainId) return null;
		const newSelected = networks.find((item) => item.key === chainId);
		setSelected(newSelected);
	}, [chainId]);

	const handleMenuClick = (network) => {
		console.log('switch to: ', networks[network].value);
		switchNetwork(networks[network].key);
	};

	if (!chainId || !isAuthenticated) return null;

	return (
		<div className="flex space-x-3">
			<button onClick={() => handleMenuClick(0)}>ETH Mainnet</button>
			<button onClick={() => handleMenuClick(1)}>Rinkeby</button>
			<button onClick={() => handleMenuClick(2)}>Polygon</button>
			<button onClick={() => handleMenuClick(3)}>Mumbai</button>
		</div>
	);
}

export default Chains;
