import { useEffect, useState } from 'react';

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import { useWeb3, useLogin } from '../../hooks/Web3Context';
import { shortenAddress } from '../../utils';
import useParseAccountAction from '../../hooks/useParseAccountActions';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';
import useUserAccount from '../../hooks/useUserAccount';

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
	const [actionString, txLink] = useParseAccountAction(action);

	return (
		<a href={txLink} target="_blank" rel="noreferrer" className="flex items-center hover:text-blue-400">
			{actionString}
			<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
				<polyline points="15 3 21 3 21 9"></polyline>
				<line x1="10" y1="14" x2="21" y2="3"></line>
			</svg>
		</a>
	);
};

const UserAccount = () => {
	const provider = useWeb3();
	const login = useLogin();
	const { address } = useUserAccount();
	const [copied, copy] = useCopyToClipboard(address);

	const [connection, setConnection] = useState('');
	const { data, status } = useGQLQuery('account_actions', GET_ACCOUNT_ACTIONS, { id: address }, { enabled: !!address, refetchOnMount: true });

	useEffect(() => {
		if (provider) {
			setConnection(provider.connection.url);
		}
	}, [provider]);

	return (
		<>
			<div className="h-28 px-4 m-4 relative bg-customBlue-dark">
				<div className="flex items-center justify-between py-2">
					<p className="text-xs sm:text-sm text-white">Connected with {connection} </p>
					<button onClick={login} className="text-xs sm:text-sm text-gray-200 px-2 hover:text-white">
						Change
					</button>
				</div>
				<span className="flex items-center gap-2 text-2xl vertical-center text-white">
					<Jazzicon diameter={20} seed={jsNumberForAddress(address)} />
					{shortenAddress(address)}
				</span>
				<div className="flex items-center py-2 absolute bottom-0">
					<a href={`${Links.ETHERSCAN_URL}address/${address}`} target="_blank" rel="noreferrer">
						<div className="flex items-center space-x-2 text-gray-200 hover:text-white mr-6">
							<ExternalLinkSVG />
							<p className="text-xs sm:text-sm">View on Etherscan</p>
						</div>
					</a>
					<div onClick={copy} className="flex items-center space-x-2 text-gray-200 hover:text-white cursor-pointer">
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
			<div className="p-4">
				<p className="text-lg text-black">Recent Activity</p>
				<ul className="text-xs sm:text-sm text-blue-500">
					{status === 'success' && data.account && data.account.actions.length > 0 && data.account.actions.map((action, index) => <li key={index}>{ActionLink(action)}</li>)}
				</ul>
			</div>
		</>
	);
};

export default UserAccount;
