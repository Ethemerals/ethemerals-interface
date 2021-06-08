import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Images from '../../constants/Images';

import { shortenAddress, formatELF, formatETH } from '../../utils';

const CloseSVG = () => (
	<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
		<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
	</svg>
);

const NFTLink = (nft, index) => {
	return (
		<div key={index} className="flex capitalize items-center">
			<span className="flex-none w-12 text-right">#{nft.id}1</span>
			<span className="flex-grow mx-4 overflow-hidden">{nft.metadata.coin.slice(0, 30)}</span>
			<span className="flex-none">{nft.score} HP</span>
		</div>
	);
};

const UserELF = ({ toggle, props, account }) => {
	return (
		<>
			<div className="h-28 border border-gray-500 p-3 m-4 space-y-2">
				<span className="flex items-center gap-2 text-2xl">
					{account && account.elfBalance <= 0 && <span className="text-2xl"> 0 ELF</span>}
					{account && account.elfBalance > 0 && <span className="text-2xl">{formatELF(account.elfBalance)} ELF</span>}
				</span>
			</div>
			<div className="p-4">
				<p className="text-lg">Recent Activity</p>

				<div onClick={toggle} className="text-xs sm:text-sm mt-2 text-blue-500 hover:text-blue-400">
					<Link exact="true" to="/dashboard">
						More? Go to dashboard
					</Link>
				</div>
			</div>
		</>
	);
};

export default UserELF;
