import { useEffect, useState } from 'react';
import { useChain } from 'react-moralis';
import { ETHLogo, PolygonLogo } from '../chains/Logos';
import Networks from '../modals/Networks';

const networks = [
	{
		key: '0x1',
		value: 'Ethereum',
		icon: <ETHLogo />,
	},
	{
		key: '0x89',
		value: 'Polygon',
		icon: <PolygonLogo />,
	},
	{
		key: '0x4',
		value: 'Rinkeby',
		icon: <ETHLogo />,
	},
	{
		key: '0x13881',
		value: 'Mumbai',
		icon: <PolygonLogo />,
	},
];

const NetworksButton = () => {
	const { chainId } = useChain();
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState(undefined);

	useEffect(() => {
		const newSelected = networks.find((item) => item.key === chainId);
		setSelected(newSelected);
	}, [chainId]);

	const toggle = () => {
		setIsOpen(!isOpen);
	};

	if (!chainId || !selected) return null;

	return (
		<div>
			<button className="px-2 h-10 mr-2 border shadow-sm focus:outline-none flex items-center justify-center text-black hover:text-blue-900 rounded transition duration-300" onClick={toggle}>
				<div className="flex items-center ">
					{selected.icon}
					<span className="px-2 text-xs font-bold">{selected.value}</span>
				</div>
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>
			{isOpen && <Networks toggle={toggle} networks={networks} />}
		</div>
	);
};

export default NetworksButton;
