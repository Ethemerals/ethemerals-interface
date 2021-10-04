import { useEffect, useState, useRef } from 'react';

import { useParams } from 'react-router-dom';
import dateFormat from 'dateformat';

import { useGQLQuery } from '../hooks/useGQLQuery';
import { useNFTUtils } from '../hooks/useNFTUtils';
import Images from '../constants/Images';
import { GET_NFT } from '../queries/Subgraph';

import { shortenAddress } from '../utils';
import BackButton from '../components/navigation/BackButton';

const RankedStars = ({ amount }) => {
	const starSVG = (
		<svg className="w-12 h-12" fill="white" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

const NFTDetails = () => {
	const { getNFTImages, parseScore, elements, getSubclassIcon, getSubclassBonus } = useNFTUtils();

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
		return <div></div>;
	}

	return (
		<div>
			{/* MAIN CARD */}
			<div className="os_nft_details_bg absolute z-50 left-0 top-0">
				{/* LEFT BAR */}
				<div className="p-4 w-36 z-20 absolute font-bold text-center">
					<img style={{ width: '124px', height: '102px' }} className="mx-auto" src={Images.logoEthem} alt="logo" />
					<p className=" mt-16 text-2xl border-b-4 border-white">{nft.edition}/10</p>
					<p className="text-xl">{nft.metadata.coin}</p>
					<p className="mt-8 text-xl">{elements[nft.bgId].element}</p>
					<p className="mt-8 text-4xl">#{nft.id.padStart(4, '0')}</p>
				</div>

				{/* RIGHT BAR */}
				<div className="mx-2 my-6 w-64 z-20 right-0 absolute border-white border-r-4">
					<div className="flex justify-end mx-2 mb-4">
						<RankedStars amount={parseScore(nft.score)} />
					</div>
					<div className="flex items-center justify-end">
						<p className="font-bold text-right mx-2 text-2xl">{nft.score} HP</p>
						<img width="24px" height="24px" className="mr-4" src={Images.iconShield} />
					</div>
					<div className="flex items-center justify-end">
						<p className="font-bold text-right mx-2 text-2xl">{nft.rewards} ELF</p>
						<img width="22px" height="22px" className="mr-4" src={Images.iconDrain} />
					</div>
				</div>

				{/* BOTTOM BAR */}
				<div className="z-20 w-full bottom-0 absolute overflow-hidden">
					<p className="px-4 font-bold text-7xl uppercase">{nft.metadata.coin}</p>
					<div style={{ height: '124px' }} className="bg-black pt-3 px-4">
						<div className="flex h-10">
							<div style={{ backgroundColor: `hsla(${getSubclassIcon(subclass).palette.hue},100%,70%,1)` }} className="w-10">
								<img src={getSubclassIcon(subclass).iconB} alt="subclass icon" />
							</div>
							<div className="px-2 uppercase text-3xl">{subclass}</div>
						</div>
						<div className="flex justify-between">
							<div className=" w-3/4 absolute bottom-2">
								<div className="flex h-4 items-center mb-1 text-lg font-bold">
									<span className="w-8 mr-3 text-white">ATK</span>
									<span style={{ width: `${(nft.atk - getSubclassBonus(subclass)[0] - nft.atkBonus) * 0.3}px` }} className="h-4 bg-gray-500"></span>
									<span style={{ width: `${nft.atkBonus * 0.3}px` }} className="h-4 bg-gray-400"></span>
									<span style={{ width: `${getSubclassBonus(subclass)[0] * 0.3}px`, backgroundColor: `hsla(${getSubclassIcon(subclass).palette.hue},100%, 70%, 1)` }} className="h-4"></span>
									<span className="pl-2 text-white">{nft.atk}</span>
								</div>
								<div className="flex h-4 items-center mb-1 text-lg font-bold">
									<span className="w-8 mr-3 text-white">DEF</span>
									<span style={{ width: `${(nft.def - getSubclassBonus(subclass)[1] - nft.defBonus) * 0.3}px` }} className="h-4 bg-gray-500"></span>
									<span style={{ width: `${nft.defBonus * 0.3}px` }} className="h-4 bg-gray-400"></span>
									<span style={{ width: `${getSubclassBonus(subclass)[1] * 0.3}px`, backgroundColor: `hsla(${getSubclassIcon(subclass).palette.hue},100%, 70%, 1)` }} className="h-4"></span>
									<span className="pl-2 text-white">{nft.def}</span>
								</div>
								<div className="flex h-4 items-center mb-1 text-lg font-bold">
									<span className="w-8 mr-3 text-white">SPD</span>
									<span style={{ width: `${nft.spd - getSubclassBonus(subclass)[2] - nft.spdBonus * 0.3}px` }} className="h-4 bg-gray-500"></span>
									<span style={{ width: `${nft.spdBonus * 0.3}px` }} className="h-4 bg-gray-400"></span>
									<span style={{ width: `${getSubclassBonus(subclass)[2] * 0.3}px`, backgroundColor: `hsla(${getSubclassIcon(subclass).palette.hue},100%, 70%, 1)` }} className="h-4"></span>
									<span className="pl-2 text-white">{nft.spd}</span>
								</div>
							</div>
							<div className="absolute bottom-2 right-4 text-lg text-right leading-relaxed text-gray-200 font-bold">
								<p>Birth: {dateFormat(birthDate, 'mmm dd yyyy')}</p>
								<p>Designer: {nft.metadata.artist}</p>
							</div>
						</div>
					</div>
				</div>

				{/* MAIN IMAGE */}
				<div style={{ backgroundColor: elements[nft.bgId].color, backgroundImage: `url("${elements[nft.bgId].img}")` }} className="absolute bg-contain os_nft_details_img"></div>
				<img className="z-10 os_nft_details_img absolute" src={getNFTImages(cmId).large} alt="Ethemeral Full Size" />
			</div>
		</div>
	);
};

export default NFTDetails;
