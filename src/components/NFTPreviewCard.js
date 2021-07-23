import { useHistory } from 'react-router';
import { formatELF } from '../utils';
import { useNFTUtils } from '../hooks/useNFTUtils';

const RankedStars = ({ amount }) => {
	const starSVG = (
		<svg className="w-4 h-4" fill="goldenRod" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

const NFTPreviewCard = ({ nft }) => {
	const { getNFTImages, parseScore } = useNFTUtils();
	const history = useHistory();

	if (!nft) {
		return <p>Loading</p>;
	}

	const cmId = nft.metadata.cmId;

	const handleOnClick = () => {
		history.push(`/ethemeral/${nft.id}`);
	};

	return (
		<div
			onClick={handleOnClick}
			style={{ backgroundImage: "url('https://ethemerals-media.s3.amazonaws.com/nft_preview_bg.jpg')" }}
			className="w-64 h-96 m-4 cursor-pointer bg-cover relative border border-gray-500 shadow-xl hover:shadow-2xl hover:border-gray-100 transition duration-300"
		>
			{/* MAIN IMAGE */}
			<div className="absolute top-0 left-0">
				<img className="" src={getNFTImages(cmId).preview} alt="" />
			</div>

			{/* TOP BAR */}
			<div className="absolute flex items-center p-1 ">
				<RankedStars amount={parseScore(nft.score)} />
			</div>
			<div className="absolute right-0 text-right pr-2">
				<p>{nft.score} HP</p>
				<p>{formatELF(nft.rewards)} ELF</p>
			</div>

			{/* BOTTOM BAR */}
			<div className="p-2 w-full bottom-0 absolute overflow-hidden bg-gray-700 bg-opacity-90">
				<p className="text-xs font-bold text-gray-400"># {nft.id.padStart(4, '0')}</p>
				<p className="font-bold text-2xl uppercase">{nft.metadata.coin}</p>
				<div className="flex h-6 my-2">
					<div className="w-6 bg-white">
						<img src={getNFTImages(cmId).subclassIcon} alt="subclass icon" />
					</div>
					<div className="w-full pl-2 bg-black uppercase">{nft.metadata.subClass}</div>
				</div>
				<div className="flex h-2 items-center mb-1 text-xs">
					<span className="w-6">ATK</span>
					<span style={{ width: `${nft.metadata.attack * 2}px` }} className="h-10px bg-white opacity-40"></span>
					<span className="pl-1 text-xs">{nft.metadata.attack}</span>
					<span className="flex-grow"></span>
				</div>
				<div className="flex h-2 items-center mb-1 text-xs">
					<span className="w-6">DEF</span>
					<span style={{ width: `${nft.metadata.defence * 2}px` }} className="h-10px bg-white opacity-40"></span>
					<span className="pl-1 text-xs">{nft.metadata.defence}</span>
					<span className="flex-grow"></span>
				</div>
				<div className="flex h-2 items-center mb-1 text-xs">
					<span className="w-6">SPD</span>
					<span style={{ width: `${nft.metadata.speed * 2}px` }} className="h-10px bg-white opacity-40"></span>
					<span className="pl-1 text-xs">{nft.metadata.speed}</span>
					<span className="flex-grow"></span>
				</div>
			</div>
		</div>
	);
};

export default NFTPreviewCard;
