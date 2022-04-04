import MeralThumbnail from '../../ethemerals/cards/MeralThumbnail';

const MeralList = ({ nfts, select }) => {
	return <div className="flex-wrap flex gap-6 m-2">{nfts && nfts.length > 0 && nfts.map((nft) => <MeralThumbnail key={nft.meralId} nft={nft} select={select} />)}</div>;
};
export default MeralList;
