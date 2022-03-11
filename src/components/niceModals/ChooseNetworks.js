import NiceModal, { useModal } from '@ebay/nice-modal-react';

import { useChain } from 'react-moralis';

export default NiceModal.create(({ networks }) => {
	const modal = useModal();
	const { switchNetwork } = useChain();

	const toggle = async () => {
		modal.remove();
	};

	const handleMenuClick = async (network) => {
		console.log('switch to: ', networks[network].value);
		try {
			await switchNetwork(networks[network].key);
		} catch (error) {}

		toggle();
	};

	return (
		<div className="w-full h-full fixed top-0 left-0 animate-fadeOnFast z-10">
			<div onClick={toggle} className="fixed w-full h-full top-0 left-0 z-20 bg-opacity-50 bg-black"></div>
			<div className="w-44 p-2 py-4 center z-30 tracking-wide shadow-xl rounded bg-white border-2">
				<button onClick={() => handleMenuClick(0)} className="px-2 h-10 mr-2 z-30 focus:outline-none flex items-center justify-center text-black hover:text-blue-600 rounded transition duration-300">
					<div className="flex items-center ">
						{networks[0].icon}
						<span className="px-2 text-xs font-bold">{networks[0].value}</span>
					</div>
				</button>
				<button onClick={() => handleMenuClick(1)} className="px-2 h-10 mr-2 focus:outline-none flex items-center justify-center text-black hover:text-blue-600 rounded transition duration-300">
					<div className="flex items-center ">
						{networks[1].icon}
						<span className="px-2 text-xs font-bold">{networks[1].value}</span>
					</div>
				</button>
				<div className="h-6"></div>
				<hr></hr>
				<div className="flex ml-2 text-gray-400 text-xs pb-2 pt-1">
					<span>TESTNETS</span>
				</div>
				<button onClick={() => handleMenuClick(2)} className="px-2 h-10 mr-2 focus:outline-none flex items-center justify-center text-black hover:text-blue-600 rounded transition duration-300">
					<div className="flex items-center ">
						{networks[2].icon}
						<span className="px-2 text-xs font-bold">{networks[2].value}</span>
					</div>
				</button>
				<button onClick={() => handleMenuClick(3)} className="px-2 h-10 mr-2 focus:outline-none flex items-center justify-center text-black hover:text-blue-600 rounded transition duration-300">
					<div className="flex items-center ">
						{networks[3].icon}
						<span className="px-2 text-xs font-bold">{networks[3].value}</span>
					</div>
				</button>
				<div className="h-6"></div>
			</div>
		</div>
	);
});
