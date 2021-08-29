import { useEffect, useState, useRef } from 'react';

import { useParams } from 'react-router-dom';
import dateFormat from 'dateformat';

import { useGQLQuery } from '../hooks/useGQLQuery';
import { useNFTUtils } from '../hooks/useNFTUtils';
import Images from '../constants/Images';
import { GET_NFT } from '../queries/Subgraph';
import useParseAction from '../hooks/useParseActions';

import NFTActions from '../components/NFTActions';

import { shortenAddress, formatELF } from '../utils';
import BackButton from '../components/navigation/BackButton';

const RankedStars = ({ amount }) => {
	const starSVG = (
		<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
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

const NFTDetails = () => {
	const { getNFTImages, parseScore, elements, getSubclassIcon } = useNFTUtils();

	const { id } = useParams();
	const { data, status, isLoading } = useGQLQuery(`nft_${id}`, GET_NFT, { id: id }, { refetchOnMount: true });

	const [nft, setNFT] = useState(undefined);
	const [ready, setReady] = useState(false);
	const [cmId, setCmId] = useState(undefined);
	const [birthDate, setBirthDate] = useState(Date.now());

	const [subclass, setSubclass] = useState('Paladin');

	useEffect(() => {
		if (status === 'success' && data && data.ethemeral) {
			setNFT(data.ethemeral);
			setCmId(data.ethemeral.metadata.id);
			setSubclass(data.ethemeral.metadata.subClass);
			setBirthDate(parseInt(data.ethemeral.timestamp) * 1000);
			setReady(true);
		}
	}, [status, data, nft]);

	if (!ready || isLoading !== false || status !== 'success' || !nft) {
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

			<div className="nft_details_container flex items-center justify-center mx-auto overflow-hidden">
				{/* MAIN CARD     */}
				<div className="nft_details_bg relative">
					{/* LEFT BAR */}
					<div className="p-4 w-32 z-20 absolute font-bold text-center">
						<img className="w-90 h-74 mx-auto" src={Images.logoEthem} alt="logo" />
						<p className="mt-10 text-lg border-b border-white">{nft.edition}/10</p>
						<p className="text-sm">{nft.metadata.coin}</p>
						<p className="mt-5 text-sm">{elements[nft.bgId].element}</p>
						<p className="mt-5 text-3xl">#{nft.id.padStart(4, '0')}</p>
					</div>

					{/* RIGHT BAR */}
					<div className="mx-2 my-4 w-64 z-20 right-0 absolute border-white border-r">
						<div className="flex justify-end mx-2">
							<RankedStars amount={parseScore(nft.score)} />
						</div>
						<p className="font-bold text-right mx-2">{nft.score} HP</p>
						<p className="font-bold text-right mx-2">{nft.rewards} ELF</p>
					</div>

					{/* BOTTOM BAR */}
					<div className="z-20 w-full bottom-0 absolute overflow-hidden">
						<p className="px-4 font-bold text-5xl uppercase">{nft.metadata.coin}</p>
						<div style={{ height: '124px' }} className="bg-black pt-3 px-4">
							<div className="flex h-8">
								<div style={{ backgroundColor: `hsla(${getSubclassIcon(subclass).palette.hue},100%,70%,1)` }} className="w-8">
									<img src={getSubclassIcon(subclass).icon} alt="subclass icon" />
								</div>
								<div className="w-48 px-2 uppercase text-lg">{subclass}</div>
							</div>
							<div className="flex justify-between">
								<div className=" w-3/4">
									<div className="flex h-3 items-center mb-1 mt-2 text-sm font-bold">
										<span className="w-8 text-pink-200">ATK</span>
										<span style={{ width: `${nft.atk * 3}px` }} className="h-3 bg-pink-900 opacity-80"></span>
										<span className="pl-1 text-pink-200">{nft.atk}</span>
									</div>
									<div className="flex h-3 items-center mb-1 text-sm font-bold">
										<span className="w-8 text-indigo-200">DEF</span>
										<span style={{ width: `${nft.def * 3}px` }} className="h-3 bg-indigo-900 opacity-80"></span>
										<span className="pl-1 text-indigo-200">{nft.def}</span>
									</div>
									<div className="flex h-3 items-center mb-1 text-sm font-bold">
										<span className="w-8 text-green-200">SPD</span>
										<span style={{ width: `${90 * 3}px` }} className="h-3 bg-green-900 opacity-80"></span>
										<span className="pl-1 text-green-200">{nft.spd}</span>
									</div>
									<div className="flex h-3 items-center mb-1 text-sm font-bold">
										<span className="">TOTAL </span>
										<span className="pl-1">{parseInt(nft.spd) + parseInt(nft.def) + parseInt(nft.atk)}</span>
									</div>
								</div>
								<div className="text-sm text-right leading-relaxed text-gray-400">
									<p>Birthed: {dateFormat(birthDate, 'mmm dd yyyy')}</p>
									<p>Designer: {nft.metadata.artist}</p>
									<p>Minted By: {shortenAddress(nft.creator.id)}</p>
								</div>
							</div>
						</div>
					</div>

					{/* MAIN IMAGE */}
					<div style={{ backgroundColor: elements[nft.bgId].color, backgroundImage: `url("${elements[nft.bgId].img}")` }} className="absolute bg-contain nft_details_img"></div>
					<img className="z-10 nft_details_img animate-bounceSlow absolute" src={getNFTImages(cmId).large} alt="Ethemeral Full Size" />
				</div>

				{/* SIDE BAR */}
				<div className="nft_details_sidebar text-gray-700">
					{/* ACTIONS */}
					<div className="p-4 pt-2 m-4 bg-blue-100 rounded-xl shadow-lg">
						<h3 className="font-bold text-xs mb-4">ACTIONS</h3>
						<NFTActions nft={nft} />
					</div>

					{/* EQUIPMENT */}
					<div className="p-4 pt-2 m-4 bg-blue-100 rounded-xl shadow-lg">
						<h3 className="font-bold text-xs mb-4">EQUIPMENT</h3>
						<div className="flex justify-center">
							<div style={{ boxShadow: 'inset 2px 2px 10px hsl(213,30%,60%)' }} className="w-14 h-14 mr-2 bg-customBlue-pale rounded-md border-2 border-white"></div>
							<div style={{ boxShadow: 'inset 2px 2px 10px hsl(213,30%,60%)' }} className="w-14 h-14 mr-2 bg-customBlue-pale rounded-md border-2 border-white"></div>
							<div style={{ boxShadow: 'inset 2px 2px 10px hsl(213,30%,60%)' }} className="w-14 h-14 mr-2 bg-customBlue-pale rounded-md border-2 border-white"></div>
							<div style={{ boxShadow: 'inset 2px 2px 10px hsl(213,30%,60%)' }} className="w-14 h-14 ml-6 bg-customBlue-pale rounded-md border-2 border-white"></div>
						</div>
					</div>

					{/* ABILITIES */}
					<div className="h-32 p-4 pt-2 m-4 bg-blue-100 rounded-xl shadow-lg">
						<h3 className="font-bold text-xs">ABILITIES</h3>
					</div>

					{/* STATS */}
					<div className="p-4 pt-2 m-4 bg-blue-100 rounded-xl shadow-lg">
						<h3 className="font-bold text-xs mb-4">RECORD</h3>
						<div className="text-black text-sm leading-7 grid grid-cols-2 gap-2 mt-1">
							<div className="bg-customBlue-paler px-3 py-2 rounded-lg">
								<div className="flex justify-between">
									<span>Battles</span>
									<span>{nft.scorecard.battles}</span>
								</div>
								<div className="flex justify-between">
									<span>Wins</span>
									<span>{nft.scorecard.wins}</span>
								</div>
								<div className="flex justify-between">
									<span>Resurrected</span>
									<span>{nft.scorecard.resurrected}</span>
								</div>
							</div>
							<div className="bg-customBlue-paler px-3 py-2 rounded-lg">
								<div className="flex justify-between">
									<span>Revived</span>
									<span>{nft.scorecard.revived}</span>
								</div>
								<div className="flex justify-between">
									<span>Reaped</span>
									<span>{nft.scorecard.reaped}</span>
								</div>
								<div className="flex justify-between">
									<span>Drained</span>
									<span>{nft.scorecard.drained}</span>
								</div>
							</div>
						</div>
					</div>

					{/* HISTORY */}
					<div className="p-4 pt-2 m-4 bg-blue-100 rounded-xl shadow-lg h-64">
						<h3 className="font-bold text-xs mb-4">HISTORY</h3>
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
		</div>
	);
};

export default NFTDetails;
