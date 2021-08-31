import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useUserAccount from '../../hooks/useUserAccount';
import { useEternalBattleAccount } from '../../hooks/useEternalBattle';
import UserInventoryHero from './UserInventoryHero';
import { useNFTUtils } from '../../hooks/useNFTUtils';

const NFTLink = (nft, index, toggle, getImages, elements) => {
	const bgImg = getImages(nft.metadata.id).thumbnail;

	return (
		<Link key={index} to={`/ethemeral/${nft.id}`}>
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

const UserInventory = ({ toggle, toggleExtra }) => {
	const { account, mainIndex, userNFTs } = useUserAccount();
	const { accountEternalBattle } = useEternalBattleAccount();
	const { getNFTImages, elements } = useNFTUtils();

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
					{userNFTs.length > 0 ? (
						<UserInventoryHero userNFTs={userNFTs} mainIndex={mainIndex} toggle={toggle} toggleExtra={toggleExtra} />
					) : (
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
					)}
				</div>
			</div>

			{/* INVENTORY TABS */}
			<div className="h-8"></div>
			<div className="flex pr-2 text-xs font-bold items-center text-customBlue-darker">
				<p onClick={() => setSelectedTab(0)} className={`${selectedTab === 0 ? 'bg-customBlue-pale' : 'text-gray-400 cursor-pointer hover:text-gray-600'} p-2`}>
					ETHEMERALS <span>({account ? account.ethemerals.length : 0})</span>
				</p>
				<p onClick={() => setSelectedTab(1)} className={`${selectedTab === 1 ? 'bg-customBlue-pale' : 'text-gray-400 cursor-pointer hover:text-gray-600'} p-2`}>
					IN BATTLE <span>({NFTInBattle})</span>
				</p>
				<p onClick={() => setSelectedTab(2)} className={`${selectedTab === 2 ? 'bg-customBlue-pale' : 'text-gray-400 cursor-pointer hover:text-gray-600'} p-2`}>
					PETS (0)
				</p>
				<p onClick={() => setSelectedTab(3)} className={`${selectedTab === 3 ? 'bg-customBlue-pale' : 'text-gray-400 cursor-pointer hover:text-gray-600'} p-2`}>
					ITEMS (0)
				</p>
			</div>

			<div className="p-2 h-full bg-customBlue-pale">
				{account && selectedTab === 0 && <div className="grid grid-cols-5">{NFTShortList.map((nft, index) => NFTLink(nft, index, toggle, getNFTImages, elements))}</div>}
				{account && selectedTab === 1 && <div className="grid grid-cols-5">{NFTInBattleShortList.map((nft, index) => NFTLink(nft, index, toggle, getNFTImages, elements))}</div>}
				{account && selectedTab === 2 && <div></div>}
			</div>
		</>
	);
};

export default UserInventory;
