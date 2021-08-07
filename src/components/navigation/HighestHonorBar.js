import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useCore } from '../../hooks/useCore';
import { useGQLQuery } from '../../hooks/useGQLQuery';
import { GET_NFT_LIGHT } from '../../queries/Subgraph';
import useUserAccount from '../../hooks/useUserAccount';
import { useNFTUtils } from '../../hooks/useNFTUtils';
import Images from '../../constants/Images';
import { formatELF } from '../../utils';

const NFTWinnerCard = ({ id }) => {
	const { data, status } = useGQLQuery(`nft_winner_${id}`, GET_NFT_LIGHT, { id: id }, { refetchOnMount: true });
	const { getNFTImages, getColorPalette } = useNFTUtils();

	const [subclass, setSubclass] = useState(undefined);
	const [cmId, setCmId] = useState(undefined);

	const [nft, setNFT] = useState(undefined);

	useEffect(() => {
		if (status === 'success' && data && data.ethemeral) {
			setNFT(data.ethemeral);
			setSubclass(data.ethemeral.metadata.subClass);
			setCmId(data.ethemeral.metadata.cmId);
		}
	}, [status, data, nft]);

	if (!nft) {
		return <div className="max-w-420 h-74 flex relative"></div>;
	}

	return (
		<div className="max-w-420 h-74 flex relative">
			{/* HP */}
			<div className="text-sm font-bold absolute right-0 text-right text-white z-10">
				<p className=" bg-yellow-400 rounded-l-md mt-1 px-2">{nft.score} HP</p>
			</div>
			{/* TOP BAR */}

			{/* MAIN IMAGE */}
			<div style={{ backgroundColor: `hsla(${getColorPalette(subclass).hue},35%,77%,1)` }} className="flex-shrink-0">
				<img width="74" height="74" src={getNFTImages(cmId).thumbnail} alt="" />
			</div>

			<div style={{ backgroundColor: `hsla(${getColorPalette(subclass).hue},18%,50%,1)` }} className="w-full relative ml-1">
				<div className="">
					<p className="text-sm text-white mt-1">
						#<span className="text-sm font-bold">{nft.id.padStart(4, '0')}</span>
					</p>
					<p className="text-xl font-medium">{nft.metadata.coin}</p>
				</div>

				<div className="flex h-5 absolute bottom-0 w-full">
					<div style={{ backgroundColor: `hsla(${getColorPalette(subclass).hue},100%,80%,1)` }} className="w-5">
						<img width="20px" height="20px" src={getNFTImages(cmId).subclassIcon} alt="subclass icon" />
					</div>
					<div className="w-full bg-black pl-2 uppercase text-sm font-bold text-white">{nft.metadata.subClass}</div>
					{/* STATS */}
					<div className="absolute z-10 flex justify-end right-2 bottom-1 space-x-1">
						<div className="relative">
							<img width="30px" height="30px" src={Images.iconAtk} />
							<span className="center text font-black">{nft.metadata.attack}</span>
						</div>
						<div className="relative">
							<img width="30px" height="30px" src={Images.iconDef} />
							<span className="center text font-black">{nft.metadata.defence}</span>
						</div>
						<div className="relative">
							<img width="30px" height="30px" src={Images.iconSpd} />
							<span className="center text font-black">{nft.metadata.speed}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const HighestHonorBar = () => {
	const history = useHistory();
	const { core } = useCore();
	const { account } = useUserAccount();
	const [winningCoin, setWinningCoin] = useState(false);
	const [isOwnedWinning, setIsOwnedWinning] = useState(false);

	useEffect(() => {
		if (account && core) {
			if (account.ethemerals.length > 0) {
				setIsOwnedWinning(false);
				account.ethemerals.forEach((userNFT) => {
					if (userNFT.id === core.winningCoin) {
						setIsOwnedWinning(true);
						setWinningCoin(userNFT);
					}
				});
			}
		}
	}, [account, core, winningCoin]);

	if (!core) {
		return null;
	}

	return (
		<div className="max-w-420 mx-auto mt-8">
			<div className="text-white font-bold flex items-center justify-between my-2">
				<p>LEADING ETHEMERAL</p>
				<button
					onClick={() => history.push(`/claim/${core.winningCoin}`)}
					className={`${isOwnedWinning ? 'bg-brandColor cursor-pointer hover:bg-yellow-400 transition duration-300' : 'bg-brandColor cursor-default opacity-20'} px-4 rounded text-white`}
				>
					{`REDEEM ${formatELF(core.winnerFunds)} ELF`}
				</button>
			</div>
			<NFTWinnerCard id={core.winningCoin} />
		</div>
	);
};

export default HighestHonorBar;
