import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Images from '../../constants/Images';

import { shortenAddress, formatELF, formatETH } from '../../utils';
import useLocalUser from '../../hooks/useLocalUser';

import UserAccount from './UserAccount';
import UserELF from './UserElf';
import UserNFTs from './UserNFTs';

const UserModal = ({ toggle, selected, account }) => {
	const [localUser, updateLocalUser] = useLocalUser();
	const [NFTs, setNFTs] = useState([]);
	const [mainID, setMainID] = useState(undefined);
	const [mainIndex, setMainIndex] = useState(undefined);

	useEffect(() => {
		if (account && account.ethemerals.length > 0) {
			setNFTs(account.ethemerals);
		}
	}, [account]);

	useEffect(() => {
		if (localUser && account) {
			setMainID(localUser[account.id].main);
		}
	}, [localUser]);

	useEffect(() => {
		if (mainID) {
			NFTs.forEach((nft, index) => {
				if (nft.id === mainID) {
					setMainIndex(index);
				}
			});
		}
	}, [mainID]);

	const selectMain = (index) => {
		const _localUser = localUser[account.id];
		updateLocalUser({
			[account.id]: {
				..._localUser,
				main: NFTs[index].id,
			},
		});
		console.log(_localUser);
		console.log(index);
	};

	return (
		<>
			<div className="w-full h-full flex justify-center fixed top-0 left-0 animate-fadeOnFast">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 z-30 bg-opacity-40 bg-black"></div>
				<div className=" w-11/12 max-w-2xl min-w-min center overflow-hidden z-40 shadow-xl rounded">
					<table className="bg-gray-900 text-gray-200 mx-auto w-full">
						<thead>
							<tr className="text-left border-b border-gray-300">
								<th className="px-4 py-2">ID</th>
								<th className="px-4 py-2">Name</th>
								<th className="px-4 py-2">Subclass</th>
								<th className="px-4 py-2">Battles</th>
								<th className="px-4 py-2">ELF</th>
								<th className="px-4 py-2">HP</th>
							</tr>
						</thead>
						<tbody>
							{NFTs.map((nft, index) => {
								let currentMain = -1;
								if (index === mainIndex) {
									currentMain = index;
								}
								return (
									<tr
										key={index}
										onClick={() => selectMain(index)}
										className={`border-b border-gray-600 text-left ${currentMain === index ? ' bg-indigo-800' : 'bg-gray-700'} hover:bg-gray-500 cursor-pointer`}
									>
										<th className="px-4 py-2 font-light">#{nft.id}</th>
										<th className="px-4 py-2">{nft.metadata.coin.slice(0, 30)}</th>
										<th className="px-4 py-2">{nft.metadata.subClass}</th>
										<th className="px-4 py-2">{nft.scorecard.battles}</th>
										<th className="px-4 py-2">{formatELF(nft.rewards)}</th>
										<th className="px-4 py-2">{nft.score}</th>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};

export default UserModal;
