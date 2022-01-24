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
				{!isOpen && (
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
					</svg>
				)}
				{isOpen && (
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
					</svg>
				)}
			</button>
			{isOpen && <Networks toggle={toggle} networks={networks} />}
		</div>
	);
};

export default NetworksButton;
