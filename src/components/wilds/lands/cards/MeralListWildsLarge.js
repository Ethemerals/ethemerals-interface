import { getTypeFromId } from '../../../../hooks/useMeralUtils';

const MeralIcon = ({ nft, select }) => {
	let type = getTypeFromId(nft.meralId);
	return (
		<div onClick={() => select(nft.meralId)} className="w-44 h-72 bg-yellow-50 m-2 border border-black text-xs hover:bg-yellow-400 cursor-pointer">
			<p>
				type:{nft.type} / {nft.tokenId}
			</p>

			<p>HP {nft.hp}</p>
			<p>XP {nft.xp}</p>
			<p>ELF {nft.elf}</p>
			<p>atk {nft.atk}</p>
			<p>def {nft.def}</p>
			<p>spd {nft.spd}</p>
			{type === 1 && <p>{nft.coin}</p>}
		</div>
	);
};

const MeralListWildsLarge = ({ nfts, select }) => {
	return <div className="flex-wrap flex">{nfts && nfts.length > 0 && nfts.map((nft) => <MeralIcon key={nft.meralId} nft={nft} select={select} />)}</div>;
};
export default MeralListWildsLarge;
