import { useMeralsUtils } from '../../../hooks/useMeralsUtils';
import { getMeralImages } from '../../../hooks/useMerals';

const CloseSVG = () => (
	<svg width="8" height="8" viewBox="0 0 50 49" fill="none" xmlns="http://www.w3.org/2000/svg">
		<line x1="5.65685" y1="4" x2="45" y2="43.3431" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
		<line x1="5" y1="43.3431" x2="44.3431" y2="4" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
	</svg>
);

const MeralThumbnail = ({ nft, handleRemove }) => {
	const { elements } = useMeralsUtils();

	if (!nft) {
		return (
			<div style={{ width: '74px', height: '74px' }} className="relative">
				loading
			</div>
		);
	}

	return (
		<div onClick={handleRemove} style={{ width: '74px', height: '74px', backgroundColor: elements[nft.element].color }} className="relative shadow-md cursor-pointer hover:shadow-lg overflow-hidden">
			<img style={{ width: '104px', height: '104px', objectFit: 'cover' }} src={getMeralImages(nft.cmId).preview} alt="" className="object-cover object-top" />
			<span className="text-xs font-bold text-white z-10 bg-black hover:bg-red-700 bg-opacity-50 w-full absolute bottom-0 text-left">
				#{nft.tokenId.toString().padStart(4, '0')}
				<span className="text-white absolute bottom-0 right-0 p-1 hover:bg-red-600 rounded-md z-20">
					<CloseSVG />
				</span>
			</span>
		</div>
	);
};

export default MeralThumbnail;
