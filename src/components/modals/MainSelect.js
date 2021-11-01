import useUserAccount from '../../hooks/useUserAccount';

const MainSelect = ({ toggle }) => {
	const { mainIndex, mutateUser, userNFTs, account } = useUserAccount();

	const selectMain = (index) => {
		if (account) {
			mutateUser.mutate({ address: account.id, main: userNFTs[index].id });
			toggle();
		}
	};

	return (
		<>
			<div className="w-full h-full absolute top-0 animate-fadeOnFast z-40 overflow-visible">
				<div className="center shadow-xl rounded">
					<table className=" bg-customBlue-dark text-black mx-auto w-full">
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
										className={`border-b border-gray-200 text-left ${currentMain === index ? ' bg-pink-300' : ' bg-blue-100 hover:bg-white'} cursor-pointer`}
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

export default MainSelect;
