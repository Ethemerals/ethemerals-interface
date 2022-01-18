import { useNFTUtils } from '../../../hooks/useNFTUtils';
import { Links } from '../../../constants/Links';
import { Addresses } from '../../../constants/contracts/Addresses';
import { getPetBorderColor, getPetTypePallet } from '../../../hooks/usePetData';

const RankedStars = ({ amount }) => {
	const starSVG = (
		<svg width="20" height="20" fill="gold" stroke="goldenRod" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
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

const PetsPreviewCard = ({ nft }) => {
	const { getEquipmentImages } = useNFTUtils();

	if (!nft) {
		return <p>Loading</p>;
	}

	const openSeaURL = `${Links.OPENSEAS}/${Addresses.Equipables}/${nft.tokenId}`;

	return (
		<div
			// onClick={handleOnClick}
			style={{ borderColor: getPetBorderColor(nft.rarity), backgroundColor: 'hsl(186, 33%, 94%)', minWidth: '256px', maxWidth: '256px', maxHeight: '384px', minHeight: '384px' }}
			className="w-64 h-96 m-4 cursor-pointer bg-cover relative border-2 hover:shadow-2xl transition duration-300 rounded-lg"
		>
			{/* MAIN IMAGE */}
			<div className="absolute top-6 left-0">
				<a href={openSeaURL} target="blank" rel="noreferrer">
					<img className="" src={getEquipmentImages(nft.baseId).preview} alt="" />
				</a>
			</div>
			{/* TOP BAR */}
			<div className="flex p-1 absolute">
				<RankedStars amount={parseInt(nft.rarity)} />
			</div>

			{/* BOTTOM BAR */}
			<div className="w-full h-20 bottom-0 absolute overflow-hidden">
				<div className="w-full flex items-center mb-4">
					<span style={{ backgroundColor: getPetTypePallet(nft.mainclass) }} className="px-1 mx-1 text-sm font-bold rounded text-white">
						#{nft.tokenId.toString().padStart(4, '0')}
					</span>
					<div className="flex-grow"></div>
					<span className="text-xs font-bold white">STATS:</span>
					<span style={{ backgroundColor: 'hsla(350,40%,60%,1)' }} className="px-1 mx-1 text-sm font-bold rounded text-white">
						{nft.atk}
					</span>
					<span style={{ backgroundColor: 'hsla(250,40%,60%,1)' }} className="px-1 text-sm font-bold rounded text-white">
						{nft.def}
					</span>
					<span style={{ backgroundColor: 'hsla(180,40%,60%,1)' }} className="px-1 mx-1 text-sm font-bold rounded text-white">
						{nft.spd}
					</span>
				</div>

				<p className="text-center font-bold text-2xl text-black">{nft.name}</p>
			</div>
		</div>
	);
};

export default PetsPreviewCard;
