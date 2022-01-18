import { useState, useEffect } from 'react';

import NFTPreviewCard from '../components/ethemerals/cards/NFTPreviewCard';
import EquipablePreviewCard from '../components/ethemerals/cards/EquipablePreviewCard';

import { useUserAccount } from '../hooks/useUser';
import { useEternalBattleAccount } from '../hooks/useEternalBattle';
import Preferences from '../components/Preferences';

const Dashboard = () => {
	const { account, userNFTs } = useUserAccount();
	const { accountEternalBattle } = useEternalBattleAccount();

	const [merals, setMerals] = useState([]);
	const [pets, setPets] = useState([]);
	const [meralsInBattle, setMeralsInBattle] = useState([]);
	const [selectedTab, setSelectedTab] = useState(0);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		if (account && userNFTs.length > 0) {
			setMerals(userNFTs);
		}
		if (account && account.pets.length > 0) {
			setPets(account.pets);
		}
	}, [account, userNFTs]);

	// useEffect(() => {
	// 	if (accountEternalBattle && account) {
	// 		let inBattle = [];
	// 		accountEternalBattle.ethemerals.forEach((nft) => {
	// 			if (nft.previousOwner.id === account.id) {
	// 				inBattle.push(nft);
	// 			}
	// 		});
	// 		if (inBattle.length > 0) {
	// 			setMeralsInBattle(inBattle);
	// 		}
	// 	}
	// }, [accountEternalBattle, account]);

	return (
		<div className="mt-20">
			<div className="page_bg"></div>
			<div className="text-sm font-bold text-white sm:hidden mt-4 text-center">SORT BY</div>
			<div className="w-full mt-2 mb-2 sm:mt-10 text-center font-bold text-xl ">DASHBOARD</div>
			<div className="flex items-center mx-auto text-sm sm:text-base justify-center">
				<button
					onClick={() => setSelectedTab(0)}
					className={`${selectedTab === 0 ? 'bg-indigo-500' : 'bg-indigo-300 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none`}
				>
					Merals
				</button>
				<button
					onClick={() => setSelectedTab(1)}
					className={`${selectedTab === 1 ? 'bg-indigo-500' : 'bg-indigo-300 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none`}
				>
					Pets
				</button>
				<button
					onClick={() => setSelectedTab(2)}
					className={`${selectedTab === 2 ? 'bg-indigo-500' : 'bg-indigo-300 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none`}
				>
					In Battle
				</button>
				<div className="w-6"></div>
				<button
					onClick={() => setSelectedTab(3)}
					className={`${selectedTab === 3 ? 'bg-purple-500' : 'bg-purple-300 hover:bg-yellow-400 transition duration-300'} py-1 px-2 mx-1 rounded focus:outline-none`}
				>
					User Preferences
				</button>
			</div>
			<div style={{ height: '54px' }}></div>

			{/* TODO SHOW MAIN */}
			<div className="flex flex-wrap mx-auto justify-center">
				<div className="flex flex-wrap mx-auto justify-center">
					{selectedTab === 0 && merals.map((nft) => <NFTPreviewCard key={nft.meralId} nft={nft} isFetching={false} />)}
					{selectedTab === 1 && pets && pets.map((nft) => <EquipablePreviewCard key={nft.id} nft={nft} />)}
					{selectedTab === 2 && meralsInBattle.map((nft) => <NFTPreviewCard key={nft.id} nft={nft} isFetching={false} />)}
					{selectedTab === 3 && <Preferences />}
				</div>
			</div>

			<div className="h-40"></div>
		</div>
	);
};

export default Dashboard;
