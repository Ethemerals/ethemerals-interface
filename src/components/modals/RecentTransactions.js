import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import { useWeb3, useOnboard, useAddress, useBalance } from '../../hooks/Web3Context';
import { isAddress, shortenAddress, formatELF, formatETH } from '../../utils';

import Links from '../../constants/Links';

const RecentTransactions = ({ toggle, props, account }) => {
	const provider = useWeb3();
	const onboard = useOnboard();
	const [connection, setConnection] = useState('');

	const login = async () => {
		const selected = await onboard.walletSelect();
		console.log(selected);
		if (selected) {
			await onboard.walletCheck();
		}
	};

	useEffect(() => {
		if (provider) {
			setConnection(provider.connection.url);
		}
	}, [provider]);

	return (
		<>
			<div className="w-full h-full flex justify-center fixed top-0 left-0">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 z-20 bg-opacity-60 bg-black"></div>
				<div className=" w-11/12 max-w-420 h-96 center border-gray-400 bg-opacity-100 bg-gray-700 rounded-2xl overflow-hidden z-30 tracking-wide">
					<div className="h-48 bg-gray-800">
						<div className="flex justify-between">
							<p className="text-lg p-4">Account</p>
							<span onClick={toggle} className="cursor-pointer p-4 text-gray-300 hover:text-gray-100">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
									<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
								</svg>
							</span>
						</div>
						<div className="h-28 rounded-2xl mx-4 border border-gray-600 relative">
							<div className="p-3 space-y-2">
								<div className="flex items-center justify-between">
									<p className="text-sm text-gray-400">Connected with {connection} </p>
									<button onClick={login} className="text-sm text-blue-500 px-2 mr-0 ml-4 border-gray-900 hover:bg-gray-900 border rounded-xl">
										Change
									</button>
								</div>
								<span className="flex items-center gap-2 text-2xl justify-center">
									<Jazzicon diameter={20} seed={jsNumberForAddress(props.address)} />
									{shortenAddress(props.address)}
								</span>
								{/* TODO */}
								<a href="google.com">
									<div className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 mt-2">
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
											<polyline points="15 3 21 3 21 9"></polyline>
											<line x1="10" y1="14" x2="21" y2="3"></line>
										</svg>
										<p className="text-sm">View on Etherscan</p>
									</div>
								</a>
							</div>
						</div>
					</div>
					<p className="text-lg p-4">Recent Transactions</p>
					<div className="h-20 rounded-2xl mx-4 relative">
						<p className="text-sm">Minted Ethemeral</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default RecentTransactions;
