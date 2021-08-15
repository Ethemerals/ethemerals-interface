import { useEffect, useState } from 'react';
import Images from '../../constants/Images';
import Links from '../../constants/Links';

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
			<div className="h-28 border border-gray-700 bg-gray-900 m-4 relative">
				<div className="flex center items-center justify-center">
					<div className="px-2 pt-1">
						<img width="24" height="24" alt="Preview of current Ethemeral" src={Images.logoELF} />
					</div>
					<div>
						<span className="text-3xl">{account && account.elfBalance > 0 ? formatELF(account.elfBalance) : 'ZERO'}</span>
						<span className="text-brandColor text-3xl"> ELF</span>
					</div>
				</div>
				<div className="flex text-xs sm:text-sm text-gray-400 py-2 px-4">
					<p>Available:</p>
					<p className="flex-grow"></p>
					{balance && <p className="text-right">{formatETH(balance, 6)} ETH</p>}
				</div>

				<a href={Links.UNISWAP} target="_blank" rel="noreferrer" className="text-xs sm:text-sm text-gray-400 py-2 px-4 absolute bottom-0 w-full hover:text-gray-200">
					Trade on Uniswap
				</a>
			</div>
			<div className="p-4">
				<p className="text-lg">Claimable ELF</p>
				<p className="text-xs text-gray-400">Ethemerals on stand by: {totalNFTElf > 0 ? ` ${totalNFTElf}` : 'ZERO'}</p>
				<p className="text-xs text-gray-400">Ethemerals in Battle: {totalNFTInBattleElf > 0 ? ` ${totalNFTInBattleElf}` : 'ZERO'} (recorded before entering)</p>
				<p className="text-lg py-2 text-center">Total: {totalNFTElf + totalNFTInBattleElf} ELF Tokens</p>
			</div>
		</>
	);
};

export default UserELF;
