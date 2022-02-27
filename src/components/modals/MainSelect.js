import { getSubclassInfo } from '../../hooks/useNFTUtils';
import { useUser, useUserAccount } from '../../hooks/useUser';

const MainSelect = ({ toggle }) => {
	const { mainIndex, userMerals } = useUserAccount();
	const { setUserData, user } = useUser();

	const selectMain = async (index) => {
		if (userMerals && user) {
			setUserData({ meralMainId: parseInt(userMerals[index].meralId) });
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
								<th className="px-2 py-1 text-sm font-normal">ELF</th>
								<th className="px-2 py-1 text-sm font-normal">HP</th>
							</tr>
						</thead>
						<tbody>
							{userMerals.map((nft, index) => {
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
										<th className="px-2 py-1 text-sm">{nft.tokenId.toString().padStart(4, '0')}</th>
										<th className="px-2 py-1 text-sm">{nft.name.slice(0, 30)}</th>
										<th className="px-2 py-1 text-sm">{getSubclassInfo(nft.subclass).name}</th>
										<th className="px-2 py-1 text-sm">{`${nft.atk}/${nft.def}/${nft.spd}`}</th>
										<th className="px-2 py-1 text-sm">{nft.elf}</th>
										<th className="px-2 py-1 text-sm">{nft.hp}</th>
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
