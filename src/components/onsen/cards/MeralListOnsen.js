import { getTypeFromId } from '../../../hooks/useMeralUtils';

import { getOnsenChange } from '../../../hooks/useOnsen';

const MeralIcon = ({ nft, select }) => {
	let type = getTypeFromId(nft.meralId);

	const { xp, hp, elf } = getOnsenChange(nft);

	return (
		<div onClick={() => select(nft.meralId)} className="w-24 h-24 bg-yellow-50 m-2 border border-black text-xs hover:bg-yellow-400 cursor-pointer">
			<p>
				type:{nft.type} / {nft.tokenId}
			</p>

			<p>
				HP: {nft.hp + hp} {hp > 0 && <span className="text-green-700">{` (+${hp})`}</span>}
			</p>
			<p>
				XP: {nft.xp + xp} {xp > 0 && <span className="text-green-700">{` (+${xp})`}</span>}
			</p>
			<p>
				ELF: {nft.elf + elf} {elf > 0 && <span className="text-green-700">{` (+${elf})`}</span>}
			</p>
			{type === 1 && <p>{nft.coin}</p>}
		</div>
	);
};

const MeralListOnsen = ({ nfts, select }) => {
	return <div className="flex-wrap flex">{nfts && nfts.length > 0 && nfts.map((nft) => <MeralIcon key={nft.meralId} nft={nft} select={select} />)}</div>;
};
export default MeralListOnsen;
