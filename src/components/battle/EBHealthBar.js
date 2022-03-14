import { useMeralImagePaths } from '../../hooks/useMerals';
import { useNFTUtils } from '../../hooks/useNFTUtils';
import ReactTooltip from 'react-tooltip';

const Thumbnail = ({ nft }) => {
	const { elements } = useNFTUtils();
	const { meralImagePaths } = useMeralImagePaths(nft);

	if (!meralImagePaths) {
		return <div style={{ width: '42px', height: '42px' }} className="bg-white"></div>;
	}
	const bgImg = meralImagePaths.thumbnail;

	return (
		<div style={{ backgroundColor: elements[nft.element].color, width: '42px', height: '42px' }} className="relative">
			<img style={{ width: '42px', height: '42px' }} src={bgImg} alt="" />
		</div>
	);
};

const EBHealthBar = ({ data }) => {
	let longWinner = data.winLongMax > 0 ? data.winLongMax : 1;
	let shortWinner = data.winShortMax > 0 ? data.winShortMax : 1;

	// make sure positive
	longWinner *= 10000;
	shortWinner *= 10000;
	let winTotals = longWinner + shortWinner;

	let longWinnerP = parseInt((longWinner / winTotals) * 100);
	let shortWinnerP = parseInt((shortWinner / winTotals) * 100);

	let longs = data.longsChange > 0 ? data.longsChange : 1;
	let shorts = data.shortsChange > 0 ? data.shortsChange : 1;

	// make sure positive
	longs *= 10000;
	shorts *= 10000;
	let totalScores = longs + shorts;

	let longsP = parseInt((longs / totalScores) * 100);
	let shortsP = parseInt((shorts / totalScores) * 100);

	// width = 198 - 14% for slant

	return (
		<>
			<div className="flex items-stretch m-2 shadow ">
				<button data-tip data-for={`ttLongWinner${data.winningLongNFT.id}`}>
					<Thumbnail nft={data.winningLongNFT} />
				</button>
				<ReactTooltip id={`ttLongWinner${data.winningLongNFT.id}`} type="dark" effect="solid">
					<div className="font-sans">
						<p className="mb-4">
							Winning Long Meral:
							<span className="uppercase">{` ${data.winningLongNFT.coin} #${data.winningLongNFT.id.padStart(4, '0')}`}</span>
						</p>

						<p>
							Total Combined Results: <span className={`${data.longsChange > 0 ? 'text-green-500' : 'text-red-500'}`}>{data.longsChange > 0 ? `+${data.longsChange}` : data.longsChange} </span>
						</p>
						<p>
							Total Combined HP Staked: <span>{data.longPosSize}</span>
						</p>
					</div>
				</ReactTooltip>
				<div className="bg-white flex-grow text-white border-blue-200 border">
					<div className="flex relative">
						<div className="bg-green-200" style={{ width: `${longWinnerP - 6}%`, height: '36px' }}>
							<span className="text-indigo-800 text-xs absolute left-0 font-bold pl-1">{data.winLongMax}</span>
						</div>
						<div className="bg-pink-200 text-green-200">
							<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M0 0H28L0 36V0Z" fill="currentColor" />
							</svg>
						</div>
						<div className="bg-pink-200" style={{ width: `${shortWinnerP - 6}%`, height: '36px' }}>
							<span className="text-indigo-800 text-xs absolute right-0 bottom-0 font-bold pr-1">{data.winShortMax}</span>
						</div>
					</div>
					<div className="flex relative">
						<div className="bg-green-600" style={{ width: `${longsP}%`, height: '5px' }}></div>
						<div className="bg-pink-600" style={{ width: `${shortsP}%`, height: '5px' }}></div>
					</div>
				</div>
				<button data-tip data-for={`ttShortWinner${data.winningShortNFT.id}`}>
					<Thumbnail nft={data.winningShortNFT} />
				</button>

				<ReactTooltip id={`ttShortWinner${data.winningShortNFT.id}`} type="dark" effect="solid">
					<div className="font-sans">
						<p className="mb-4">
							Winning Short Meral:
							<span className="uppercase">{` ${data.winningShortNFT.coin} #${data.winningShortNFT.id.padStart(4, '0')}`}</span>
						</p>

						<p>
							Total Combined Results: <span className={`${data.shortsChange > 0 ? 'text-green-500' : 'text-red-500'}`}>{data.shortsChange > 0 ? `+${data.shortsChange}` : data.shortsChange} </span>
						</p>
						<p>
							Total Combined HP Staked: <span>{data.shortPosSize}</span>
						</p>
					</div>
				</ReactTooltip>
			</div>
		</>
	);
};

export default EBHealthBar;
