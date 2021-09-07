import { useHistory } from 'react-router-dom';
import { useNFTUtils } from '../../hooks/useNFTUtils';

const RankedStars = ({ amount }) => {
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

const UserInventoryHero = ({ userNFTs, mainIndex, toggle, toggleExtra }) => {
	const { getNFTImages, parseScore, elements } = useNFTUtils();
	const history = useHistory();

	const handleClick = () => {
		history.push(`/ethemeral/${userNFTs[mainIndex].id}`);
		toggle();
	};

	return (
		<>
			<div
				className="flex-grow cursor-pointer bg-customBlue-dark relative overflow-hidden bg-cover bg-center text-white"
				style={{ backgroundColor: elements[userNFTs[mainIndex].bgId].color, backgroundImage: `url("${elements[userNFTs[mainIndex].bgId].img}")` }}
			>
				{/* RIGHT BAR */}
				<div className="right-0 absolute p-1 text-right text-sm font-bold z-10">
					<div className="flex justify-end">
						<RankedStars amount={parseScore(userNFTs[mainIndex].score)} />
					</div>
					<p>{userNFTs[mainIndex].score} HP</p>
					<p>{userNFTs[mainIndex].rewards} ELF</p>
				</div>

				{/* BOTTOM BAR */}
				<div className="px-1 w-full bottom-0 absolute bg-black bg-opacity-70 z-20 flex items-center">
					<span className="font-bold text-lg uppercase">{userNFTs[mainIndex].metadata.coin}</span>
					<span className="flex-grow"></span>
					<span className="text-lg font-bold">#{userNFTs[mainIndex].id.padStart(4, '0')}</span>
				</div>
				{/* MAIN IMAGE */}

				<div onClick={handleClick} className="absolute top-0 left-0 w-full h-28">
					<img className="" src={getNFTImages(userNFTs[mainIndex].metadata.id).inventory} alt="" />
				</div>
			</div>
			<div className="px-1 font-bold text-sm absolute top-44">
				<button onClick={toggleExtra} className="cursor-pointer hover:text-brandColor-pale text-brandColor transition duration-300">
					CHANGE ACTIVE ETHEMERAL
				</button>
			</div>
		</>
	);
};

export default UserInventoryHero;
