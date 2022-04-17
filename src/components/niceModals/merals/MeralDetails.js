import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useState, useEffect } from 'react';
import Images from '../../../constants/Images';
import { useGQLQueryL1, useGQLQueryL2 } from '../../../hooks/useGQLQuery';
import { getMeralImages, useMeralDataById } from '../../../hooks/useMerals';
import { getIdFromType, getSubclassInfo, getTokenIdFromId, getTypeFromId, useMeralsUtils } from '../../../hooks/useMeralsUtils';

import { useUser, useUserAccount } from '../../../hooks/useUser';
import { GET_NFT } from '../../../queries/Subgraph';
import { GET_NFT_L2 } from '../../../queries/SubgraphPoly';

const SpinnerSVG = () => (
	<svg className=" animate-spin-slow text-brandColor" width="120" height="120" viewBox="0 0 304 304" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g opacity="1">
			<path
				d="M152 304C68.0527 304 0 235.947 0 152C0 68.0527 68.0527 0 152 0L152 10.6431C73.9306 10.6431 10.6429 73.9308 10.6429 152C10.6429 230.069 73.9306 293.357 152 293.357C230.069 293.357 293.357 230.069 293.357 152L304 152C304 235.947 235.947 304 152 304Z"
				fill="currentColor"
			/>
		</g>
	</svg>
);

export default NiceModal.create(({ id }) => {
	const modal = useModal();

	const { elements } = useMeralsUtils();
	console.log(id);
	const { meralData, currentColor } = useMeralDataById(getIdFromType(1, getTokenIdFromId(id)));
	const [color, setColor] = useState(0);
	const [nft, setNFT] = useState(undefined);

	const [subclassInfo, setSubclassInfo] = useState(undefined);

	const { data, status } = useGQLQueryL1(`nft_${id}`, GET_NFT, { id: getTokenIdFromId(id) }, { refetchOnMount: true });

	useEffect(() => {
		if (status === 'success' && data && data.meral) {
			setNFT(data.meral);
			setSubclassInfo(getSubclassInfo(data.meral.subclass));
		}
	}, [status, data, nft]);

	useEffect(() => {
		if (currentColor !== undefined) {
			setColor(currentColor);
		}
	}, [currentColor]);

	const toggle = async () => {
		modal.remove();
	};

	if (!nft || color === undefined) {
		return (
			<>
				<div onClick={toggle} className="fixed left-0 top-0 w-screen h-screen bg-black bg-opacity-60 z-30"></div>
				<div className="fixed center rounded-xl shadow-xl z-40 text-white bg-black bg-opacity-50">
					<div className="nft_details_bg relative">
						<div className="center">
							<SpinnerSVG />
						</div>
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<div onClick={toggle} className="fixed left-0 top-0 w-screen h-screen bg-black bg-opacity-60 z-30"></div>
			<div className="fixed center rounded-xl shadow-xl z-40 text-white rouned-xl overflow-hidden">
				<div className="nft_details_bg relative">
					{/* LEFT BAR */}
					<div className="p-4 w-32 z-10 absolute font-bold text-center">
						<img className="w-90 h-74 mx-auto" src={Images.logoEthem} alt="logo" />
						<p className="mt-10 text-lg border-b border-white">{`${nft.edition}/${nft.metadata.editionCount}`}</p>
						<p className="text-sm">{nft.name}</p>
						<p className="mt-5 text-sm">{elements[nft.element].element}</p>
						<p className="mt-5 text-3xl">#{nft.tokenId.toString().padStart(4, '0')}</p>
					</div>

					{/* BOTTOM BAR */}
					<div className="z-10 w-full bottom-0 absolute overflow-hidden">
						<p className="px-4 font-bold text-5xl uppercase">{nft.name}</p>
						<div style={{ height: '124px' }} className="bg-black pt-3 px-4">
							<div className="flex h-8">
								<div style={{ backgroundColor: `hsla(${subclassInfo.hue},100%,70%,1)` }} className="w-8">
									<img src={subclassInfo.icon} alt="subclass icon" />
								</div>
								<div className="w-48 px-2 uppercase text-lg">{subclassInfo.name}</div>
							</div>
							<div className="flex justify-between">
								<div className="">
									<div className="flex h-3 items-center mb-1 mt-2 text-sm font-bold">
										<span className="w-8 text-white">ATK</span>
										<span style={{ width: `${(nft.atk - subclassInfo.bonus.atk) * 0.4}px` }} className="h-3 bg-gray-500"></span>
										<span style={{ width: `${subclassInfo.bonus.atk * 0.4}px`, backgroundColor: `hsla(${subclassInfo.hue},100%, 70%, 1)` }} className="h-3"></span>
										<span className="pl-1 text-white">{nft.atk}</span>
									</div>
									<div className="flex h-3 items-center mb-1 text-sm font-bold">
										<span className="w-8 text-white">DEF</span>
										<span style={{ width: `${(nft.def - subclassInfo.bonus.def) * 0.4}px` }} className="h-3 bg-gray-500"></span>
										<span style={{ width: `${subclassInfo.bonus.def * 0.4}px`, backgroundColor: `hsla(${subclassInfo.hue},100%, 70%, 1)` }} className="h-3"></span>
										<span className="pl-1 text-white">{nft.def}</span>
									</div>
									<div className="flex h-3 items-center mb-1 text-sm font-bold">
										<span className="w-8 text-white">SPD</span>
										<span style={{ width: `${(nft.spd - subclassInfo.bonus.spd) * 0.4}px` }} className="h-3 bg-gray-500"></span>
										<span style={{ width: `${subclassInfo.bonus.spd * 0.4}px`, backgroundColor: `hsla(${subclassInfo.hue},100%, 70%, 1)` }} className="h-3"></span>
										<span className="pl-1 text-white">{nft.spd}</span>
									</div>
									<div className="flex h-3 items-center mb-1 text-sm font-bold">
										<span className="">TOTAL </span>
										<span className="pl-1">{parseInt(nft.spd) + parseInt(nft.def) + parseInt(nft.atk)}</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* RIGHT BAR */}
					<div className="mx-2 my-2 w-64 z-10 right-0 bottom-0 absolute border-white border-r">
						<div className="flex items-center justify-end">
							<p className="font-bold text-right -mr-1">{nft.hp} HP</p>
							<img width="19px" height="19px" className="mx-2" src={Images.iconHeart} alt="" />
						</div>
						<div className="flex items-center justify-end">
							<p className="font-bold text-right ">{nft.elf} ELF</p>
							<img width="16px" height="16px" className="mx-2" src={Images.iconDrain} alt="" />
						</div>
						<div className="flex items-center justify-end">
							<p className="font-bold text-right">{nft.xp} XP</p>
							<img width="19px" height="19px" className="mx-2" src={Images.iconStar} alt="" />
						</div>
					</div>

					{/* MAIN IMAGE */}
					<div style={{ backgroundColor: elements[nft.element].color, backgroundImage: `url("${elements[nft.element].img}")` }} className="absolute bg-contain nft_details_img"></div>
					<img className="z-0 nft_details_img animate-bounceSlow absolute" src={getMeralImages(nft.cmId, color).large} alt="" />
				</div>
			</div>
		</>
	);
});
