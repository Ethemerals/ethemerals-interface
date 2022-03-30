import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useEternalBattleAccount } from '../../../hooks/useEternalBattle';
import { getTokenIdFromId } from '../../../hooks/useMeralsUtils';
import NFTInventoryCard from '../../ethemerals/cards/NFTInventoryCard';
import { useUserAccount } from '../../../hooks/useUser';
import MeralThumbnail from '../../ethemerals/cards/MeralThumbnail';
import { useHistory } from 'react-router-dom';
import PetsThumbnail from '../../ethemerals/cards/PetsThumbnail';

const UserInventory = ({ toggle }) => {
	const history = useHistory();

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
				setNFTInBattleShortList(nftsInBattle.slice(0, 8));
			}
		}
	}, [accountEternalBattle, address]);

	useEffect(() => {
		if (userMerals && userMerals.length > 0) {
			setMeralShortList(userMerals.slice(0, 8));
		}
		if (userPets && userPets.length > 0) {
			setPetShortList(userPets.slice(0, 8));
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

	const selectAndToggle = async (id) => {
		toggle();
		history.push(`/ethemeral/${getTokenIdFromId(id)}`);
	};

	const selectPets = async (id) => {
		toggle();
		history.push(`/pet/${id}`);
	};

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
			<div className="flex pr-2 text-xs font-bold items-center text-gray-600">
				<p onClick={() => setSelectedTab(0)} className={`${selectedTab === 0 ? 'bg-customBlue-pale' : 'text-gray-400 cursor-pointer hover:text-gray-600'} p-2 rounded-t-lg`}>
					ETHEMERALS <span>({userMerals ? userMerals.length : 0})</span>
				</p>
				<p onClick={() => setSelectedTab(2)} className={`${selectedTab === 2 ? 'bg-customBlue-pale' : 'text-gray-400 cursor-pointer hover:text-gray-600'} p-2 rounded-t-lg`}>
					PETS <span>({userPets ? userPets.length : 0})</span>
				</p>
				<p onClick={() => setSelectedTab(1)} className={`${selectedTab === 1 ? 'bg-customBlue-pale' : 'text-gray-400 cursor-pointer hover:text-gray-600'} p-2 rounded-t-lg`}>
					IN BATTLE <span>({meralsInBattle ? meralsInBattle.length : 0})</span>
				</p>
			</div>

			<div className="h-full bg-customBlue-pale pt-6">
				{selectedTab === 0 && (
					<div className="flex flex-wrap justify-center">
						{meralShortList.map((nft) => (
							<MeralThumbnail key={nft.meralId} nft={nft} select={selectAndToggle} />
						))}
					</div>
				)}
				{selectedTab === 1 && (
					<div className="flex flex-wrap justify-center">
						{NFTInBattleShortList.map((nft) => (
							<MeralThumbnail key={nft.meralId} nft={nft} select={selectAndToggle} />
						))}
					</div>
				)}
				{selectedTab === 2 && (
					<div className="flex flex-wrap justify-center">
						{petShortList.map((nft) => (
							<PetsThumbnail key={nft.id} nft={nft} select={selectPets} />
						))}
					</div>
				)}
			</div>
		</>
	);
};

export default UserInventory;
