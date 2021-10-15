import { useState, useEffect } from 'react';
import { useGQLQuery } from '../hooks/useGQLQuery';
import { GET_NFTS_FILTERED } from '../queries/Subgraph';
import NFTPreviewCard from '../components/NFTPreviewCard';
import EquipablePreviewCard from '../components/EquipablePreviewCard';
import { useHistory, useParams } from 'react-router-dom';
import { useAllColors } from '../hooks/useColorTraits';
import useUserAccount from '../hooks/useUserAccount';
import { useEternalBattleAccount } from '../hooks/useEternalBattle';

const NFTMC = ({ allColors }) => {
	const { data, status } = useGQLQuery('nfts_mc', GET_NFTS_FILTERED, { refetchOnMount: false });
	const [nfts, setNfts] = useState([]);

	useEffect(() => {
		if (status === 'success' && data && data.ethemerals) {
			setNfts(data.ethemerals);
		}
	}, [status, data]);

	return nfts.map((nft, index) => <NFTPreviewCard key={index} nft={nft} color={allColors[nft.id]} />);
};

const Dashboard = () => {
	const { sort } = useParams();
	const history = useHistory();

	const { account, mainIndex, userNFTs } = useUserAccount();
	const { accountEternalBattle } = useEternalBattleAccount();

	const { allColors } = useAllColors();
	const [aeIsLoading, setAeIsLoading] = useState(true);

	const [merals, setMerals] = useState([]);
	const [pets, setPets] = useState([]);
	const [meralsInBattle, setMeralsInBattle] = useState([]);
	const [selectedTab, setSelectedTab] = useState(0);

	const [sortBy, setSortBy] = useState(2);

	useEffect(() => {
		if (account && userNFTs.length > 0) {
			setMerals(userNFTs);
		}
		if (account && account.pets.length > 0) {
			setPets(account.pets);
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
				setMeralsInBattle(inBattle);
			}
		}
	}, [accountEternalBattle, account]);

	useEffect(() => {
		if (allColors && allColors.length > 0) {
			setAeIsLoading(false);
		}
	}, [allColors]);

	return (
		<div className="scrollbar_pad">
			<div className="page_bg"></div>
			<div className="text-sm font-bold text-white sm:hidden mt-4 text-center">SORT BY</div>
			<div className="flex items-center mx-auto mt-2 sm:mt-10 text-sm sm:text-base justify-center">
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
			</div>
			<div style={{ height: '54px' }}></div>

			<div className="flex flex-wrap mx-auto justify-center">
				<div className="flex flex-wrap mx-auto justify-center">
					{selectedTab === 0 && merals && allColors && merals.map((nft, index) => <NFTPreviewCard key={index} nft={nft} color={allColors[nft.id]} />)}
					{selectedTab === 1 && pets && pets.map((nft, index) => <EquipablePreviewCard key={index} nft={nft} />)}
				</div>
			</div>

			<div className="h-40"></div>
		</div>
	);
};

export default Dashboard;
