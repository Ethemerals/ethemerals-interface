import React, { useEffect, useState } from 'react';
import { ethers, utils } from 'ethers';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import { isAddress, shortenAddress, formatELF, formatETH } from '../../utils';
import RecentTransactions from '../modals/RecentTransactions';

import { useGQLQuery } from '../../hooks/useGQLQuery';
import { GET_ACCOUNT } from '../../queries/Subgraph';

// import { useMiningStatus } from './hooks/TxContext';
import NFTBalance from './NFTBalance';

const Spinner = () => (
	<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
		<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
		<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
	</svg>
);

const AccountBar = ({ props }) => {
	const { data, status, isLoading, error } = useGQLQuery('account', GET_ACCOUNT, { id: props.address });
	const [showELF, setShowELF] = useState(false);
	const [active, setActive] = useState(false);
	const [account, setAccount] = useState({});
	const [isRecentTXOpen, setIsRecentTXOpen] = useState(false);

	const toggleRecentTX = () => {
		setIsRecentTXOpen(!isRecentTXOpen);
	};

	useEffect(() => {
		if (data && data.account === null) {
			// new account
			setActive(false);
		}
		if (data && data.account) {
			setActive(true);
			setAccount(data.account);
			console.log(data);
		}
	}, [status]);

	useEffect(() => {
		if (error) {
			console.log(error);
		}
	}, [error]);

	if (!props.address || !props.balance) {
		return null;
	}

	const mining = false;

	const toggle = () => {
		setShowELF(!showELF);
	};

	return (
		<>
			<span className="hidden md:flex">
				<NFTBalance account={account} active={active} />
			</span>

			<span className="bg-gray-700 flex rounded-xl items-center h-8 md:h-11 text-xs sm:text-sm">
				<span className="text-white px-2 cursor-pointer h-full flex items-center" onClick={toggle}>
					{!showELF && <span>{formatETH(props.balance)} ETH</span>}
					{showELF && !active && <span>0 ELF</span>}
					{showELF && active && <span>{formatELF(data.account.elfBalance)} ELF</span>}
				</span>

				<span className={`${mining ? 'bg-green-600' : 'bg-gray-900'} flex text-white rounded-xl h-8 md:h-11 w-32 md:w-36 items-center px-2 md:px-4 `}>
					{mining ? (
						<span className="text-white cursor-pointer text-bold h-full flex items-center tracking-wide">
							<span className="pr-5">PENDING...</span>
							<Spinner />
						</span>
					) : (
						<span onClick={toggleRecentTX} className="text-white cursor-pointer h-full flex items-center gap-2 md:gap-3">
							{shortenAddress(props.address)}
							<Jazzicon diameter={20} seed={jsNumberForAddress(props.address)} />
						</span>
					)}
				</span>
			</span>

			<span className="md:hidden flex">
				<NFTBalance account={account} active={active} />
			</span>

			{isRecentTXOpen && <RecentTransactions toggle={toggleRecentTX} />}
		</>
	);
};

export default AccountBar;
