import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useUserAccount from '../../hooks/useUserAccount';
import { useEternalBattleAccount } from '../../hooks/useEternalBattle';

import { useNFTUtils } from '../../hooks/useNFTUtils';
import { useMeralImagePaths } from '../../hooks/useMeralImagePaths';

import NFTInventoryCard from '../NFTInventoryCard';

const NFTLink = ({ nft, toggle }) => {
	const { elements } = useNFTUtils();
	const { meralImagePaths } = useMeralImagePaths(nft.id);

	if (!meralImagePaths) {
		return null;
	}
	const bgImg = meralImagePaths.thumbnail;

	return (
		<Link to={`/ethemeral/${nft.id}`}>
			<div onClick={toggle} style={{ backgroundColor: elements[nft.bgId].color }} className="flex w-74 h-74 rounded hover:shadow-lg mx-auto my-1 relative">
				<div className="absolute top-0 left-0">
					<img className="" src={bgImg} alt="" />
				</div>
				<span className="flex-grow h-full"></span>
				<span className="text-xs font-bold text-white z-10 bg-black bg-opacity-30 w-full absolute bottom-0 text-right">#{nft.id.padStart(4, '0')}</span>
			</div>
		</Link>
	);
};

const getType = (nft) => {
	let stats = [nft.atk, nft.def, nft.spd];
	return stats.reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0);
};

const NFTPetLink = ({ nft, toggle, item = false }) => {
	const { getEquipmentImages, getEquipableTypePalette } = useNFTUtils();
	const bgImg = getEquipmentImages(nft.baseId, item).thumbnail;

	return (
		<Link to={`/equipable/${nft.id}`}>
			<div onClick={toggle} style={{ backgroundColor: getEquipableTypePalette(getType(nft)) }} className="flex w-74 h-74 rounded hover:shadow-lg mx-auto my-1 relative">
				<div className="absolute top-0 left-0">
					<img className="" src={bgImg} alt="" />
				</div>
				<span className="flex-grow h-full"></span>
				<span className="text-xs font-bold text-white z-10 bg-black bg-opacity-30 w-full absolute bottom-0 text-right">#{nft.id.padStart(4, '0')}</span>
			</div>
		</Link>
	);
};

const UserInventory = ({ toggle }) => {
	const { account, mainIndex, userNFTs } = useUserAccount();
	const { accountEternalBattle } = useEternalBattleAccount();

	const [userNFT, setUserNFT] = useState(undefined);
	const [stats, setStats] = useState([0, 0, 0]);

	const [NFTShortList, setNFTShortList] = useState([]);
	const [NFTPetShortList, setNFTPetShortList] = useState([]);
	const [NFTItemShortList, setNFTItemShortList] = useState([]);
	const [NFTInBattle, setNFTInBattle] = useState(0);
	const [NFTInBattleShortList, setNFTInBattleShortList] = useState([]);
	const [selectedTab, setSelectedTab] = useState(0);

	useEffect(() => {
		if (account && userNFTs.length > 0) {
			setNFTShortList(userNFTs.slice(0, 10));
		}
		if (account && account.pets.length > 0) {
			setNFTPetShortList(account.pets.slice(0, 10));
		}
		if (account && account.items.length > 0) {
			setNFTItemShortList(account.items.slice(0, 10));
		}
		if (userNFTs && userNFTs.length > 0) {
			let _userNFT = userNFTs[mainIndex];
			setUserNFT(_userNFT);

			setStats([_userNFT.atk, _userNFT.def, _userNFT.spd]);
		}
	}, [account, userNFTs, mainIndex]);

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
			<div className="h-28">
				{userNFTs.length > 0 && userNFT ? (
					<NFTInventoryCard nft={userNFT} stats={stats} />
				) : (
					<div className="flex h-28">
						<div className="flex-grow relative overflow-hidden text-center bg-customBlue-dark">
							<div className="center">
								<p>None active</p>
								<Link to="/">
									<p onClick={toggle} className="text-2xl cursor-pointer text-white font-bold hover:text-blue-300 transition duration-300">
										mint one now
									</p>
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* INVENTORY TABS */}
			<div className="h-8"></div>
			<div className="flex pr-2 text-xs font-bold items-center text-customBlue-darker">
				<p onClick={() => setSelectedTab(0)} className={`${selectedTab === 0 ? 'bg-customBlue-pale' : 'text-gray-400 cursor-pointer hover:text-gray-600'} p-2`}>
					ETHEMERALS <span>({account ? account.ethemerals.length : 0})</span>
				</p>
				<p onClick={() => setSelectedTab(2)} className={`${selectedTab === 2 ? 'bg-customBlue-pale' : 'text-gray-400 cursor-pointer hover:text-gray-600'} p-2`}>
					PETS <span>({account ? account.pets.length : 0})</span>
				</p>
				<p onClick={() => setSelectedTab(3)} className={`${selectedTab === 3 ? 'bg-customBlue-pale' : 'text-gray-400 cursor-pointer hover:text-gray-600'} p-2`}>
					ITEMS <span>({account ? account.items.length : 0})</span>
				</p>
				<p onClick={() => setSelectedTab(1)} className={`${selectedTab === 1 ? 'bg-customBlue-pale' : 'text-gray-400 cursor-pointer hover:text-gray-600'} p-2`}>
					IN BATTLE <span>({NFTInBattle})</span>
				</p>
			</div>

			<div className="p-2 h-full bg-customBlue-pale">
				{account && selectedTab === 0 && (
					<div className="grid grid-cols-5">
						{NFTShortList.map((nft) => (
							<NFTLink key={nft.id} nft={nft} toggle={toggle} />
						))}
					</div>
				)}
				{account && selectedTab === 1 && (
					<div className="grid grid-cols-5">
						{NFTInBattleShortList.map((nft) => (
							<NFTLink key={nft.id} nft={nft} toggle={toggle} />
						))}
					</div>
				)}
				{account && selectedTab === 2 && (
					<div className="grid grid-cols-5">
						{NFTPetShortList.map((nft) => (
							<NFTPetLink key={nft.id} nft={nft} toggle={toggle} />
						))}
					</div>
				)}
				{account && selectedTab === 3 && (
					<div className="grid grid-cols-5">
						{NFTItemShortList.map((nft) => (
							<NFTPetLink key={nft.id} nft={nft} toggle={toggle} item={true} />
						))}
					</div>
				)}
			</div>
		</>
	);
};

export default UserInventory;
