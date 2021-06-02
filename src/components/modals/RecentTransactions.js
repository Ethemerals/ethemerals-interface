import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { isAddress, shortenAddress, formatELF, formatETH } from '../../utils';

import useOnboard from '../../hooks/useOnboard';
import Links from '../../constants/Links';

const RecentTransactions = ({ toggle, props, account }) => {
	const [onboard, provider, address, balance] = useOnboard();

	useEffect(() => {
		if (provider) {
			console.log('PROVIDER', provider);
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
						<div className="h-24 rounded-2xl mx-4 border border-gray-600 relative">
							<div className="px-4 vertical-center space-y-2">
								<p className="text-sm text-gray-400">Connected with Metamask </p>
								<span className="flex items-center gap-2 text-2xl">
									<Jazzicon diameter={20} seed={jsNumberForAddress(props.address)} />
									{shortenAddress(props.address)}
								</span>
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
