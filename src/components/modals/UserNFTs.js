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
			<span className="flex-none w-12 text-right">#{nft.id}</span>
			<span className="flex-grow mx-4 overflow-hidden">{nft.metadata.coin.slice(0, 30)}</span>
			<span className="flex-none">{nft.score} HP</span>
		</div>
	);
};

const UserNFTs = ({ toggle, props, account }) => {
	const [NFTShortList, setNFTShortList] = useState([]);

	useEffect(() => {
		if (account.ethemerals.length > 0) {
			setNFTShortList(account.ethemerals.slice(0, 7));
		}
	}, [account]);

	const changeCurrentNFT = () => {
		console.log('change ethemeral');
	};

	return (
		<>
			<div className="h-28 m-4 ">
				<div className="flex h-28">
					<img width="256" height="112" className="object-cover w-52 sm:w-64 h-28 cursor-pointer border-gray-600 border border-r-0" alt="Preview of current Ethemeral" src={Images.nftPreviewWide} />
					<div className="h-full w-full text-sm text-center flex-grow border border-l-0 border-gray-600">
						<div className="overflow-hidden bg-red-800">
							<p className="text-xl">#{account.ethemerals[0].id}</p>
							<p className="uppercase over">{account.ethemerals[0].metadata.coin}</p>
						</div>
						<p className="bg-yellow-300">
							current
							<button onClick={changeCurrentNFT} className="text-sm text-blue-500 hover:text-blue-400 align-bottom">
								change
							</button>
						</p>
					</div>
				</div>
			</div>
			<div className="p-4">
				<p className="text-lg pb-2">Inventory</p>
				{NFTShortList.map((nft, index) => NFTLink(nft, index))}
				<div onClick={toggle} className="text-xs sm:text-sm mt-2 text-blue-500 hover:text-blue-400">
					<Link exact="true" to="/dashboard">
						More? Go to dashboard
					</Link>
				</div>
			</div>

			{/* <div className=" w-11/12 max-w-420 h-96 center border-gray-400 bg-opacity-100 bg-gray-700 rounded-2xl overflow-hidden z-30 tracking-wide shadow-xl">
					<div className="h-44 bg-gray-800">

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
				</div> */}
		</>
	);
};

export default UserNFTs;
