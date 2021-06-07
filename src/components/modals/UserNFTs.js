import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Images from '../../constants/Images';

const CloseSVG = () => (
	<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
		<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
	</svg>
);

const NFTLink = (nft, index) => {
	return (
		<div key={index} className="flex capitalize items-center">
			<span className="flex-none w-12">#{nft.id.padStart(4, '0')}</span>
			<span className="flex-grow mx-4">{nft.metadata.coin}</span>
			<span className="flex-none w-14">{nft.score} HP</span>
		</div>
	);
};

const UserNFTs = ({ toggle, props, account }) => {
	const [NFTShortList, setNFTShortList] = useState([]);

	useEffect(() => {
		if (account.ethemerals.length > 0) {
			setNFTShortList(account.ethemerals.slice(0, 5));
		}
	}, [account]);

	const changeCurrentNFT = () => {
		console.log('change ethemeral');
	};

	return (
		<>
			<div className="w-full h-full flex justify-center fixed top-0 left-0 animate-fadeOnFast">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 z-20 bg-opacity-50 bg-black"></div>
				<div className=" w-11/12 max-w-420 h-96 center border-gray-400 bg-opacity-100 bg-gray-700 rounded-2xl overflow-hidden z-30 tracking-wide shadow-xl">
					<div className="h-44 bg-gray-800">
						<div className="flex justify-between">
							<p className="text-lg p-4">Current Ethemeral</p>

							<span onClick={toggle} className="cursor-pointer p-4 text-gray-300 hover:text-gray-100">
								<CloseSVG />
							</span>
						</div>
						<div className="h-24 rounded-2xl mx-4 relative flex text-sm ">
							<img width="256" height="96" className="object-cover w-52 sm:w-64 h-24 cursor-pointer" alt="Preview of current Ethemeral" src={Images.nftPreviewWide} />

							<div className="mx-2">
								<p className="text-2xl">#{account.ethemerals[0].id}</p>
								<p className="uppercase over">{account.ethemerals[0].metadata.coin}</p>

								<button onClick={changeCurrentNFT} className="text-sm text-blue-500 hover:text-blue-400 align-bottom">
									change
								</button>
							</div>
						</div>
					</div>
					<p className="text-lg px-4 py-3">Inventory</p>
					{NFTShortList.length > 0 && (
						<div className="rounded-2xl mx-4 relative text-xs sm:text-base leading-relaxed sm:leading-normal">
							{NFTShortList.map((nft, index) => NFTLink(nft, index))}
							<div onClick={toggle} className="text-xs sm:text-sm mt-2 text-blue-500 hover:text-blue-400 align-bottom">
								<Link exact="true" to="/dashboard">
									More? Go to dashboard
								</Link>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default UserNFTs;
