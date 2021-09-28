import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams, Link } from 'react-router-dom';

import dateFormat from 'dateformat';

import { useNFTUtils } from '../hooks/useNFTUtils';
import Images from '../constants/Images';

import nftMetadata from '../constants/NFTMetadata';

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

const RankedStarsSmall = ({ amount }) => {
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

const NFTLargeDetail = ({ startingIndex }) => {
	const { getNFTImages, elements } = useNFTUtils();

	const [metaDataIndex, setMetaDataIndex] = useState(undefined);
	const [metaDataArray, setMetaDataArray] = useState(undefined);

	const birthDate = Date.now();

	useEffect(() => {
		if (nftMetadata && nftMetadata.all) {
			setMetaDataArray(nftMetadata.all[metaDataIndex]);
		}
	}, [metaDataIndex]);

	return (
		<div className="nft_details_bg relative bg-gray-800">
			{/* LEFT BAR */}
			<div className="p-4 w-32 z-20 absolute font-bold text-center">
				<img className="w-90 h-74 mx-auto opacity-20" src={Images.logoEthem} alt="logo" />
				<p className="mt-20 text-lg border-b border-white">1/10</p>
				<p className="text-sm">EDITION</p>
				<p className="mt-2 text-3xl">#{((metaDataIndex + 1) * 10).toString().padStart(4, '0')}</p>
			</div>

			{/* RIGHT BAR */}
			<div className="mx-2 my-4 w-64 z-20 right-0 absolute border-white border-r">
				<div className="flex justify-end mx-2">
					<RankedStars amount={3} />
				</div>
				<p className="font-bold text-right mx-2">300 HP</p>
				<p className="font-bold text-right mx-2">1000 ELF</p>
			</div>

			{/* BOTTOM BAR */}
			<div className="z-20 w-full bottom-0 absolute overflow-hidden">
				<p className="px-4 font-bold text-5xl uppercase -mx-1">{nftMetadata.coinName[metaDataIndex]}</p>
				<div style={{ height: '120px' }} className="bg-black w-full px-4 pb-4 pt-2 h">
					<div className="flex h-8 my-2">
						<div className="w-8 bg-white">
							<img src={getNFTImages(metaDataArray[0]).subclassIcon} alt="subclass icon" />
						</div>
						<div className=" w-48 px-2 bg-black uppercase text-lg">{nftMetadata.subclass[metaDataArray[1]][metaDataArray[2]]}</div>
					</div>
					<div className="flex h-3 items-center mb-1 text-sm font-bold">
						<span className="w-8">ATK</span>
						<span style={{ width: `${metaDataArray[3] * 3}px` }} className="h-3 bg-white opacity-20"></span>
						<span className="pl-1 text-xs">{metaDataArray[3]}</span>
						<span className="flex-grow"></span>
						<span className="flex-none opacity-30 font-normal">Designer: {nftMetadata.artist[metaDataIndex]}</span>
					</div>
					<div className="flex h-3 items-center mb-1 text-sm font-bold">
						<span className="w-8">DEF</span>
						<span style={{ width: `${metaDataArray[4] * 3}px` }} className="h-3 bg-white opacity-20"></span>
						<span className="pl-1 text-xs">{metaDataArray[4]}</span>
						<span className="flex-grow"></span>
						<span className="flex-none opacity-30 font-normal">Birth: {dateFormat(birthDate, 'mmm dd yyyy')}</span>
					</div>
					<div className="flex h-3 items-center mb-1 text-sm font-bold">
						<span className="w-8">SPD</span>
						<span style={{ width: `${metaDataArray[5] * 3}px` }} className="h-3 bg-white opacity-20"></span>
						<span className="pl-1 text-xs">{metaDataArray[5]}</span>
						<span className="flex-grow"></span>
						<span className="flex-none opacity-30 font-normal">Owner: </span>
					</div>
				</div>
			</div>

			{/* MAIN IMAGE */}
			<div className="nft_details_img relative">
				<div className="absolute bg-contain nft_details_img"></div>
				<img className="z-10 nft_details_img animate-bounceSlow absolute" src={getNFTImages(metaDataArray[0]).large} alt="Ethemeral Full Size" />
			</div>
		</div>
	);
};

const NFTPreviewCard = ({ nft }) => {
	const { getEquipmentImages, getEquipableTypePalette } = useNFTUtils();
	const [equipableType, setEquipableType] = useState(0);
	useEffect(() => {
		if (nft) {
			let stats = [nft.atk, nft.def, nft.spd];
			const eType = stats.reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0);

			setEquipableType(eType);
		}
	}, [nft]);

	if (!nft) {
		return <div>loading...</div>;
	}

	return (
		<div className="w-64 h-96 bg-blue-500 m-4 cursor-pointer bg-cover relative hover:shadow-2xl hover:border-gray-100 transition duration-300">
			{/* MAIN IMAGE */}
			<div className="absolute top-0 left-0">
				<img className="" src={getEquipmentImages(nft.id).preview} alt="" />
			</div>
			{/* TOP BAR */}

			<div style={{ bottom: '70px' }} className="w-full absolute z-10 flex justify-end right-2 space-x-1">
				<div className="relative">
					<img width="30px" height="30px" src={Images.iconAtk} />
					<span className="center text font-black">33</span>
				</div>
				<div className="relative">
					<img width="30px" height="30px" src={Images.iconDef} />
					<span className="center text font-black">33</span>
				</div>
				<div className="relative">
					<img width="30px" height="30px" src={Images.iconSpd} />
					<span className="center text font-black">33</span>
				</div>
			</div>

			{/* BOTTOM BAR */}
			<div style={{ backgroundColor: getEquipableTypePalette(equipableType) }} className="w-full h-24 bottom-0 absolute overflow-hidden">
				<p className="px-2 text-xs text-white bg-black">
					#<span className="text-sm font-bold">{nft.id.toString().padStart(4, '0')}</span>
				</p>
				<p className="px-2 text-2xl bottom-0 absolute pb-2">{nft.name}</p>
			</div>
		</div>
	);
};

