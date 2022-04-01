import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useMeralsUtils, getSubclassInfo } from '../../../hooks/useMeralsUtils';
import { getMeralImages, useMeralGlobal } from '../../../hooks/useMerals';

import Images from '../../../constants/Images';

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

const NFTPreviewCard = ({ nft, isFetching }) => {
	const { elements } = useMeralsUtils();
	const history = useHistory();
	const [subclassInfo, setSubclassInfo] = useState(undefined);
	const [color, setColor] = useState(undefined);
	const { globalColors } = useMeralGlobal(nft.tokenId, nft.type);

	useEffect(() => {
		if (globalColors) {
			setColor(globalColors[nft.tokenId]);
		}
	}, [globalColors, nft]);

	useEffect(() => {
		if (nft) {
			setSubclassInfo(getSubclassInfo(nft.subclass));
		}
	}, [nft]);

	if (isFetching || !subclassInfo || color === undefined) {
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
		history.push(`/ethemeral/${nft.tokenId}`);
	};

	return (
		<div
			onClick={handleOnClick}
			style={{ backgroundColor: elements[nft.element].color, backgroundImage: `url("${elements[nft.element].img}")`, minWidth: '256px', maxWidth: '256px', maxHeight: '384px', minHeight: '384px' }}
			className="w-64 h-96 m-4 cursor-pointer bg-cover relative hover:shadow-2xl hover:border-gray-100 transition duration-300"
		>
			<div className="text-xs font-bold absolute right-0 text-right text-white z-10">
				<p className=" bg-customBlue-dark rounded-l-md mt-1 px-2">{nft.hp} HP</p>
				<p className="bg-brandColor rounded-l-md mt-1 px-2">{nft.elf} ELF</p>
				{nft.proxy && (
					<div className="mt-1 right-2 absolute flex items-center space-x-1">
						<svg width="18" height="18" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 10C0 4.47715 4.47715 0 10 0H20C25.5228 0 30 4.47715 30 10V20C30 25.5228 25.5228 30 20 30H10C4.47715 30 0 25.5228 0 20V10Z" fill="#627EEA" />
							<path d="M15.0294 3.75V12.0656L22.0578 15.2062L15.0294 3.75Z" fill="white" fillOpacity="0.602" />
							<path d="M15.0294 3.75L8 15.2062L15.0294 12.0656V3.75Z" fill="white" />
							<path d="M15.0294 20.595V26.2453L22.0625 16.515L15.0294 20.595Z" fill="white" fillOpacity="0.602" />
							<path d="M15.0294 26.2453V20.594L8 16.515L15.0294 26.2453Z" fill="white" />
							<path d="M15.0294 19.2872L22.0578 15.2063L15.0294 12.0675V19.2872Z" fill="white" fillOpacity="0.2" />
							<path d="M8 15.2063L15.0294 19.2872V12.0675L8 15.2063Z" fill="white" fillOpacity="0.602" />
						</svg>
						<svg width="18" height="18" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 10C0 4.47715 4.47715 0 10 0H20C25.5228 0 30 4.47715 30 10V20C30 25.5228 25.5228 30 20 30H10C4.47715 30 0 25.5228 0 20V10Z" fill="#8247E5" />
							<path
								d="M20.4896 11.5015C20.1157 11.2878 19.635 11.2878 19.2077 11.5015L16.2166 13.2641L14.1869 14.3858L11.2493 16.1484C10.8754 16.362 10.3947 16.362 9.96736 16.1484L7.67062 14.7596C7.29674 14.546 7.02967 14.1187 7.02967 13.638V10.9674C7.02967 10.5401 7.24332 10.1128 7.67062 9.8457L9.96736 8.51039C10.3412 8.29674 10.822 8.29674 11.2493 8.51039L13.546 9.89911C13.9199 10.1128 14.1869 10.5401 14.1869 11.0208V12.7834L16.2166 11.6083V9.79228C16.2166 9.36499 16.003 8.93769 15.5757 8.67062L11.3027 6.16024C10.9288 5.94659 10.4481 5.94659 10.0208 6.16024L5.64095 8.72404C5.21365 8.93769 5 9.36499 5 9.79228V14.8131C5 15.2404 5.21365 15.6677 5.64095 15.9347L9.96736 18.4451C10.3412 18.6588 10.822 18.6588 11.2493 18.4451L14.1869 16.7359L16.2166 15.5608L19.1543 13.8516C19.5282 13.638 20.0089 13.638 20.4362 13.8516L22.7329 15.1869C23.1068 15.4006 23.3739 15.8279 23.3739 16.3086V18.9792C23.3739 19.4065 23.1602 19.8338 22.7329 20.1009L20.4896 21.4362C20.1157 21.6499 19.635 21.6499 19.2077 21.4362L16.911 20.1009C16.5371 19.8872 16.27 19.4599 16.27 18.9792V17.27L14.2404 18.4451V20.2077C14.2404 20.635 14.454 21.0623 14.8813 21.3294L19.2077 23.8398C19.5816 24.0534 20.0623 24.0534 20.4896 23.8398L24.816 21.3294C25.1899 21.1157 25.457 20.6884 25.457 20.2077V15.1335C25.457 14.7062 25.2433 14.2789 24.816 14.0119L20.4896 11.5015Z"
								fill="white"
							/>
						</svg>
					</div>
				)}
			</div>

			{/* MAIN IMAGE */}
			<div className="absolute top-0 left-0">
				<img className="" src={getMeralImages(nft.cmId, color).preview} alt="" />
			</div>

			{/* TOP BAR */}
			<div className="absolute flex items-center p-1 "></div>

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

			<div style={{ backgroundColor: elements[nft.element].color1 }} className="w-full bottom-0 absolute overflow-hidden text-white">
				<div className="px-2 py-1">
					<p className="text-xs">
						#<span className="text-sm font-bold">{nft.tokenId.toString().padStart(4, '0')}</span>
					</p>
					<p className="text-2xl font-medium">{nft.name && nft.name.length > 0 ? nft.name : nft.coin}</p>

					{subclassInfo && (
						<div style={{ backgroundColor: `hsla(${subclassInfo.hue},100%,70%,1)` }} className="flex h-6 my-1 items-center">
							<img style={{ margin: '1px 2px 1px 2px' }} width="20" height="20" src={subclassInfo.icon} alt="subclass icon" />
							<div className="w-full bg-black pl-2 uppercase font-bold text-white">{subclassInfo.name}</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default NFTPreviewCard;
