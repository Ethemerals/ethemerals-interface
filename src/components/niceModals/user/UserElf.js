import { useEffect, useState } from 'react';
import { useNativeBalance } from 'react-moralis';
import Images from '../../../constants/Images';
import { formatELF } from '../../../utils';
import { useEternalBattleL1Account } from '../../../hooks/useEternalBattleL1';
import { useUserAccount } from '../../../hooks/useUser';

const UserELF = () => {
	const { address, userMerals } = useUserAccount();
	const { data: balance } = useNativeBalance();

	const { accountEternalBattle } = useEternalBattleL1Account();

	const [userNFTsInBattle, setUserNFTsInBattle] = useState(undefined);
	const [totalNFTElf, setTotalNFTElf] = useState(0);
	const [totalNFTInBattleElf, setTotalNFTinBattleElf] = useState(0);

	let elfBalance = 0; // TODO

	useEffect(() => {
		if (accountEternalBattle && address) {
			let nftsInBattle = [];
			accountEternalBattle.merals.forEach((nft) => {
				if (nft.previousOwner.id.toLowerCase() === address.toLowerCase()) {
					nftsInBattle.push(nft);
				}
			});
			setUserNFTsInBattle(nftsInBattle);
		}
	}, [accountEternalBattle, address]);

	useEffect(() => {
		if (userMerals) {
			let nftElf = 0;
			if (userMerals.length > 0)
				userMerals.forEach((nft) => {
					if (nft.elf > 0) {
						nftElf += parseInt(nft.elf);
					}
				});
			setTotalNFTElf(nftElf);
		}
		return () => {
			setTotalNFTElf(undefined);
		};
	}, [userMerals]);

	useEffect(() => {
		if (userNFTsInBattle) {
			let nftElf = 0;

			if (userNFTsInBattle.length > 0)
				userNFTsInBattle.forEach((nft) => {
					if (nft.elf > 0) {
						nftElf += parseInt(nft.elf);
					}
				});
			setTotalNFTinBattleElf(nftElf);
		}
		return () => {
			setTotalNFTinBattleElf(undefined);
		};
	}, [userNFTsInBattle]);

	return (
		<>
			<div className="h-28 px-4 m-4 relative bg-customBlue-dark">
				<div className="flex vertical-center items-center">
					<div className="pt-1 pr-2">
						<img width="20" height="20" alt="elf logo" src={Images.logoELF} />
					</div>
					<div>
						<span className="text-2xl text-white">{address && elfBalance > 0 ? formatELF(elfBalance) : 'ZERO'}</span>
						<span className="text-brandColor text-2xl"> ELF</span>
					</div>
				</div>
				<div className="flex text-xs sm:text-sm text-white py-2 justify-between">
					<p>Available</p>
					{balance && <p className="text-right">{balance.formatted}</p>}
				</div>
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
