import { Link, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useUserAccount from '../../hooks/useUserAccount';
import { useEternalBattleAccount } from '../../hooks/useEternalBattle';

import Images from '../../constants/Images';
import { useNFTUtils } from '../../hooks/useNFTUtils';
import { formatELF } from '../../utils';

const RankedStars = ({ amount }) => {
	const starSVG = (
		<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
			/>
		</svg>
	);

	let stars = new Array(amount).fill(0);

	return (
		<>
			{stars.map((star, index) => (
				<span key={index}>{starSVG}</span>
			))}
		</>
	);
};

const NFTLink = (nft, index, toggle, getImages) => {
	const bgImg = getImages(nft.metadata.id).thumbnail;

	return (
		<Link key={index} to={`/ethemeral/${nft.id}`}>
			<div onClick={toggle} className="flex w-74 h-74 bg-gray-500 rounded hover:bg-gray-600 mx-auto my-1 shadow-sm items-baseline relative">
				<div className="absolute top-0 left-0">
					<img className="" src={bgImg} alt="" />
				</div>
				<span className="flex-grow h-full"></span>
				<span className="text-sm font-bold text-gray-400 z-10">#{nft.id.padStart(4, '0')}</span>
			</div>
		</Link>
	);
};

const UserInventory = ({ toggle, toggleExtra }) => {
	const { account, mainIndex, userNFTs } = useUserAccount();
	const { accountEternalBattle } = useEternalBattleAccount();
	const { getNFTImages, parseScore } = useNFTUtils();
	const history = useHistory();

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

	const handleClick = () => {
		history.push(`/ethemeral/${userNFTs[mainIndex].id}`);
		toggle();
	};

	return (
		<>
			<div className="h-28 m-4">
				<div className="flex h-28 border border-gray-700">
					{userNFTs.length > 0 ? (
						<div className="flex-grow cursor-pointer bg-gray-900 relative overflow-hidden" style={{ backgroundImage: "url('https://ethemerals-media.s3.amazonaws.com/nft_preview_bg.jpg')" }}>
							<div className="left-0 absolute px-2 py-1 text-left text-sm font-bold z-10">
								<p>#{userNFTs[mainIndex].id.padStart(4, '0')}</p>
								<button onClick={toggleExtra} className="py-1 cursor-pointer text-xs hover:text-yellow-400 text-blue-400 transition duration-300">
									change
								</button>
							</div>

							{/* RIGHT BAR */}
							<div className="right-0 absolute p-2 text-right text-sm font-bold z-10">
								<div className="flex justify-end">
									<RankedStars amount={parseScore(userNFTs[mainIndex].score)} />
								</div>
								<p>{userNFTs[mainIndex].score} HP</p>
								<p>{formatELF(userNFTs[mainIndex].rewards)} ELF</p>
							</div>

							{/* BOTTOM BAR */}
							<div className="w-full bottom-0 absolute text-center bg-black bg-opacity-50 z-20">
								<span className="font-bold text-lg uppercase text-center">{userNFTs[mainIndex].metadata.coin}</span>
							</div>
							{/* MAIN IMAGE */}

							<div onClick={handleClick} className="absolute top-0 left-0 w-full h-28">
								<img className="" src={getNFTImages(userNFTs[mainIndex].metadata.id).inventory} alt="" />
							</div>
						</div>
					) : (
						<div className="flex-grow bg-gray-900 relative overflow-hidden text-center">
							<div className="center">
								<p>None active</p>
								<Link to="/">
									<p onClick={toggle} className="text-2xl cursor-pointer text-brandColor font-bold hover:text-yellow-400 transition duration-300">
										mint one now
									</p>
								</Link>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* INVENTORY TABS */}
			<div className="flex pr-2 pt-4 text-xs font-bold items-center">
				<p onClick={() => setSelectedTab(0)} className={`${selectedTab === 0 ? 'bg-gray-700 text-gray-100' : 'bg-gray-800 text-gray-500'} p-2 cursor-pointer hover:text-gray-100`}>
					ETHEMERALS <span>({account ? account.ethemerals.length : 0})</span>
				</p>
				<p onClick={() => setSelectedTab(1)} className={`${selectedTab === 1 ? 'bg-gray-700 text-gray-100' : 'bg-gray-800 text-gray-500'} p-2 cursor-pointer hover:text-gray-100`}>
					IN BATTLE <span>({NFTInBattle})</span>
				</p>
				<p onClick={() => setSelectedTab(2)} className={`${selectedTab === 2 ? 'bg-gray-700 text-gray-100' : 'bg-gray-800 text-gray-500'} p-2 cursor-pointer hover:text-gray-100`}>
					ITEMS (0)
				</p>
			</div>

			<div className="bg-gray-700 p-2 h-full">
				{account && selectedTab === 0 && <div className="grid grid-cols-5">{NFTShortList.map((nft, index) => NFTLink(nft, index, toggle, getNFTImages))}</div>}
				{account && selectedTab === 1 && <div className="grid grid-cols-5">{NFTInBattleShortList.map((nft, index) => NFTLink(nft, index, toggle, getNFTImages))}</div>}
				{account && selectedTab === 2 && <div></div>}
			</div>
		</>
	);
};

export default UserInventory;
