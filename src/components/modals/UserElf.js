import { useEffect, useState } from 'react';
import Images from '../../constants/Images';
import Links from '../../constants/Links';

import { formatELF, formatETH } from '../../utils';
import useUserAccount from '../../hooks/useUserAccount';

const UserELF = () => {
	const { account, balance } = useUserAccount();

	const [userNFTs, setUserNFTs] = useState(undefined);
	const [totalNFTElf, setTotalNFTElf] = useState(0);

	useEffect(() => {
		if (account && account.ethemerals.length > 0) {
			setUserNFTs(account.ethemerals);
		}
	}, [account]);

	useEffect(() => {
		if (userNFTs && userNFTs.length > 0) {
			let nftRewards = 0;
			userNFTs.forEach((nft) => {
				nftRewards += parseInt(formatELF(nft.rewards));
			});
			setTotalNFTElf(nftRewards);
		}
	}, [userNFTs]);

	return (
		<>
			<div className="h-28 border border-gray-700 bg-gray-900 m-4 relative">
				<div className="flex space-x-6 center justify-center mx-auto w-full overflow-hidden whitespace-pre">
					<img width="28" height="28" alt="Preview of current Ethemeral" src={Images.logoELF} />
					<div>
						<span className="text-4xl">{account && account.elfBalance > 0 ? formatELF(account.elfBalance) : 'ZERO'}</span>
						<span className="text-brandColor text-4xl"> ELF</span>
					</div>
				</div>
				{balance && <p className="text-xs sm:text-sm text-gray-400 py-2 text-right px-4">{formatETH(balance, 6)} ETH</p>}
				<a href={Links.UNISWAP} target="_blank" rel="noreferrer" className="text-xs sm:text-sm text-gray-400 py-2 absolute bottom-0 w-full text-center hover:text-gray-200">
					Trade on Uniswap
				</a>
			</div>
			<div className="p-4">
				<p className="text-lg text-center">Total claimable ELF from your Ethemerals</p>
				<p className="flex items-center justify-center">
					<span className="text-lg">{totalNFTElf > 0 ? totalNFTElf : 'ZERO'}</span>
				</p>
			</div>
		</>
	);
};

export default UserELF;
