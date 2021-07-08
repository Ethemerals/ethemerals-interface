import React, { useState, useEffect } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import { shortenAddress, formatETH } from '../../utils';
import { useMiningStatus } from '../../hooks/TxContext';

import UserModal from '../modals/UserModal';

import useUserAccount from '../../hooks/useUserAccount';

import NFTPreview from './NFTPreview';

const Spinner = () => (
	<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
		<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
		<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
	</svg>
);

const AccountBar = () => {
	const mining = useMiningStatus();
	const { address, balance, userData, userIsLoading, mutateUser, account } = useUserAccount();

	const [isUserModalOpen, setIsUserModalOpen] = useState(false);
	const [selectedUserModal, setSelectedUserModal] = useState(0);

	const toggleUserModal = (selected) => {
		setIsUserModalOpen(!isUserModalOpen);
		setSelectedUserModal(selected);
	};

	useEffect(() => {
		console.log('idle', mutateUser.isIdle);
		// NEW USER
		if (mutateUser.isIdle) {
			if (account && !userIsLoading && userData && userData.message === 'does not exist') {
				if (account.ethemerals.length > 0) {
					mutateUser.mutate({ address: account.id, main: account.ethemerals[0].id });
					console.log('new user');
				}
			}
		}
	}, [userData, userIsLoading, mutateUser, account]);

	if (!address) {
		return null;
	}

	return (
		<>
			<span onClick={() => toggleUserModal(0)} className="hidden md:flex">
				<NFTPreview />
			</span>

			<span className="bg-gray-700 flex rounded-xl items-center h-8 md:h-11 text-xs sm:text-base text-white">
				<span className="px-2 cursor-pointer h-full flex items-center rounded-xl rounded-r-none hover:bg-gradient-to-r from-gray-600 " onClick={() => toggleUserModal(1)}>
					{balance && <span>{formatETH(balance)} ETH</span>}
					{/* TODO, animated ELF ticker */}
				</span>

				<span
					className={`${
						mining ? ' bg-yellow-400 border-yellow-100' : 'bg-gray-900 border-gray-800 hover:bg-gray-800 hover:border-gray-600 transition duration-300'
					} flex rounded-xl h-8 md:h-11 w-28 sm:w-36 md:w-40 items-center px-2 md:px-4 border `}
				>
					{mining ? (
						<span onClick={() => toggleUserModal(2)} className="cursor-pointer h-full flex items-center tracking-wide">
							<span className="pr-5 text-white">PENDING...</span>
							<Spinner />
						</span>
					) : (
						<span onClick={() => toggleUserModal(2)} className="cursor-pointer h-full flex items-center gap-1 md:gap-3">
							{shortenAddress(address)}
							<Jazzicon diameter={20} seed={jsNumberForAddress(address)} />
						</span>
					)}
				</span>
			</span>

			<span onClick={() => toggleUserModal(0)} className="md:hidden flex">
				<NFTPreview />
			</span>

			{isUserModalOpen && <UserModal toggle={toggleUserModal} selected={selectedUserModal} />}
		</>
	);
};

export default AccountBar;
