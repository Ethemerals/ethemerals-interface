import { useEffect, useState } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import { useWeb3, useLogin } from '../../hooks/Web3Context';
import { shortenAddress } from '../../utils';
import useParseAction from '../../hooks/useParseActions';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';

import Links from '../../constants/Links';

import { useGQLQuery } from '../../hooks/useGQLQuery';
import { GET_ACCOUNT_ACTIONS } from '../../queries/Subgraph';

const ExternalLinkSVG = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
		<polyline points="15 3 21 3 21 9"></polyline>
		<line x1="10" y1="14" x2="21" y2="3"></line>
	</svg>
);

const ActionLink = (action) => {
	const [actionString, txLink] = useParseAction(action);

	return (
		<a href={txLink} target="_blank" rel="noreferrer" className="flex items-center gap-x-2 hover:text-blue-400">
			{actionString}
			<ExternalLinkSVG />
		</a>
	);
};

const UserAccount = ({ toggle, props }) => {
	const provider = useWeb3();
	const login = useLogin();
	const [copied, copy] = useCopyToClipboard(props.address);

	const [connection, setConnection] = useState('');

	const { data, status } = useGQLQuery('account_actions', GET_ACCOUNT_ACTIONS, { id: props.address });

	useEffect(() => {
		if (provider) {
			setConnection(provider.connection.url);
		}
	}, [provider]);

	return (
		<>
			<div className="w-full h-full flex justify-center fixed top-0 left-0 animate-fadeOnFast">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 z-20 bg-opacity-50 bg-black"></div>
				<div className=" w-11/12 max-w-420 h-96 center border-gray-400 bg-opacity-100 bg-gray-700 rounded-2xl overflow-hidden z-30 tracking-wide shadow-xl">
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
									<p className="text-xs sm:text-sm text-gray-400">Connected with {connection} </p>
									<button onClick={login} className="text-xs sm:text-sm text-blue-500 px-2 mr-0 ml-4 border-gray-900 hover:bg-gray-700 hover:text-blue-400 border rounded-xl">
										Change
									</button>
								</div>
								<span className="flex items-center gap-2 text-2xl">
									<Jazzicon diameter={20} seed={jsNumberForAddress(props.address)} />
									{shortenAddress(props.address)}
								</span>
								<div className="flex items-center">
									<a href={`${Links.ETHERSCAN_URL}address/${props.address}`} target="_blank" rel="noreferrer">
										<div className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 mr-6">
											<ExternalLinkSVG />
											<p className="text-xs sm:text-sm">View on Etherscan</p>
										</div>
									</a>
									<div onClick={copy} className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 cursor-pointer">
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
											<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
										</svg>
										<p className="text-xs sm:text-sm">
											{copied ? 'Copied' : 'Copy '} Address{copied ? '!' : ''}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<p className="text-lg p-4">Recent Activity</p>
					<div className="h-20 rounded-2xl mx-4 relative text-xs sm:text-sm leading-relaxed text-blue-500">
						{status === 'success' && data.account.actions.length > 0 && data.account.actions.map((action, index) => <p key={index}>{ActionLink(action)}</p>)}
					</div>
				</div>
			</div>
		</>
	);
};

export default UserAccount;
