import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useUserAccount from '../../hooks/useUserAccount';
import { useEternalBattleAccount } from '../../hooks/useEternalBattle';

import Images from '../../constants/Images';

const NFTLink = (nft, index, toggle) => {
	return (
		<Link key={index} to={`/ethemeral/${nft.id}`}>
			<div onClick={toggle} className="flex w-74 h-74 bg-gray-700 rounded hover:bg-gray-600 mx-auto my-1 shadow-sm items-baseline">
				<span className="flex-grow h-full"></span>
				<span className="text-sm font-bold text-gray-400">#{nft.id.padStart(4, '0')}</span>
			</div>
		</Link>
	);
};

const UserInventory = ({ toggle, toggleExtra }) => {
	const { account, mainIndex, userNFTs } = useUserAccount();
	const { accountEternalBattle } = useEternalBattleAccount();

	const [NFTShortList, setNFTShortList] = useState([]);
	const [NFTInBattle, setNFTInBattle] = useState(0);
	const [NFTInBattleShortList, setNFTInBattleShortList] = useState([]);
	const [selectedTab, setSelectedTab] = useState(0);

	useEffect(() => {
		if (account && userNFTs.length > 0) {
			setNFTShortList(userNFTs.slice(0, 10));
		}
	}, [account, userNFTs]);

	useEffect(() => {
		if (accountEternalBattle && account) {
			let inBattle = [];
			accountEternalBattle.ethemerals.forEach((nft) => {
				if (nft.previousOwner.id === account.id) {
					inBattle.push(nft);
				}
			});
			if (inBattle.length > 0) {
				setNFTInBattle(inBattle.length);
				setNFTInBattleShortList(inBattle.slice(0, 10));
			}
		}
	}, [accountEternalBattle, account]);

	return (
		<>
			<div className="h-28 m-4">
				<div className="flex h-28">
					<div className={`${userNFTs.length > 1 ? 'w-2/4' : 'w-full'} h-full text-sm text-center border border-r-0 border-gray-700 bg-gray-900 relative`}>
						<div className="overflow-hidden center -my-3">
							<>
								{userNFTs.length > 0 ? (
									<>
										<p className="text-xl">#{userNFTs[mainIndex].id}</p>
										<p className="uppercase">{userNFTs[mainIndex].metadata.coin}</p>
									</>
								) : (
									<>
										<p>None active</p>
										<Link to="/">
											<p onClick={toggle} className="hover:text-blue-400 text-base cursor-pointer">
												Mint one now
											</p>
										</Link>
									</>
								)}
							</>
						</div>
						{userNFTs.length > 1 && (
							<div onClick={toggleExtra} className="cursor-pointer absolute bottom-0 w-full text-blue-700 hover:bg-gray-800">
								change main
							</div>
						)}
					</div>
					{userNFTs.length > 1 && (
						<div onClick={toggle} className="w-2/4 h-28 cursor-pointer border-gray-600 border border-l-0">
							<Link to={`/ethemeral/${userNFTs[mainIndex].id}`}>
								<img width="256" height="112" className="object-cover h-full" alt="Preview of current Ethemeral" src={Images.nftPreviewWide} />
							</Link>
						</div>
					)}
				</div>
			</div>

			{/* INVENTORY TABS */}
			<div className="flex pr-2 pt-4 text-xs font-bold items-center">
				<p onClick={() => setSelectedTab(0)} className={`${selectedTab === 0 ? 'bg-gray-900 text-gray-100' : 'bg-gray-800 text-gray-500'} p-2 cursor-pointer hover:text-gray-100`}>
					ETHEMERALS <span>({account ? account.ethemerals.length : 0})</span>
				</p>
				<p onClick={() => setSelectedTab(1)} className={`${selectedTab === 1 ? 'bg-gray-900 text-gray-100' : 'bg-gray-800 text-gray-500'} p-2 cursor-pointer hover:text-gray-100`}>
					IN BATTLE <span>({NFTInBattle})</span>
				</p>
				<p onClick={() => setSelectedTab(2)} className={`${selectedTab === 2 ? 'bg-gray-900 text-gray-100' : 'bg-gray-800 text-gray-500'} p-2 cursor-pointer hover:text-gray-100`}>
					ITEMS (0)
				</p>
			</div>

			<div className="bg-gray-900 p-2 h-full">
				{account && selectedTab === 0 && <div className="grid grid-cols-5">{NFTShortList.map((nft, index) => NFTLink(nft, index, toggle))}</div>}
				{account && selectedTab === 1 && <div className="grid grid-cols-5">{NFTInBattleShortList.map((nft, index) => NFTLink(nft, index, toggle))}</div>}
				{account && selectedTab === 2 && <div></div>}
			</div>
		</>
	);
};

export default UserInventory;
