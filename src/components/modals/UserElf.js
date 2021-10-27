import { useEffect, useState } from 'react';
import Images from '../../constants/Images';

import { formatELF, formatETH } from '../../utils';
import useUserAccount from '../../hooks/useUserAccount';
import { useEternalBattleAccount } from '../../hooks/useEternalBattle';

const UserELF = () => {
	const { account, balance } = useUserAccount();
	const { accountEternalBattle } = useEternalBattleAccount();

	const [userNFTs, setUserNFTs] = useState(undefined);
	const [userNFTsInBattle, setUserNFTsInBattle] = useState(undefined);
	const [totalNFTElf, setTotalNFTElf] = useState(0);
	const [totalNFTInBattleElf, setTotalNFTinBattleElf] = useState(0);

	useEffect(() => {
		if (account && account.ethemerals.length > 0) {
			setUserNFTs(account.ethemerals);
		}
	}, [account]);

	useEffect(() => {
		if (accountEternalBattle && account) {
			let nftsInBattle = [];
			accountEternalBattle.ethemerals.forEach((nft) => {
				if (nft.previousOwner.id === account.id) {
					nftsInBattle.push(nft);
				}
			});
			setUserNFTsInBattle(nftsInBattle);
		}
	}, [accountEternalBattle, account]);

	//57656
	useEffect(() => {
		if (userNFTs) {
			let nftRewards = 0;
			if (userNFTs.length > 0)
				userNFTs.forEach((nft) => {
					nftRewards += parseInt(nft.rewards);
				});
			setTotalNFTElf(nftRewards);
		}
	}, [userNFTs]);

	useEffect(() => {
		if (userNFTsInBattle) {
			let nftRewards = 0;

			if (userNFTsInBattle.length > 0)
				userNFTsInBattle.forEach((nft) => {
					nftRewards += parseInt(nft.rewards);
				});
			setTotalNFTinBattleElf(nftRewards);
		}
	}, [userNFTsInBattle]);

	return (
		<>
			<div className="h-28 px-4 m-4 relative bg-customBlue-dark">
				<div className="flex vertical-center items-center">
					<div className="pt-1 pr-2">
						<img width="20" height="20" alt="elf logo" src={Images.logoELF} />
					</div>
					<div>
						<span className="text-2xl text-white">{account && account.elfBalance > 0 ? formatELF(account.elfBalance) : 'ZERO'}</span>
						<span className="text-brandColor text-2xl"> ELF</span>
					</div>
				</div>
				<div className="flex text-xs sm:text-sm text-white py-2 justify-between">
					<p>Available</p>
					{balance && <p className="text-right">{formatETH(balance, 6)} ETH</p>}
				</div>

				{/* <a href={Links.UNISWAP} target="_blank" rel="noreferrer" className="text-xs sm:text-sm text-gray-200 py-2 absolute bottom-0 hover:text-white">
					Trade on Uniswap
				</a> */}
			</div>
			<div className="p-4 text-black">
				<p className="text-lg">Claimable ELF</p>
				<p className="text-xs text-gray-700">Ethemerals on stand by: {totalNFTElf > 0 ? ` ${totalNFTElf}` : 'ZERO'}</p>
				<p className="text-xs text-gray-700">Ethemerals in Battle: {totalNFTInBattleElf > 0 ? ` ${totalNFTInBattleElf}` : 'ZERO'} (recorded before entering)</p>
				<p className="text-lg py-2 text-center">Total: {totalNFTElf + totalNFTInBattleElf} ELF Available to Claim</p>
			</div>
		</>
	);
};

export default UserELF;
