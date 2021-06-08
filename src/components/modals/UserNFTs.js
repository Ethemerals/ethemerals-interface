import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Images from '../../constants/Images';

const NFTLink = (nft, index) => {
	return (
		<div key={index} className="flex capitalize items-center mx-2">
			<span className="flex-none w-12 text-right">#{nft.id}</span>
			<span className="flex-grow mx-4 overflow-hidden">{nft.metadata.coin.slice(0, 30)}</span>
			<span className="flex-none">{nft.score} HP</span>
		</div>
	);
};

const UserNFTs = ({ props, account }) => {
	const [NFTShortList, setNFTShortList] = useState([]);

	useEffect(() => {
		if (account && account.ethemerals.length > 0) {
			setNFTShortList(account.ethemerals.slice(0, 7));
		}
	}, [account]);

	const changeCurrentNFT = () => {
		console.log('change ethemeral');
	};

	if (!account) {
		return (
			<>
				<div className="h-28 m-4">
					<div className="flex h-28">
						<div className="h-full w-full text-sm text-center border border-r-0 border-gray-700 bg-gray-900 relative">
							<div className="overflow-hidden center -my-3">None</div>
						</div>
						<img width="256" height="112" className="object-cover w-44 sm:w-64 h-28 cursor-pointer border-gray-600 border border-l-0" alt="Preview of current Ethemeral" src={Images.nftPreviewWide} />
					</div>
				</div>
				<div className="p-4">
					<p className="text-lg pb-2">Inventory</p>
					NONE
				</div>
			</>
		);
	}

	return (
		<>
			<div className="h-28 m-4">
				<div className="flex h-28">
					<div className="h-full w-full text-sm text-center border border-r-0 border-gray-700 bg-gray-900 relative">
						<div className="overflow-hidden center -my-3">
							<p className="text-xl">#{account.ethemerals[0].id}</p>
							<p className="uppercase">{account.ethemerals[0].metadata.coin}</p>
						</div>
						{account.ethemerals.length > 1 && (
							<div onClick={changeCurrentNFT} className="cursor-pointer absolute bottom-0 w-full text-blue-700 hover:bg-gray-800">
								change main
							</div>
						)}
					</div>
					<img width="256" height="112" className="object-cover w-44 sm:w-64 h-28 cursor-pointer border-gray-600 border border-l-0" alt="Preview of current Ethemeral" src={Images.nftPreviewWide} />
				</div>
			</div>
			<div className="p-4">
				<p className="text-lg pb-2">Inventory</p>
				{NFTShortList.map((nft, index) => NFTLink(nft, index))}
			</div>
		</>
	);
};

export default UserNFTs;
