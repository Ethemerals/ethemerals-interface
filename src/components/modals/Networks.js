import { useState, useEffect } from 'react';
import { useChain } from 'react-moralis';
import { useUser } from '../../hooks/useUser';
import useWindowSize from '../../hooks/useWindowSize';

const Networks = ({ toggle, networks }) => {
	const { logout } = useUser();
	const { switchNetwork } = useChain();
	const [windowMed, setWindowMed] = useState(false);
	const windowSize = useWindowSize(898);

	useEffect(() => {
		if (windowSize.width >= 898) {
			setWindowMed(true);
		} else {
			setWindowMed(false);
		}
	}, [windowSize]);

	const handleMenuClick = async (network) => {
		console.log('switch to: ', networks[network].value);
		try {
			await switchNetwork(networks[network].key);
		} catch (error) {}

		toggle();
	};

	return (
		<>
			<div className={`rounded mt-2 py-4 w-44 bg-white absolute border-gray-100 border-2 shadow-xl animate-fadeOnFast ${!windowMed ? 'bottom-16' : ''}`}>
				<button onClick={() => handleMenuClick(0)} className="px-2 h-10 mr-2 focus:outline-none flex items-center justify-center text-black hover:text-blue-600 rounded transition duration-300">
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
				<hr></hr>
				<div className="flex ml-2 text-gray-400 text-xs pb-2 pt-1">
					<button className="pl-1 h-10 mr-2 focus:outline-none flex items-center justify-center text-black hover:text-blue-600 rounded transition duration-300">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>

						<a href="/">
							<span onClick={logout} className="px-2 text-xs font-bold">
								Logout
							</span>
						</a>
					</button>
				</div>
			</div>
		</>
	);
};

export default Networks;
