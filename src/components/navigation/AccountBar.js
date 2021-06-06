import React, { useEffect, useState } from 'react';
import { ethers, utils } from 'ethers';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import { isAddress, shortenAddress, formatELF, formatETH } from '../../utils';
import { useMiningStatus } from '../../hooks/TxContext';
import RecentTransactions from '../modals/RecentTransactions';
import UserNFTs from '../modals/UserNFTs';

import { useGQLQuery } from '../../hooks/useGQLQuery';
import { GET_ACCOUNT } from '../../queries/Subgraph';

// import { useMiningStatus } from './hooks/TxContext';
import NFTPreview from './NFTPreview';

const Spinner = () => (
	<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
		<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
		<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
	</svg>
);

const AccountBar = ({ props }) => {
	const mining = useMiningStatus();
	// const mining = true;

	const { data, status, isLoading, error } = useGQLQuery('account', GET_ACCOUNT, { id: props.address });

	const [showELF, setShowELF] = useState(false);
	const [active, setActive] = useState(false);
	const [account, setAccount] = useState({});
	const [isRecentTXOpen, setIsRecentTXOpen] = useState(false);
	const [isUserNFTsOpen, setIsUserNFTsOpen] = useState(false);

	const toggleRecentTX = () => {
		setIsRecentTXOpen(!isRecentTXOpen);
	};

	const toggleShowELF = () => {
		setShowELF(!showELF);
	};

	const toggleUserNFTs = () => {
		setIsUserNFTsOpen(!isUserNFTsOpen);
	};

	useEffect(() => {
		console.log('status', status);
		if (data && data.account === null) {
			// new account
			setActive(false);
		}
		if (data && data.account) {
			setActive(true);
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

	return (
		<>
			<span onClick={toggleUserNFTs} className="hidden md:flex">
				{active && <NFTPreview account={data.account} />}
			</span>

			<span className="bg-gray-700 flex rounded-xl items-center h-8 md:h-11 text-xs sm:text-base text-white">
				<span className="px-2 cursor-pointer h-full flex items-center rounded-xl rounded-r-none hover:bg-gradient-to-r from-gray-600 " onClick={toggleShowELF}>
					{!showELF && <span>{formatETH(props.balance)} ETH</span>}
					{showELF && !active && <span className="text-brandColor font-bold"> 0 ELF</span>}
					{showELF && active && <span className="text-brandColor font-bold">{formatELF(data.account.elfBalance)} ELF</span>}
				</span>

				<span
					className={`${
						mining ? ' bg-yellow-400 border-yellow-100' : 'bg-gray-900 border-gray-800 hover:bg-gray-800 hover:border-gray-600 transition duration-300'
					} flex rounded-xl h-8 md:h-11 w-28 sm:w-36 md:w-40 items-center px-2 md:px-4 border `}
				>
					{mining ? (
						<span onClick={toggleRecentTX} className="cursor-pointer h-full flex items-center tracking-wide">
							<span className="pr-5 text-white">PENDING...</span>
							<Spinner />
						</span>
					) : (
						<span onClick={toggleRecentTX} className="cursor-pointer h-full flex items-center gap-1 md:gap-3">
							{shortenAddress(props.address)}
							<Jazzicon diameter={20} seed={jsNumberForAddress(props.address)} />
						</span>
					)}
				</span>
			</span>

			<span onClick={toggleUserNFTs} className="md:hidden flex">
				{active && <NFTPreview onClick={toggleUserNFTs} account={data.account} />}
			</span>

			{isRecentTXOpen && active && <RecentTransactions toggle={toggleRecentTX} props={props} />}
			{isUserNFTsOpen && active && <UserNFTs toggle={toggleUserNFTs} props={props} account={data.account} />}
		</>
	);
};

export default AccountBar;
