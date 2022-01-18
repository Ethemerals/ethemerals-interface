import { useDrag } from 'react-dnd';
import { ItemTypes } from '../utils/items';
import { useNFTUtils } from '../../../hooks/useNFTUtils';
import { getPetBorderColor, getPetTypePallet } from '../../../hooks/usePetData';

const PetDragableCard = ({ nft, owned, dropped }) => {
	const { getEquipmentImages } = useNFTUtils();
	const [{ isDragging }, drag] = useDrag(() => ({
		type: ItemTypes.CARD,
		item: {
			type: ItemTypes.PETS,
			id: nft.tokenId,
			nft: nft,
		},
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	if (!nft) {
		return <p>Loading</p>;
	}

	return (
		<div
			ref={drag}
			style={{
				opacity: isDragging || dropped ? '0.3' : '1',
				borderColor: getPetBorderColor(nft.rarity),
				backgroundColor: 'hsl(186, 33%, 94%)',
				minWidth: '160px',
				maxWidth: '160px',
				maxHeight: '212px',
				minHeight: '212px',
			}}
			className={`m-2 my-4 bg-cover border-2 rounded-2xl relative mx-auto ${dropped ? '' : 'cursor-pointer hover:shadow-2xl hover:border-gray-100 transition duration-300'}`}
		>
			{/* MAIN IMAGE */}
			<div style={{ minWidth: '160px', maxWidth: '160px', maxHeight: '212px', minHeight: '212px' }} className="absolute top-6 left-0">
				<img width="160" height="212" className="" src={getEquipmentImages(nft.baseId).preview} alt="" />
			</div>
			{/* TOP BAR */}
			<div className="w-full flex items-center justify-center">
				<span style={{ backgroundColor: getPetTypePallet(nft.mainclass) }} className="px-1 mx-1 text-sm font-bold rounded text-white">
					#{nft.tokenId.toString().padStart(4, '0')}
				</span>
				{owned && (
					<div style={{ backgroundColor: 'hsl(36, 100%, 50%)' }} className="rounded mt-1 px-2 top-4 absolute overflow-hidden text-white text-xs font-bold">
						OWNED
					</div>
				)}
			</div>

			{/* BOTTOM BAR */}
			<div className="w-full bottom-0 absolute overflow-hidden">
				<p className="text-center font-bold text-2xl text-black">{nft.name}</p>
			</div>
		</div>
	);
};

export default PetDragableCard;
