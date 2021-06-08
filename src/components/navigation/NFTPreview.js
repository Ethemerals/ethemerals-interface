import { useEffect, useState } from 'react';

const NFTPreview = ({ data }) => {
	const [account, setAccount] = useState(false);

	useEffect(() => {
		if (data) {
			setAccount(data.account);
		}
	}, [data]);

	if (!account) {
		// NEW USER
		return (
			<span className="flex bg-brandColor-purple rounded-xl items-center h-8 md:h-11 mr-2 cursor-pointer text-xs sm:text-base hover:bg-brandColor transition duration-300">
				<span className="text-white px-2 md:px-3">NO NFTS</span>
			</span>
		);
	}

	return (
		<span className="flex bg-brandColor-purple rounded-xl items-center h-8 md:h-11 mr-2 cursor-pointer text-xs sm:text-base hover:bg-brandColor transition duration-300">
			{/* // USER, NO NFTS */}
			{account.ethemerals.length === 0 && <span className="text-white px-2 md:px-3">NO NFTS</span>}
			{account.ethemerals.length > 0 && (
				<span className="text-white px-2 md:px-3">
					#{account.ethemerals[0].id} / {account.ethemerals.length} NFTS
				</span>
			)}
		</span>
	);
};

export default NFTPreview;
