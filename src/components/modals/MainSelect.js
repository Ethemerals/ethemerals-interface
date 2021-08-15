import useUserAccount from '../../hooks/useUserAccount';

import { formatELF } from '../../utils';

const UserModal = ({ toggle }) => {
	const { mainIndex, mutateUser, userNFTs, account } = useUserAccount();

	const selectMain = (index) => {
		if (account) {
			mutateUser.mutate({ address: account.id, main: userNFTs[index].id });
			toggle();
		}
	};

	return (
		<>
			<div className="w-full h-full flex justify-center fixed top-0 left-0 animate-fadeOnFast">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 z-30 bg-opacity-40 bg-black"></div>
				<div className=" w-11/12 max-w-2xl min-w-min center overflow-hidden z-40 shadow-xl rounded">
					<table className=" bg-indigo-900 text-black mx-auto w-full">
						<thead>
							<tr className="text-left border-b border-black text-white">
								<th className="px-2 py-1 text-sm font-normal">ID #</th>
								<th className="px-2 py-1 text-sm font-normal">Name</th>
								<th className="px-2 py-1 text-sm font-normal">Subclass</th>
								<th className="px-2 py-1 text-sm font-normal">ATK/DEF/SPD</th>
								<th className="px-2 py-1 text-sm font-normal">Battles</th>
								<th className="px-2 py-1 text-sm font-normal">ELF</th>
								<th className="px-2 py-1 text-sm font-normal">HP</th>
							</tr>
						</thead>
						<tbody>
							{userNFTs.map((nft, index) => {
								let currentMain;
								if (index === mainIndex) {
									currentMain = index;
								}
								return (
									<tr
										key={index}
										onClick={() => selectMain(index)}
										className={`border-b border-gray-200 text-left ${currentMain === index ? ' bg-pink-400' : 'bg-brandColor-blue hover:bg-pink-200'} cursor-pointer`}
									>
										<th className="px-2 py-1 text-sm">{nft.id.padStart(4, '0')}</th>
										<th className="px-2 py-1 text-sm">{nft.metadata.coin.slice(0, 30)}</th>
										<th className="px-2 py-1 text-sm">{nft.metadata.subClass}</th>
										<th className="px-2 py-1 text-sm">{`${nft.atk}/${nft.def}/${nft.spd}`}</th>
										<th className="px-2 py-1 text-sm">{nft.scorecard.battles}</th>
										<th className="px-2 py-1 text-sm">{nft.rewards}</th>
										<th className="px-2 py-1 text-sm">{nft.score}</th>
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
