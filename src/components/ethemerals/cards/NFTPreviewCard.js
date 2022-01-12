import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useNFTUtils } from '../../../hooks/useNFTUtils';
import { useMeralImagePaths } from '../../../hooks/useMeralImagePaths';
import Images from '../../../constants/Images';
import RankedStars from '../components/RankedStars';

const SpinnerSVG = () => (
	<svg className=" animate-spin-slow text-white opacity-20" width="60" height="60" viewBox="0 0 304 304" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g opacity="1">
			<path
				d="M152 304C68.0527 304 0 235.947 0 152C0 68.0527 68.0527 0 152 0L152 10.6431C73.9306 10.6431 10.6429 73.9308 10.6429 152C10.6429 230.069 73.9306 293.357 152 293.357C230.069 293.357 293.357 230.069 293.357 152L304 152C304 235.947 235.947 304 152 304Z"
				fill="currentColor"
			/>
		</g>
	</svg>
);

const NFTPreviewCard = ({ nft, rewards, isFetching }) => {
	const { parseScore, getSubclassIcon, elements } = useNFTUtils();
	const history = useHistory();
	const [subclass, setSubclass] = useState(undefined);
	const { meralImagePaths } = useMeralImagePaths(nft.id);

	useEffect(() => {
		if (nft) {
			setSubclass(nft.metadata.subClass);
		}
	}, [nft]);

	if (isFetching) {
		return (
			<div style={{ backgroundColor: elements[4].color }} className="w-64 h-96 m-4 cursor-pointer bg-cover relative bg-gray-500">
				<div className="abosulte center">
					<SpinnerSVG />
				</div>

				{/* BOTTOM BAR */}
			</div>
		);
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
