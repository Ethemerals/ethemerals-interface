import NiceModal from '@ebay/nice-modal-react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import { shortenAddress } from '../../utils';
import { useMiningStatus } from '../../context/TxContext';

import NFTPreview from './NFTPreview';
import { useUser } from '../../hooks/useUser';
import NetworksButton from './NetworksButton';
import { modalRegistry } from '../niceModals/RegisterModals';

const Spinner = () => (
	<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
		<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
		<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
	</svg>
);

const AccountBar = () => {
	const mining = useMiningStatus();
	const { address } = useUser();

	const showUserWallet = (selected) => {
		NiceModal.show(modalRegistry.userWallet, { selected });
	};

	return (
		<>
			<NetworksButton />
			<div onClick={() => showUserWallet(0)} className="hidden md:flex">
				<NFTPreview />
			</div>

			<div className=" bg-brandColor flex rounded items-center h-10 text-xs sm:text-base text-white">
				<span className="w-2"></span>

				<span
					className={`${
						mining ? ' bg-yellow-400' : ' bg-brandColor-purple bg-opacity-100 text-white hover:bg-opacity-60 transition duration-300'
					} flex rounded rounded-l-xl w-28 sm:w-36 md:w-40 items-center px-2 md:px-4 h-full`}
				>
					{mining ? (
						<span onClick={() => showUserWallet(2)} className="cursor-pointer h-full flex items-center tracking-wide">
							<span className="pr-5 text-white">PENDING...</span>
							<Spinner />
						</span>
					) : (
						<span onClick={() => showUserWallet(2)} className="cursor-pointer h-full flex items-center gap-1 md:gap-3">
							{shortenAddress(address)}
							<Jazzicon diameter={20} seed={jsNumberForAddress(address)} />
						</span>
					)}
				</span>
			</div>
		</>
	);
};

export default AccountBar;
