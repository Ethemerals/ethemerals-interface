import MeralIconLarge from './MeralIconLarge';

const MeralListWildsLarge = ({ nfts, select, buttonActions }) => {
	return <div className="flex-wrap flex">{nfts && nfts.length > 0 && nfts.map((nft) => <MeralIconLarge key={nft.meralId} nft={nft} select={select} buttonActions={buttonActions} />)}</div>;
};
export default MeralListWildsLarge;
