import { useState } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import { shortenAddress } from '../../utils';
import { useMiningStatus } from '../../context/TxContext';

import UserModal from '../modals/UserModal';

import NFTPreview from './NFTPreview';
import { useUser, useUserAccount } from '../../hooks/useUser';
import { useNativeBalance } from 'react-moralis';
import NetworksButton from './NetworksButton';

const Spinner = () => (
	<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
		<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
		<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
	</svg>
);

const AccountBar = () => {
	const mining = useMiningStatus();
	const { address } = useUser();
	const { userNFTs, mainIndex } = useUserAccount();
	const { data: balance } = useNativeBalance();

	const [isUserModalOpen, setIsUserModalOpen] = useState(false);

	const [selectedUserModal, setSelectedUserModal] = useState(0);

	const toggleUserModal = (selected) => {
		setIsUserModalOpen(!isUserModalOpen);
		setSelectedUserModal(selected);
	};

	return (
		<>
			<div onClick={() => toggleUserModal(0)} className="hidden md:flex">
				<NFTPreview />
			</div>

			<NetworksButton />
			<div className=" bg-brandColor flex rounded items-center h-10 text-xs sm:text-base text-white">
				<span
					style={{ maxWidth: '128px' }}
					className="px-2 whitespace-nowrap cursor-pointer h-full flex items-center justify-end rounded rounded-r-none hover:bg-gradient-to-r from-brandColor-pale overflow-hidden"
					onClick={() => toggleUserModal(1)}
				>
					{balance && <span>{balance.formatted}</span>}
					{/* {account && <span>{formatELF(account.elfBalance)} ELF</span>} */}
					{/* TODO, animated ELF ticker */}
				</span>

				<span
					className={`${
						mining ? ' bg-yellow-400' : ' bg-brandColor-purple bg-opacity-100 text-white hover:bg-opacity-60 transition duration-300'
					} flex rounded rounded-l-xl w-28 sm:w-36 md:w-40 items-center px-2 md:px-4 h-full`}
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
			</div>

			{isUserModalOpen && <UserModal toggle={toggleUserModal} selected={selectedUserModal} />}
		</>
	);
};

export default AccountBar;
