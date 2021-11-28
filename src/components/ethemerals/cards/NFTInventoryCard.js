import { useState } from 'react';

import { useMeralImagePaths } from '../../../hooks/useMeralImagePaths';
import { useNFTUtils } from '../../../hooks/useNFTUtils';

import RankedStars from '../components/RankedStars';
import MainSelect from '../../modals/MainSelect';

const NFTInventoryCard = ({ nft, stats, showBase = false, showChange = true }) => {
	const { elements, parseScore } = useNFTUtils();
	const { meralImagePaths } = useMeralImagePaths(nft.id);

	const [isMainSelectOpen, setMainSelectOpen] = useState(false);
	const toggleMainSelectModal = () => {
		setMainSelectOpen(!isMainSelectOpen);
	};

	if (!meralImagePaths) {
		return <div className="flex w-72 h-74 mx-auto relative"></div>;
	}

	return (
		<>
			<div className="flex-grow relative bg-cover bg-center text-white h-28" style={{ backgroundColor: elements[nft.bgId].color, backgroundImage: `url("${elements[nft.bgId].img}")` }}>
				{/* LEFT BAR */}
				<div className="left-0 top-0 absolute p-1 text-right z-10 text-sm font-bold">
					<span>#{nft.id.padStart(4, '0')}</span>
				</div>

				{/* RIGHT BAR */}
				<div className="right-0 absolute p-1 text-right z-10 text-sm font-bold">
					<div className="flex justify-end">
						<RankedStars amount={parseScore(nft.score)} />
					</div>
					<p>{nft.score} HP</p>
					<p>{nft.rewards} ELF</p>
				</div>

				{/* BOTTOM BAR */}
				<div className="px-1 w-full bottom-0 absolute bg-black bg-opacity-70 z-10 flex items-center">
					<span className="font-bold text-lg uppercase">{nft.metadata.coin}</span>
					<span className="flex-grow"></span>
					<span className="text-xs font-bold">{showBase ? 'BASE STATS' : 'STATS'}:</span>
					<div className="ml-2 text-xs font-bold">
						<span style={{ backgroundColor: 'hsla(0,60%,40%,1)' }} className="text-sm rounded px-1 py-0 ml-1">
							{stats[0]}
						</span>
						<span style={{ backgroundColor: 'hsla(230,60%,40%,1)' }} className="text-sm rounded px-1 py-0 ml-1">
							{stats[1]}
						</span>
						<span style={{ backgroundColor: 'hsla(180,60%,40%,1)' }} className="text-sm rounded px-1 py-0 ml-1">
							{stats[2]}
						</span>
					</div>
				</div>
				{/* MAIN IMAGE */}

				<div className="absolute top-0 left-0 w-full h-28">
					<img className="" src={meralImagePaths.inventory} alt="" />
				</div>
			</div>
			{showChange && (
				<div className="font-bold text-xs text-center pt-1">
					<button onClick={toggleMainSelectModal} className="cursor-pointer hover:text-brandColor-pale text-brandColor transition duration-300">
						CHANGE ACTIVE MERAL
					</button>
				</div>
			)}
			{isMainSelectOpen && showChange && <MainSelect toggle={toggleMainSelectModal} />}
		</>
	);
};

export default NFTInventoryCard;
