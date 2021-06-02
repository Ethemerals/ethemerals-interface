import { useEffect, useState } from 'react';

const NFTBalance = ({ account, active }) => {
	const [NFTS, setNFTS] = useState([]);

	useEffect(() => {
		if (active) {
			setNFTS(account.ethemerals);
		}
	}, [account]);

	// TODO get NFT preference

	if (!active || NFTS.length === 0) {
		return (
			<span className="flex bg-brandColor-purple rounded-xl items-center h-8 md:h-11 mr-2 cursor-pointer text-xs sm:text-sm">
				<span className="text-white px-3">NO NFTS</span>
			</span>
		);
	}

	return (
		<span className="flex bg-brandColor-purple rounded-xl items-center h-8 md:h-11 mr-2 cursor-pointer text-xs sm:text-sm">
			<span className="text-white px-3">
				#{NFTS[0].id} / {NFTS.length} NFTS
			</span>
		</span>
	);
};

export default NFTBalance;
