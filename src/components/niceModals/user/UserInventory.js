import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useEternalBattleL1Account } from '../../../hooks/useEternalBattleL1';
import { getTokenIdFromId } from '../../../hooks/useMeralsUtils';
import NFTInventoryCard from '../../ethemerals/cards/NFTInventoryCard';
import { useUserAccount } from '../../../hooks/useUser';
import MeralThumbnail from '../../ethemerals/cards/MeralThumbnail';
import { useHistory } from 'react-router-dom';
import PetsThumbnail from '../../ethemerals/cards/PetsThumbnail';

const UserInventory = ({ toggle }) => {
	const history = useHistory();

	const { mainIndex, allMerals, stakedMerals, userPets } = useUserAccount();
	const [userMainMeral, serUserMainMeral] = useState(undefined);

	const [meralShortList, setMeralShortList] = useState([]);
	const [petShortList, setPetShortList] = useState([]);
	const [stakedShortList, setStakedShortList] = useState([]);
	const [selectedTab, setSelectedTab] = useState(0);

	useEffect(() => {
		if (stakedMerals && stakedMerals.length > 0) {
			setStakedShortList(stakedMerals.slice(0, 8));
		}
	}, [stakedMerals]);

	useEffect(() => {
		if (allMerals && allMerals.length > 0) {
			setMeralShortList(allMerals.slice(0, 8));
		}
		if (userPets && userPets.length > 0) {
			setPetShortList(userPets.slice(0, 8));
		}
		if (allMerals && allMerals.length > 0 && mainIndex >= 0) {
			try {
				let _userNFT = allMerals[mainIndex];
				serUserMainMeral(_userNFT);
			} catch (error) {
				console.log(error);
			}
		}
	}, [mainIndex, allMerals, userPets]);

	const selectAndToggle = async (id) => {
		toggle();
		history.push(`/ethemeral/${getTokenIdFromId(id)}`);
	};

	const selectPets = async (id) => {
		toggle();
		history.push(`/pet/${id}`);
	};

	const styleTabActive = {
		color: '#4682B4',
		backgroundColor: 'hsla(213, 40%, 80%)',
	};

	const styleTabInactive = {
		color: '#73abbf',
		cursor: 'pointer',
	};

	return (
		<>
			<div className="h-28">
				{allMerals && userMainMeral ? (
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
				<p style={selectedTab === 0 ? styleTabActive : styleTabInactive} onClick={() => setSelectedTab(0)} className="p-2 rounded-t-lg">
					ETHEMERALS <span>({allMerals ? allMerals.length : 0})</span>
				</p>
				<p style={selectedTab === 2 ? styleTabActive : styleTabInactive} onClick={() => setSelectedTab(2)} className="p-2 rounded-t-lg">
					PETS <span>({userPets ? userPets.length : 0})</span>
				</p>
				<p style={selectedTab === 1 ? styleTabActive : styleTabInactive} onClick={() => setSelectedTab(1)} className="p-2 rounded-t-lg">
					IN BATTLE <span>({stakedMerals ? stakedMerals.length : 0})</span>
				</p>
			</div>

			<div className="h-full bg-customBlue-pale pt-6">
				{selectedTab === 0 && (
					<div className="flex flex-wrap justify-center gap-4">
						{meralShortList.map((nft) => (
							<MeralThumbnail key={nft.meralId} nft={nft} select={selectAndToggle} />
						))}
					</div>
				)}
				{selectedTab === 1 && (
					<div className="flex flex-wrap justify-center gap-4">
						{stakedShortList.map((nft) => (
							<MeralThumbnail key={nft.meralId} nft={nft} select={selectAndToggle} />
						))}
					</div>
				)}
				{selectedTab === 2 && (
					<div className="flex flex-wrap justify-center gap-4">
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
