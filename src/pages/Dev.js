import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams, Link } from 'react-router-dom';

import dateFormat from 'dateformat';

import { useNFTUtils } from '../hooks/useNFTUtils';
import Images from '../constants/Images';

import nftMetadata from '../constants/NFTMetadata';

// prettier-ignore

const useInterval = (callback, delay) => {
	const savedCallback = useRef();

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		function tick() {
			savedCallback.current();
		}
		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
};

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

const RankedStarsInventory = ({ amount }) => {
	const starSVG = (
		<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

const ModalMenuItem = ({ toggle, selected, text }) => {
	return (
		<span onClick={toggle} className={`"cursor-pointer text-lg px-4 pb-2 py-3 ${selected ? 'text-white bg-brandColor-purple' : ' text-gray-400 hover:text-gray-100'}`}>
			{text}
		</span>
	);
};

const NFTLargeDetail = ({ startingIndex }) => {
	const { getNFTImages, backgrounds } = useNFTUtils();
	const { register, watch } = useForm();

	const [metaDataIndex, setMetaDataIndex] = useState(undefined);
	const [metaDataArray, setMetaDataArray] = useState(undefined);
	const [bgChoice, setBgChoice] = useState(0);

	const watchIndex = watch('rankIndex', startingIndex);

	const birthDate = Date.now();

	useEffect(() => {
		if (nftMetadata && nftMetadata.all) {
			setMetaDataArray(nftMetadata.all[metaDataIndex]);
		}
	}, [metaDataIndex]);

	useEffect(() => {
		if (watchIndex > 0 && watchIndex <= 100) {
			let newIndex = watchIndex - 1;
			setMetaDataIndex(newIndex);
		}
	}, [watchIndex]);

	useInterval(() => {
		if (bgChoice >= backgrounds.length - 1) {
			setBgChoice(0);
		} else {
			setBgChoice(bgChoice + 1);
		}
	}, 2000);

	if (!metaDataArray || metaDataIndex === undefined) {
		return <p>Loading</p>;
	}

	return (
		<div className="nft_details_bg relative bg-gray-800">
			{/* LEFT BAR */}
			<div className="p-4 w-32 z-20 absolute font-bold text-center">
				<img className="w-90 h-74 mx-auto opacity-20" src={Images.logoEthem} alt="logo" />
				<form onSubmit={(e) => e.preventDefault()} className="absolute">
					<input type="number" defaultValue={startingIndex} className="text-black w-12 font-bold text-xl" {...register('rankIndex')} />
				</form>
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
				<div style={{ backgroundImage: `url("${backgrounds[bgChoice].img}")` }} className="absolute bg-contain nft_details_img"></div>
				<img className="z-10 nft_details_img animate-bounceSlow absolute" src={getNFTImages(metaDataArray[0]).large} alt="Ethemeral Full Size" />
			</div>
		</div>
	);
};

const NFTPreviewCard = ({ startingIndex }) => {
	const { getNFTImages, getColorPalette } = useNFTUtils();
	let metaDataIndex = startingIndex;

	const [metaDataArray, setMetaDataArray] = useState(undefined);

	useEffect(() => {
		if (nftMetadata && nftMetadata.all) {
			let rankIndex = startingIndex;
			if (startingIndex <= 0) {
				rankIndex = 0;
			}
			if (startingIndex > 100) {
				rankIndex = 1;
			}
			setMetaDataArray(nftMetadata.all[rankIndex]);
		}
	}, [startingIndex]);

	if (!metaDataArray || metaDataIndex === undefined) {
		return <p>Loading</p>;
	}

	return (
		<div
			style={{ backgroundColor: `hsla(${getColorPalette(nftMetadata.subclass[metaDataArray[1]][metaDataArray[2]]).hue},5%,66%,0.5)` }}
			className="w-64 h-96 m-4 cursor-pointer bg-cover relative hover:shadow-2xl hover:border-gray-100 transition duration-300"
		>
			<div className="text-xs font-bold absolute right-0 text-right text-white z-10">
				<p className=" bg-yellow-400 rounded-l-md mt-1 px-2">300 HP</p>
			</div>

			{/* BORDER */}
			<div style={{ borderColor: `hsla(${getColorPalette(nftMetadata.subclass[metaDataArray[1]][metaDataArray[2]]).hue},20%,90%,1)` }} className=" w-60 h-80 top-6 absolute left-2 border-8"></div>

			{/* MAIN IMAGE */}
			<div className="absolute top-0 left-0">
				<img className="w-64 h-96 z-0" src={getNFTImages(metaDataArray[0]).preview} alt="" />
			</div>
			{/* TOP BAR */}
			<div className="absolute flex items-center p-1 ">
				<RankedStarsSmall amount={3} />
			</div>

			<div style={{ bottom: '64px' }} className="w-full absolute z-10 flex justify-end right-2 space-x-1">
				<div className="relative">
					<img width="30px" height="30px" src={Images.iconAtk} />
					<span className="center text font-black">{metaDataArray[3]}</span>
				</div>
				<div className="relative">
					<img width="30px" height="30px" src={Images.iconDef} />
					<span className="center text font-black">{metaDataArray[4]}</span>
				</div>
				<div className="relative">
					<img width="30px" height="30px" src={Images.iconSpd} />
					<span className="center text font-black">{metaDataArray[5]}</span>
				</div>
			</div>

			{/* BOTTOM BAR */}
			<div style={{ backgroundColor: `hsla(${getColorPalette(nftMetadata.subclass[metaDataArray[1]][metaDataArray[2]]).hue},40%,40%,0.8)` }} className="w-full bottom-0 absolute overflow-hidden">
				<div className="px-2 py-1">
					<p className="text-xs text-white">
						#<span className="text-sm font-bold">{((metaDataIndex + 1) * 10).toString().padStart(4, '0')}</span>
					</p>
					<p className="text-2xl font-medium">{nftMetadata.coinName[metaDataIndex]}</p>
					<div className="flex h-6 my-1">
						<div style={{ backgroundColor: `hsla(${getColorPalette(nftMetadata.subclass[metaDataArray[1]][metaDataArray[2]]).hue},100%,80%,1)` }} className="w-6">
							<img src={getNFTImages(metaDataArray[0]).subclassIcon} alt="subclass icon" />
						</div>
						<div className="w-full bg-black pl-2 uppercase font-bold text-white">{nftMetadata.subclass[metaDataArray[1]][metaDataArray[2]]}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const NFTInventoryHero = ({ startingIndex }) => {
	const { getNFTImages } = useNFTUtils();
	let metaDataIndex = startingIndex;

	const [metaDataArray, setMetaDataArray] = useState(undefined);

	useEffect(() => {
		if (nftMetadata && nftMetadata.all) {
			let rankIndex = startingIndex;
			if (startingIndex <= 0) {
				rankIndex = 0;
			}
			if (startingIndex > 100) {
				rankIndex = 1;
			}
			setMetaDataArray(nftMetadata.all[rankIndex]);
		}
	}, [startingIndex]);

	if (!metaDataArray || metaDataIndex === undefined) {
		return <p>Loading</p>;
	}

	return (
		<div className="w-420 max-w-420 overflow-hidden z-30 tracking-wide shadow-xl rounded h-96 m-4">
			{/* nav */}
			<div className="flex items-center bg-gray-700 cursor-pointer">
				<ModalMenuItem selected={true} text="Inventory" />
				<ModalMenuItem selected={false} text="Balance" />
				<ModalMenuItem selected={false} text="Account" />
				<span className="flex-grow cursor-auto"></span>
			</div>

			<div className="w-full h-420 bg-gray-800 bg-opacity-100 rounded rounded-t-none overflow-hidden z-30 tracking-wide shadow-xl">
				<div className="h-28 m-4">
					<div className="flex h-28 border border-gray-700">
						<div className="flex-grow cursor-pointer bg-gray-900 relative overflow-hidden" style={{ backgroundImage: "url('https://ethemerals-media.s3.amazonaws.com/nft_preview_bg.jpg')" }}>
							<div className="left-0 absolute px-2 py-1 text-left text-sm font-bold z-10">
								<p>#{((metaDataIndex + 1) * 10).toString().padStart(4, '0')}</p>
								<button className="py-1 cursor-pointer text-xs hover:text-yellow-400 text-blue-400 transition duration-300">change</button>
							</div>

							{/* RIGHT BAR */}
							<div className="right-0 absolute p-2 text-right text-sm font-bold z-10">
								<div className="flex justify-end">
									<RankedStarsInventory amount={3} />
								</div>
								<p>300 HP</p>
								<p>1000 ELF</p>
							</div>

							{/* BOTTOM BAR */}
							<div className="w-full bottom-0 absolute text-center bg-black bg-opacity-50 z-20">
								<span className="font-bold text-lg uppercase text-center">{nftMetadata.coinName[metaDataIndex]}</span>
							</div>
							{/* MAIN IMAGE */}

							<div className="absolute top-0 left-0 w-full h-28">
								<img className="" src={getNFTImages(metaDataArray[0]).inventory} alt="" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const NFTLink = ({ startingIndex }) => {
	const { getNFTImages } = useNFTUtils();

	let metaDataIndex = startingIndex;

	const [metaDataArray, setMetaDataArray] = useState(undefined);

	useEffect(() => {
		if (nftMetadata && nftMetadata.all) {
			let rankIndex = startingIndex;
			if (startingIndex <= 0) {
				rankIndex = 0;
			}
			if (startingIndex > 100) {
				rankIndex = 1;
			}
			setMetaDataArray(nftMetadata.all[rankIndex]);
		}
	}, [startingIndex]);

	if (!metaDataArray || metaDataIndex === undefined) {
		return <p>Loading</p>;
	}

	return (
		<div className="flex w-74 h-74 bg-gray-500 rounded hover:bg-gray-600 m-2 shadow-sm items-baseline relative">
			<div className="absolute top-0 left-0">
				<img className="" src={getNFTImages(metaDataArray[0]).thumbnail} alt="" />
			</div>
			<span className="flex-grow h-full"></span>
			<span className="text-sm font-bold text-gray-400 z-10">#{((metaDataIndex + 1) * 10).toString().padStart(4, '0')}</span>
		</div>
	);
};

const Dev = () => {
	const { crop } = useParams();
	const history = useHistory();
	const [currentTab, setCurrentTab] = useState(0);

	useEffect(() => {
		if (crop >= 0 && crop <= 3) {
			setCurrentTab(parseInt(crop));
		}
	}, [crop]);

	const previewCards = new Array(100).fill(0);
	const inventoryCards = new Array(100).fill(0);
	const thumbnails = new Array(100).fill(0);

	return (
		<div>
			<div className="page_bg"></div>
			<h1 className="text-center">DEV</h1>
			<div className="flex items-center justify-center">
				<button onClick={() => history.push(`/dev/0`)} className={`${currentTab === 0 ? 'bg-brandColor-blue' : 'bg-gray-400'} p-2 m-2 rounded text-black hover:bg-white`}>
					Large Detail
				</button>
				<button onClick={() => history.push(`/dev/1`)} className={`${currentTab === 1 ? 'bg-brandColor-blue' : 'bg-gray-400'} p-2 m-2 rounded text-black hover:bg-white`}>
					Preview Cards
				</button>
				<button onClick={() => history.push(`/dev/2`)} className={`${currentTab === 2 ? 'bg-brandColor-blue' : 'bg-gray-400'} p-2 m-2 rounded text-black hover:bg-white`}>
					Inventory Hero
				</button>
				<button onClick={() => history.push(`/dev/3`)} className={`${currentTab === 3 ? 'bg-brandColor-blue' : 'bg-gray-400'} p-2 m-2 rounded text-black hover:bg-white`}>
					Thumbnails
				</button>
			</div>
			{currentTab === 0 && (
				<div className="flex space-x-4 overflow-x-scroll">
					<NFTLargeDetail startingIndex={1} />
					<NFTLargeDetail startingIndex={2} />
					<NFTLargeDetail startingIndex={3} />
				</div>
			)}

			{currentTab === 1 && (
				<div className="flex flex-wrap mx-auto">
					{previewCards.map((card, index) => (
						<NFTPreviewCard key={index} startingIndex={index} />
					))}
				</div>
			)}

			{currentTab === 2 && (
				<div className="flex flex-wrap mx-auto">
					{inventoryCards.map((card, index) => (
						<NFTInventoryHero key={index} startingIndex={index} />
					))}
				</div>
			)}

			{currentTab === 3 && (
				<div className="flex flex-wrap w-11/12 mx-auto">
					{thumbnails.map((card, index) => (
						<NFTLink key={index} startingIndex={index} />
					))}
				</div>
			)}
		</div>
	);
};

export default Dev;