const NFTLink = ({ itemId }) => {
	const { getEquipmentImages } = useNFTUtils();

	return (
		<div className="flex w-74 h-74 bg-gray-500 rounded hover:bg-gray-600 m-2 shadow-sm items-baseline relative">
			<div className="absolute top-0 left-0">
				<img className="" src={getEquipmentImages(itemId).thumbnail} alt="" />
			</div>
			<span className="flex-grow h-full"></span>
			<span className="text-sm font-bold text-gray-400 z-10">#{((itemId + 1) * 10).toString().padStart(4, '0')}</span>
		</div>
	);
};

const DevItems = () => {
	const { crop } = useParams();
	const history = useHistory();
	const [currentTab, setCurrentTab] = useState(0);

	const [allNFTs, setAllNfts] = useState([]);

	useEffect(() => {
		if (crop >= 0 && crop <= 3) {
			setCurrentTab(parseInt(crop));
		}
	}, [crop]);

	useEffect(() => {
		const _allNFTS = [];
		nftMetadata.slimes.forEach((slime) => {
			_allNFTS.push(slime);
		});
		nftMetadata.pets.forEach((pet) => {
			_allNFTS.push(pet);
		});
		nftMetadata.items.forEach((item) => {
			_allNFTS.push(item);
		});
		setAllNfts(_allNFTS);
	}, []);

	const previewCards = new Array(100).fill(0);

	return (
		<div>
			<div className="page_bg"></div>
			<h1 className="text-center">DEV ITEMS</h1>
			<div className="flex items-center justify-center">
				<button onClick={() => history.push(`/devitems/0`)} className={`${currentTab === 0 ? 'bg-brandColor-blue' : 'bg-gray-400'} p-2 m-2 rounded text-black hover:bg-white`}>
					Large Detail
				</button>
				<button onClick={() => history.push(`/devitems/1`)} className={`${currentTab === 1 ? 'bg-brandColor-blue' : 'bg-gray-400'} p-2 m-2 rounded text-black hover:bg-white`}>
					Preview Cards
				</button>
				<button onClick={() => history.push(`/devitems/3`)} className={`${currentTab === 3 ? 'bg-brandColor-blue' : 'bg-gray-400'} p-2 m-2 rounded text-black hover:bg-white`}>
					Thumbnails
				</button>
			</div>
			{/* {currentTab === 0 && (
				<div className="flex space-x-4 overflow-x-scroll">
					<NFTLargeDetail startingIndex={1} />
				</div>
			)} */}

			{currentTab === 1 && (
				<div className="flex flex-wrap mx-auto">
					{allNFTs.map((nft, index) => (
						<NFTPreviewCard key={index} nft={nft} />
					))}
				</div>
			)}

			{currentTab === 3 && (
				<div className="flex flex-wrap w-11/12 mx-auto">
					{allNFTs.map((nft, index) => (
						<NFTLink key={index} itemId={nft.id} />
					))}
				</div>
			)}
		</div>
	);
};

export default DevItems;
