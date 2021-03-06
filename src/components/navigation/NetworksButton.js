import NiceModal from '@ebay/nice-modal-react';
import { useEffect, useState } from 'react';
import { useChain } from 'react-moralis';
import { Networks } from '../chains/Networks';
import { modalRegistry } from '../niceModals/RegisterModals';

const NetworksButton = () => {
	const { chainId } = useChain();
	const [selected, setSelected] = useState(undefined);

	useEffect(() => {
		const newSelected = Networks.find((item) => item.key === chainId);
		setSelected(newSelected);
	}, [chainId]);

	const toggle = () => {
		NiceModal.show(modalRegistry.chooseNetworks);
	};

	if (!chainId || !selected) return null;

	return (
		<div>
			<button className="px-2 h-10 mr-2 border bg-white shadow-sm focus:outline-none flex items-center justify-center text-black hover:text-blue-900 rounded transition duration-300" onClick={toggle}>
				<div className="flex items-center ">
					{selected.icon}
					<span className="px-1 text-xs font-bold">{selected.value}</span>
				</div>
				<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
				</svg>
			</button>
		</div>
	);
};

export default NetworksButton;
