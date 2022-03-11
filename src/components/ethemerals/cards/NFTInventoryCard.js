import NiceModal from '@ebay/nice-modal-react';

import { getMeralImages } from '../../../hooks/useMerals';
import { useNFTUtils } from '../../../hooks/useNFTUtils';
import { modalRegistry } from '../../niceModals/RegisterModals';

const NFTInventoryCard = ({ nft, showBase = false, showChange = true }) => {
	const { elements } = useNFTUtils();
	let tokenId = nft.id;

	const showMainSelectModal = () => {
		NiceModal.show(modalRegistry.mainSelect);
	};

	return (
		<>
			<div className="flex-grow relative bg-cover bg-center text-white h-28" style={{ backgroundColor: elements[nft.element].color, backgroundImage: `url("${elements[nft.element].img}")` }}>
				{/* LEFT BAR */}
				<div className="left-0 top-0 absolute p-1 text-right z-10 text-sm font-bold">
					<span>#{tokenId.toString().padStart(4, '0')}</span>
				</div>

				{/* RIGHT BAR */}
				<div className="right-0 absolute p-1 text-right z-10 text-sm font-bold">
					<p>{nft.hp} HP</p>
					<p>{nft.elf} ELF</p>
					<p>{nft.xp} XP</p>
				</div>

				{/* BOTTOM BAR */}
				<div className="px-1 w-full bottom-0 absolute bg-black bg-opacity-70 z-10 flex items-center">
					<span className="font-bold text-lg uppercase">{nft.name}</span>
					<span className="flex-grow"></span>
					<span className="text-xs font-bold">{showBase ? 'BASE STATS' : 'STATS'}:</span>
					<div className="ml-2 text-xs font-bold">
						<span style={{ backgroundColor: 'hsla(0,60%,40%,1)' }} className="text-sm rounded px-1 py-0 ml-1">
							{nft.atk}
						</span>
						<span style={{ backgroundColor: 'hsla(230,60%,40%,1)' }} className="text-sm rounded px-1 py-0 ml-1">
							{nft.def}
						</span>
						<span style={{ backgroundColor: 'hsla(180,60%,40%,1)' }} className="text-sm rounded px-1 py-0 ml-1">
							{nft.spd}
						</span>
					</div>
				</div>
				{/* MAIN IMAGE */}

				<div className="absolute top-0 left-0 w-full h-28">
					<img className="" src={getMeralImages(nft.cmId).inventory} alt="" />
				</div>
			</div>
			{showChange && (
				<div className="font-bold text-xs text-center pt-1">
					<button onClick={showMainSelectModal} className="cursor-pointer hover:text-brandColor-pale text-brandColor transition duration-300">
						CHANGE ACTIVE MERAL
					</button>
				</div>
			)}
		</>
	);
};

export default NFTInventoryCard;
