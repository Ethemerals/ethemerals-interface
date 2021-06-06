import { useEffect, useState } from 'react';

import { useQueryClient, useIsFetching } from 'react-query';

const NFTBalance = ({ account }) => {
	const isFetching = useIsFetching();
	const isFetchingAccount = useIsFetching(['account']);

	// useEffect(() => {
	// 	console.log('isFetching', isFetching);
	// 	console.log('fetching account', isFetchingAccount);
	// }, [isFetching, isFetchingAccount]);

	return (
		<span className="flex bg-brandColor-purple rounded-xl items-center h-8 md:h-11 mr-2 cursor-pointer text-xs sm:text-base hover:bg-brandColor transition duration-300">
			{/* {account && <NFTNumber NFTS={account.ethemerals} />} */}
			{account.ethemerals.length === 0 && <span className="text-white px-2 md:px-3">NO NFTS</span>}
			{account.ethemerals.length > 0 && (
				<span className="text-white px-2 md:px-3">
					#{account.ethemerals[0].id} / {account.ethemerals.length} NFTS
				</span>
			)}
		</span>
	);
};

export default NFTBalance;
