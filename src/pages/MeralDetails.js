import NFTChooseColorScheme from '../components/ethemerals/components/NFTChooseColorScheme';

import { shortenAddress } from '../utils';
import BackButton from '../components/navigation/BackButton';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';

import { useGQLQueryL1 } from '../hooks/useGQLQuery';
import { getSubclassInfo, useMeralsUtils } from '../hooks/useMeralsUtils';
import Images from '../constants/Images';
import { GET_NFT } from '../queries/Subgraph';
import useParseAction from '../hooks/useParseActions';

import NFTActions from '../components/ethemerals/components/NFTActions';

import { getMeralImages, useMeralDataById } from '../hooks/useMerals';
import { getIdFromType } from '../hooks/useMeralsUtils';

const ActionLink = (action) => {
	const [actionString, txLink] = useParseAction(action);

	return (
		<a href={txLink} target="_blank" rel="noreferrer" className="flex items-center hover:text-blue-400">
			{actionString}
			<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
				<polyline points="15 3 21 3 21 9"></polyline>
				<line x1="10" y1="14" x2="21" y2="3"></line>
			</svg>
		</a>
	);
};

const MeralDetails = () => {
	const { elements } = useMeralsUtils();
	const { id } = useParams();

	const { meralData, currentColor } = useMeralDataById(getIdFromType(1, id));

	const [color, setColor] = useState(undefined);
	const [birthDate, setBirthdate] = useState(undefined);
	const [nft, setNFT] = useState(undefined);
	const [subclassInfo, setSubclassInfo] = useState(undefined);

	const { data, status } = useGQLQueryL1(`nft_${id}`, GET_NFT, { id: id }, { refetchOnMount: true });

	useEffect(() => {
		if (status === 'success' && data && data.meral) {
			setNFT(data.meral);
			setBirthdate(parseInt(data.meral.timestamp) * 1000);
			setSubclassInfo(getSubclassInfo(data.meral.subclass));
		}
	}, [status, data, nft]);

	useEffect(() => {
		if (currentColor !== undefined) {
			setColor(currentColor);
		}
	}, [currentColor]);

	if (!nft || color === undefined) {
		return (
			<div>
				<div className="page_bg"></div>
				<BackButton />
				<div className="nft_details_container mx-auto">Loading ...</div>
			</div>
		);
	}

	return (
		<div>
			<div className="page_bg"></div>
			<BackButton />
			<div className="nft_details_container flex items-center justify-center mx-auto overflow-hidden mt-4 text-white">
				{/* MAIN CARD */}
				<div className="nft_details_bg relative">
					{/* LEFT BAR */}
					<div className="p-4 w-32 z-20 absolute font-bold text-center">
						<img className="w-90 h-74 mx-auto" src={Images.logoEthem} alt="logo" />
						<p className="mt-10 text-lg border-b border-white">{`${nft.edition}/${nft.metadata.editionCount}`}</p>
						<p className="text-sm">{nft.name}</p>
						<p className="mt-5 text-sm">{elements[nft.element].element}</p>
						<p className="mt-5 text-3xl">#{nft.tokenId.toString().padStart(4, '0')}</p>
					</div>

					{/* BOTTOM BAR */}
					<div className="z-20 w-full bottom-0 absolute overflow-hidden">
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
								{/* <div className="text-sm text-right leading-relaxed text-gray-200 font-bold">
									<p>Birthed: {birthDate && format(birthDate, 'MMM dd yyyy')}</p>
									<p>Designer: {nft.artist}</p>
									<p>Minted By: {shortenAddress(nft.creator.id)}</p>
								</div> */}
							</div>
						</div>
					</div>

					{/* RIGHT BAR */}
					<div className="mx-2 my-2 w-64 z-20 right-0 bottom-0 absolute border-white border-r">
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
					<img className="z-10 nft_details_img animate-bounceSlow absolute" src={getMeralImages(nft.cmId, color).large} alt="" />
				</div>

				{/* SIDE BAR */}
				<div className="nft_details_sidebar text-gray-900">
					{/* ACTIONS */}
					<div className="p-4 pt-2 mx-4 bg-blue-100 rounded-xl shadow-md">
						<h3 className="font-bold text-xs mb-4 text-brandColor-purple">ACTIONS</h3>
						<NFTActions nft={nft} />
					</div>

					{/* COLOR */}
					<div className="p-4 pt-2 m-4 bg-blue-100 rounded-xl shadow-md">
						<h3 className="font-bold text-xs mb-4 text-brandColor-purple">COSTUME</h3>
						<NFTChooseColorScheme nft={nft} color={color} setColor={setColor} currentColor={currentColor} meralData={meralData} />
					</div>

					{/* EQUIPMENT */}
					<div className="h-32 p-4 pt-2 m-4 bg-blue-100 rounded-xl shadow-md">
						<h3 className="font-bold text-xs text-brandColor-purple">EQUIPMENT</h3>
					</div>

					{/* RECORD */}
					<div className="p-4 pt-2 m-4 bg-blue-100 rounded-xl shadow-md">
						<h3 className="font-bold text-xs mb-4 text-brandColor-purple">RECORD</h3>
						<div className="text-black text-sm leading-7 grid grid-cols-2 gap-2 mt-1 bg-customBlue-paler rounded-lg">
							<div className="px-3 py-2">
								<div className="flex justify-between">
									<span>Battles</span>
									<span>{nft.scorecard.battles}</span>
								</div>
								<div className="flex justify-between">
									<span>Revived</span>
									<span>{nft.scorecard.revived}</span>
								</div>
								<div className="flex justify-between">
									<span>Reaped</span>
									<span>{nft.scorecard.reaped}</span>
								</div>
							</div>
							<div className="px-3 py-2">
								<div className="flex justify-between">
									<span>Wins</span>
									<span>{nft.scorecard.wins}</span>
								</div>
								<div className="flex justify-between">
									<span>Reviver</span>
									<span>{nft.scorecard.reviver}</span>
								</div>
								<div className="flex justify-between">
									<span>Reaper</span>
									<span>{nft.scorecard.reaper}</span>
								</div>
							</div>
						</div>
					</div>

					{/* HISTORY */}
					<div className="p-4 pt-2 m-4 bg-blue-100 rounded-xl shadow-md">
						<h3 className="font-bold text-xs mb-4 text-brandColor-purple">HISTORY</h3>
						<ul className="text-gray-700 text-sm leading-6">
							{status === 'success' &&
								nft &&
								nft.actions.length > 0 &&
								nft.actions.map((action, index) => {
									if (index > 6) {
										return null;
									}
									return <li key={index}>{ActionLink(action)}</li>;
								})}
						</ul>
					</div>
				</div>
			</div>
			<div className="h-24"></div>
		</div>
	);
};

export default MeralDetails;
