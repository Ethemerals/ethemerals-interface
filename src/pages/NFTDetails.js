import { useEffect, useState } from 'react';

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
	const { getNFTImages, parseScore } = useNFTUtils();

	const { id } = useParams();
	const { data, status, isLoading } = useGQLQuery(`nft_${id}`, GET_NFT, { id: id }, { refetchOnMount: true });

	const [nft, setNFT] = useState({});
	const [ready, setReady] = useState(false);
	const [cmId, setCmId] = useState(undefined);
	const [birthDate, setBirthDate] = useState(Date.now());

	useEffect(() => {
		if (status === 'success' && data && data.ethemeral) {
			setNFT(data.ethemeral);
			setCmId(data.ethemeral.metadata.cmId);
			setBirthDate(parseInt(nft.timestamp) * 1000);
			setReady(true);
		}
	}, [status, data, nft]);

	if (!ready || isLoading !== false || status !== 'success') {
		// return <p>Loading {id}</p>;
		return null;
	}

	return (
		<div>
			<div className="page_bg"></div>
			<BackButton />

			{/* {address && <NFTActions nft={nft} />} */}
			<div style={{ backgroundImage: `url(${getNFTImages(cmId).bg})` }} className="nft_details_container flex items-center justify-center bg-cover mx-auto overflow-hidden">
				{/* MAIN CARD     */}
				<div className="nft_details_bg relative">
					{/* LEFT BAR */}
					<div className="p-4 w-32 z-20 absolute font-bold text-center">
						<img className="w-90 h-74 mx-auto opacity-20" src={Images.logoEthem} alt="logo" />
						<p className="mt-20 text-lg border-b border-white">{nft.edition}/10</p>
						<p className="text-sm">EDITION</p>
						<p className="mt-2 text-3xl">#{nft.id.padStart(4, '0')}</p>
					</div>

					{/* RIGHT BAR */}
					<div className="m-4 w-64 z-20 right-0 absolute border-white border-r">
						<div className="flex justify-end mx-2">
							<RankedStars amount={parseScore(nft.score)} />
						</div>
						<p className="font-bold text-right mx-2">{nft.score} HP</p>
						<p className="font-bold text-right mx-2">{formatELF(nft.rewards)} ELF</p>
					</div>

					{/* BOTTOM BAR */}
					<div className="px-4 h-40 z-20 w-full bottom-0 absolute overflow-hidden">
						<p className="font-bold text-5xl uppercase -mx-1">{nft.metadata.coin}</p>
						<div className="flex h-8 my-2">
							<div className="w-8 bg-white">
								<img src={getNFTImages(cmId).subclassIcon} alt="subclass icon" />
							</div>
							<div className=" w-48 px-2 bg-black uppercase text-lg">{nft.metadata.subClass}</div>
						</div>
						<div className="flex h-3 items-center mb-1 text-sm font-bold">
							<span className="w-8">ATK</span>
							<span style={{ width: `${nft.metadata.attack * 3}px` }} className="h-3 bg-white opacity-20"></span>
							<span className="pl-1 text-xs">{nft.metadata.attack}</span>
							<span className="flex-grow"></span>
							<span className="flex-none opacity-30 font-normal">Designer: {nft.metadata.artist}</span>
						</div>
						<div className="flex h-3 items-center mb-1 text-sm font-bold">
							<span className="w-8">DEF</span>
							<span style={{ width: `${nft.metadata.defence * 3}px` }} className="h-3 bg-white opacity-20"></span>
							<span className="pl-1 text-xs">{nft.metadata.defence}</span>
							<span className="flex-grow"></span>
							<span className="flex-none opacity-30 font-normal">Birth: {dateFormat(birthDate, 'mmm dd yyyy')}</span>
						</div>
						<div className="flex h-3 items-center mb-1 text-sm font-bold">
							<span className="w-8">SPD</span>
							<span style={{ width: `${nft.metadata.speed * 3}px` }} className="h-3 bg-white opacity-20"></span>
							<span className="pl-1 text-xs">{nft.metadata.speed}</span>
							<span className="flex-grow"></span>
							<span className="flex-none opacity-30 font-normal">Owner: {shortenAddress(nft.owner.id)}</span>
						</div>
					</div>

					{/* MAIN IMAGE */}
					<div className="nft_details_bg">
						<img className="z-10 animate-bounceSlow" src={getNFTImages(cmId).large} alt="Ethemeral Full Size" />
					</div>
				</div>

				{/* SIDE BAR */}
				<div className="nft_details_sidebar bg-black bg-opacity-50 z-20">
					{/* ACTIONS */}
					<div className="m-4">
						<h3 className="font-bold text-xs mb-2">ACTIONS</h3>
						<NFTActions nft={nft} />
					</div>

					{/* ABILITIES */}
					<div className="h-32 m-4 mt-8">
						<h3 className="font-bold text-xs">ABILITIES</h3>
					</div>

					{/* EQUIPMENT */}
					<div className="mt-8">
						<h3 className="font-bold text-xs mx-4 my-2">EQUIPMENT</h3>
						<div className="flex justify-center">
							<div className="w-14 h-14 mr-2 bg-gradient-to-br from-gray-600 to-gray-400 opacity-20 rounded-md border-2 border-white"></div>
							<div className="w-14 h-14 mr-2 bg-gradient-to-br from-gray-600 to-gray-400 opacity-20 rounded-md border-2 border-white"></div>
							<div className="w-14 h-14 mr-2 bg-gradient-to-br from-gray-600 to-gray-400 opacity-20 rounded-md border-2 border-white"></div>
							<div className="w-14 h-14 ml-2 bg-gradient-to-br from-gray-600 to-gray-400 opacity-20 rounded-md border-2 border-white"></div>
						</div>
					</div>

					{/* STATS */}
					<div className="m-4 mt-8">
						<h3 className="font-bold text-xs">RECORD</h3>
						<div className="text-gray-200 text-sm leading-7 grid grid-cols-2 gap-2 mt-1">
							<div className="bg-white bg-opacity-10 px-3 py-2">
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
							<div className="bg-white bg-opacity-10 px-3 py-2">
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
					<div className="m-4 mt-8">
						<h3 className="font-bold text-xs">HISTORY</h3>
						<ul className="text-gray-400 text-sm leading-6">
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
