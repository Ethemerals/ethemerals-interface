import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { formatELF } from '../utils';
import { useNFTUtils } from '../hooks/useNFTUtils';
import Images from '../constants/Images';

const RankedStars = ({ amount }) => {
	const starSVG = (
		<svg width="16" height="16" fill="gold" stroke="goldenRod" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

const NFTPreviewCard = ({ nft, rewards }) => {
	const { getNFTImages, parseScore, getColorPalette, backgrounds } = useNFTUtils();
	const history = useHistory();
	const [subclass, setSubclass] = useState(undefined);

	useEffect(() => {
		if (nft) {
			setSubclass(nft.metadata.subClass);
		}
	}, [nft]);

	if (!nft) {
		return <p>Loading</p>;
	}

	const cmId = nft.metadata.id;

	const handleOnClick = () => {
		history.push(`/ethemeral/${nft.id}`);
	};

	return (
		<div
			onClick={handleOnClick}
			style={{ backgroundColor: backgrounds[nft.bgId].color, backgroundImage: `url("${backgrounds[nft.bgId].img}")` }}
			className="w-64 h-96 m-4 cursor-pointer bg-cover relative hover:shadow-2xl hover:border-gray-100 transition duration-300"
		>
			<div className="text-xs font-bold absolute right-0 text-right text-white z-10">
				{!rewards && <p className=" bg-yellow-400 rounded-l-md mt-1 px-2">{nft.score} HP</p>}
				{rewards && <p className="bg-brandColor rounded-l-md mt-1 px-2">{nft.rewards} ELF</p>}
			</div>

			{/* MAIN IMAGE */}
			<div className="absolute top-0 left-0">
				<img className="" src={getNFTImages(cmId).preview} alt="" />
			</div>

			{/* TOP BAR */}
			<div className="absolute flex items-center p-1 ">
				<RankedStars amount={parseScore(nft.score)} />
			</div>

			<div style={{ bottom: '64px' }} className="w-full absolute z-10 flex justify-end right-2 space-x-1">
				<div className="relative">
					<img width="30px" height="30px" src={Images.iconAtk} />
					<span className="center text font-black">{nft.atk}</span>
				</div>
				<div className="relative">
					<img width="30px" height="30px" src={Images.iconDef} />
					<span className="center text font-black">{nft.def}</span>
				</div>
				<div className="relative">
					<img width="30px" height="30px" src={Images.iconSpd} />
					<span className="center text font-black">{nft.spd}</span>
				</div>
			</div>

			{/* BOTTOM BAR */}
			{/* <div style={{ backgroundColor: `hsla(${getColorPalette(subclass).hue},40%,40%,0.9)` }} className="w-full bottom-0 absolute overflow-hidden"> */}
			<div style={{ backgroundColor: backgrounds[nft.bgId].color1 }} className="w-full bottom-0 absolute overflow-hidden">
				<div className="px-2 py-1">
					<p className="text-xs text-white">
						#<span className="text-sm font-bold">{nft.id.padStart(4, '0')}</span>
					</p>
					<p className="text-2xl font-medium">{nft.metadata.coin}</p>
					<div className="flex h-6 my-1">
						<div style={{ backgroundColor: `hsla(${getColorPalette(subclass).hue},100%,80%,1)` }} className="w-6">
							<img src={getNFTImages(cmId).subclassIcon} alt="subclass icon" />
						</div>
						<div className="w-full bg-black pl-2 uppercase font-bold text-white">{nft.metadata.subClass}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NFTPreviewCard;
