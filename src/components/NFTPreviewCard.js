import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useNFTUtils } from '../hooks/useNFTUtils';
import { useMeralImagePaths } from '../hooks/useMeralImagePaths';
import Images from '../constants/Images';
import RankedStars from './cards/RankedStars';

const NFTPreviewCard = ({ nft, rewards }) => {
	const { parseScore, getSubclassIcon, elements } = useNFTUtils();
	const history = useHistory();
	const [subclass, setSubclass] = useState(undefined);
	const { meralImagePaths } = useMeralImagePaths(nft.id);

	useEffect(() => {
		if (nft) {
			setSubclass(nft.metadata.subClass);
		}
	}, [nft]);

	if (!nft && !meralImagePaths) {
		<div className="w-64 h-96 m-4 cursor-pointer bg-cover relative hover:shadow-2xl hover:border-gray-100 transition duration-300">
			<div className="text-xs font-bold absolute right-0 text-right text-white z-10"></div>

			{/* MAIN IMAGE */}
			<div className="absolute top-0 left-0"></div>

			{/* TOP BAR */}
			<div className="absolute flex items-center p-1 "></div>

			<div style={{ bottom: '64px' }} className="w-full absolute z-10 flex justify-end right-2 space-x-2">
				<div className="relative"></div>
				<div className="relative"></div>
				<div className="relative"></div>
			</div>

			{/* BOTTOM BAR */}

			<div className="w-full bottom-0 absolute overflow-hidden">
				<div className="px-2 py-1">
					<p className="text-xs text-white"></p>
					<p className="text-2xl font-medium"></p>
					<div className="flex h-6 my-1 items-center">
						<div className="w-full bg-black pl-2 uppercase font-bold text-white"></div>
					</div>
				</div>
			</div>
		</div>;
	}

	const handleOnClick = () => {
		history.push(`/ethemeral/${nft.id}`);
	};

	return (
		<div
			onClick={handleOnClick}
			style={{ backgroundColor: elements[nft.bgId].color, backgroundImage: `url("${elements[nft.bgId].img}")`, minWidth: '256px', maxWidth: '256px', maxHeight: '384px', minHeight: '384px' }}
			className="w-64 h-96 m-4 cursor-pointer bg-cover relative hover:shadow-2xl hover:border-gray-100 transition duration-300"
		>
			<div className="text-xs font-bold absolute right-0 text-right text-white z-10">
				{!rewards && <p className=" bg-customBlue-dark rounded-l-md mt-1 px-2">{nft.score} HP</p>}
				{rewards && <p className="bg-brandColor rounded-l-md mt-1 px-2">{nft.rewards} ELF</p>}
			</div>

			{/* MAIN IMAGE */}
			<div className="absolute top-0 left-0">{meralImagePaths && <img className="" src={meralImagePaths.preview} alt="" />}</div>

			{/* TOP BAR */}
			<div className="absolute flex items-center p-1 ">
				<RankedStars amount={parseScore(nft.score)} />
			</div>

			<div style={{ bottom: '64px' }} className="w-full absolute z-10 flex justify-end right-2 space-x-2 text-white">
				<div className="relative">
					<img width="30px" height="30px" src={Images.iconAtk} alt="" />
					<span className="center text font-black">{nft.atk}</span>
				</div>
				<div className="relative">
					<img width="30px" height="30px" src={Images.iconDef} alt="" />
					<span className="center text font-black">{nft.def}</span>
				</div>
				<div className="relative">
					<img width="30px" height="30px" src={Images.iconSpd} alt="" />
					<span className="center text font-black">{nft.spd}</span>
				</div>
			</div>

			{/* BOTTOM BAR */}

			<div style={{ backgroundColor: elements[nft.bgId].color1 }} className="w-full bottom-0 absolute overflow-hidden text-white">
				<div className="px-2 py-1">
					<p className="text-xs">
						#<span className="text-sm font-bold">{nft.id.padStart(4, '0')}</span>
					</p>
					<p className="text-2xl font-medium">{nft.metadata.coin}</p>
					<div style={{ backgroundColor: `hsla(${getSubclassIcon(subclass).palette.hue},100%,70%,1)` }} className="flex h-6 my-1 items-center">
						<img style={{ margin: '1px 2px 1px 2px' }} width="20" height="20" src={getSubclassIcon(subclass).icon} alt="subclass icon" />
						<div className="w-full bg-black pl-2 uppercase font-bold text-white">{nft.metadata.subClass}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NFTPreviewCard;
