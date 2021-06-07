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
			<div className="w-full h-full flex justify-center fixed top-0 left-0 animate-fadeOnFast">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 z-20 bg-opacity-50 bg-black"></div>
				<div className=" w-11/12 max-w-420 h-96 center border-gray-400 bg-opacity-100 bg-gray-700 rounded-2xl overflow-hidden z-30 tracking-wide shadow-xl">
					<div className="h-44 bg-gray-800">
						<div className="flex justify-between">
							<p className="text-lg p-4">ELF Balance</p>
							<span onClick={toggle} className="cursor-pointer p-4 text-gray-300 hover:text-gray-100">
								<CloseSVG />
							</span>
						</div>
						<div className="h-24 rounded-2xl mx-4 relative flex text-sm ">
							{account && account.elfBalance <= 0 && <span className="text-2xl"> 0 ELF</span>}
							{account && account.elfBalance > 0 && <span className="text-2xl">{formatELF(account.elfBalance)} ELF</span>}
						</div>
					</div>
					<p className="text-lg px-4 py-3">Inventory</p>
				</div>
			</div>
		</>
	);
};

export default UserELF;
