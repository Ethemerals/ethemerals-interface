import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useEternalBattleAccount } from '../../../hooks/useEternalBattle';
import { useMeralsUtils } from '../../../hooks/useMeralsUtils';
import NFTInventoryCard from '../../ethemerals/cards/NFTInventoryCard';
import { useUserAccount } from '../../../hooks/useUser';
import { getMeralImages, useMeralDataById } from '../../../hooks/useMerals';
import { getIdFromType } from '../../../hooks/useMeralsUtils';
import { getPetImages, getPetTypePallet } from '../../../hooks/usePets';

const NFTLink = ({ nft, toggle }) => {
	const { elements } = useMeralsUtils();
	let tokenId = nft.id;
	const [color, setColor] = useState(undefined);
	const { currentColor } = useMeralDataById(getIdFromType(1, tokenId));

	useEffect(() => {
		if (currentColor !== undefined) {
			setColor(currentColor);
		}
	}, [currentColor]);

	if (!nft || color === undefined) {
		return null;
	}

	return (
		<Link to={`/ethemeral/${tokenId}`}>
			<div onClick={toggle} style={{ backgroundColor: elements[nft.element].color }} className="flex w-74 h-74 rounded hover:shadow-lg mx-auto my-1 relative">
				<div className="absolute top-0 left-0">
					<img className="" src={getMeralImages(nft.cmId, color).thumbnail} alt="" />
				</div>
				<span className="flex-grow h-full"></span>
				<span className="text-xs font-bold text-white z-10 bg-black bg-opacity-30 w-full absolute bottom-0 text-right">#{tokenId.toString().padStart(4, '0')}</span>
			</div>
		</Link>
	);
};

const NFTPetLink = ({ nft, toggle }) => {
	const bgImg = getPetImages(nft.baseId).preview; // TODO PET

	return (
		<Link to={`/pet/${nft.id}`}>
			<div onClick={toggle} style={{ backgroundColor: getPetTypePallet(nft) }} className="flex w-74 h-74 rounded hover:shadow-lg mx-auto my-1 relative overflow-hidden">
				<div className="absolute top-0 left-0">
					<img className="" src={bgImg} alt="" />
				</div>
				<span className="flex-grow h-full"></span>
				<span className="text-xs font-bold text-white z-10 bg-black bg-opacity-30 w-full absolute bottom-0 text-right">#{nft.id.toString().padStart(4, '0')}</span>
			</div>
		</Link>
	);
};

const UserInventory = ({ toggle }) => {
	const { mainIndex, userMerals, userPets, address } = useUserAccount();
	const { accountEternalBattle } = useEternalBattleAccount();
	const [userMainMeral, serUserMainMeral] = useState(undefined);

	const [meralShortList, setMeralShortList] = useState([]);
	const [petShortList, setPetShortList] = useState([]);
	const [meralsInBattle, setNFTInBattle] = useState(0);
	const [NFTInBattleShortList, setNFTInBattleShortList] = useState([]);
	const [selectedTab, setSelectedTab] = useState(0);

	useEffect(() => {
		if (accountEternalBattle && address) {
			let nftsInBattle = [];
			accountEternalBattle.merals.forEach((nft) => {
				if (nft.previousOwner.id.toLowerCase() === address.toLowerCase()) {
					nftsInBattle.push(nft);
				}
			});
			if (nftsInBattle.length > 0) {
				setNFTInBattle(nftsInBattle);
			}

			if (nftsInBattle.length > 0) {
				setNFTInBattleShortList(nftsInBattle.slice(0, 10));
			}
		}
	}, [accountEternalBattle, address]);

	useEffect(() => {
		if (userMerals && userMerals.length > 0) {
			setMeralShortList(userMerals.slice(0, 10));
		}
		if (userPets && userPets.length > 0) {
			setPetShortList(userPets.slice(0, 10));
		}
		if (userMerals && userMerals.length > 0 && mainIndex >= 0) {
			try {
				let _userNFT = userMerals[mainIndex];
				serUserMainMeral(_userNFT);
			} catch (error) {
				console.log(error);
			}
		}
	}, [mainIndex, userMerals, userPets]);

	return (
		<>
			<div className="h-28">
				{userMerals && userMainMeral ? (
					<NFTInventoryCard key={userMainMeral.tokenId} nft={userMainMeral} />
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
					ETHEMERALS <span>({userMerals ? userMerals.length : 0})</span>
				</p>
				<p onClick={() => setSelectedTab(2)} className={`${selectedTab === 2 ? 'bg-customBlue-pale' : 'text-gray-400 cursor-pointer hover:text-gray-600'} p-2`}>
					PETS <span>({userPets ? userPets.length : 0})</span>
				</p>
				<p onClick={() => setSelectedTab(1)} className={`${selectedTab === 1 ? 'bg-customBlue-pale' : 'text-gray-400 cursor-pointer hover:text-gray-600'} p-2`}>
					IN BATTLE <span>({meralsInBattle ? meralsInBattle.length : 0})</span>
				</p>
			</div>

			<div className="p-2 h-full bg-customBlue-pale">
				{selectedTab === 0 && (
					<div className="grid grid-cols-5">
						{meralShortList.map((nft) => (
							<NFTLink key={nft.id} nft={nft} toggle={toggle} />
						))}
					</div>
				)}
				{selectedTab === 1 && (
					<div className="grid grid-cols-5">
						{NFTInBattleShortList.map((nft) => (
							<NFTLink key={nft.id} nft={nft} toggle={toggle} />
						))}
					</div>
				)}
				{selectedTab === 2 && (
					<div className="grid grid-cols-5">
						{petShortList.map((nft) => (
							<NFTPetLink key={nft.id} nft={nft} toggle={toggle} />
						))}
					</div>
				)}
			</div>
		</>
	);
};

export default UserInventory;
