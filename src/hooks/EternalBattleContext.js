import React, { useContext, useState, useEffect, createContext } from 'react';

import PriceFeeds from '../constants/PriceFeeds';

// CONTEXT
const EBScoreContext = createContext();
const EBAddScoreContext = createContext();

const EBNftsRegisterContext = createContext();
const EBGetBattleResultsContext = createContext();

// PROVIDER
export function useEBScoreContext() {
	return useContext(EBScoreContext);
}

export function useEBAddScoreContext() {
	return useContext(EBAddScoreContext);
}

export function useEBNftsRegisterContext() {
	return useContext(EBNftsRegisterContext);
}

export function useEBGetBattleResultsContext() {
	return useContext(EBGetBattleResultsContext);
}

export default function EBContextProvider({ children }) {
	const [allScores, setAllScores] = useState({});
	const [battleResults, setBattleResults] = useState({});
	const [nftIds, setNftIds] = useState([]);

	useEffect(() => {
		if (PriceFeeds && PriceFeeds.length > 0) {
			let _allScores = {};
			let _battleResults = {};
			for (let i = 0; i < PriceFeeds.length; i++) {
				_allScores[i.toString()] = {};
				_battleResults[i.toString()] = {};
			}

			setAllScores(_allScores);
			setBattleResults(_battleResults);
		}
	}, []);

	const registerNFT = (nft) => {
		let _nftIds = nftIds;
		if (nftIds.indexOf(parseInt(nft.id)) === -1) {
			_nftIds.push(nft.id);
			setNftIds(_nftIds);
		}
	};

	const updateBattleResults = (scores, priceFeedId) => {
		if (scores) {
			let longs = 0;
			let longsChange = 0;
			let shorts = 0;
			let shortsChange = 0;
			let winningLongNFT;
			let winLongMax = 0;
			let winningShortNFT;
			let winShortMax = 0;
			let longPosSize = 0;
			let shortPosSize = 0;

			for (let key of Object.keys(scores)) {
				let scoreObj = scores[key];
				if (scoreObj.long) {
					longs += scoreObj.resultScore;
					let rawResult = scoreObj.changeScore * (scoreObj.win ? 1 : -1);
					longsChange += rawResult;
					longPosSize += scoreObj.positionSize;
					if (rawResult > winLongMax) {
						winLongMax = rawResult;
						winningLongNFT = scoreObj.nft;
					}
				} else {
					shorts += scoreObj.resultScore;
					let rawResult = scoreObj.changeScore * (scoreObj.win ? 1 : -1);
					shortsChange += rawResult;
					shortPosSize += scoreObj.positionSize;
					if (rawResult > winShortMax) {
						winShortMax = rawResult;
						winningShortNFT = scoreObj.nft;
					}
				}
			}

			let _battleResult = {
				winningLongNFT,
				winningShortNFT,
				longs,
				shorts,
				longsChange,
				shortsChange,
				winLongMax,
				winShortMax,
				longPosSize,
				shortPosSize,
			};

			let _battleResults = battleResults;
			_battleResults[priceFeedId] = _battleResult;
			setBattleResults(_battleResults);
		}
	};

	const updateScore = (priceFeedId, nft, currentScore, changeScore, resultScore, win, long, positionSize) => {
		if (nft) {
			let _allScores = allScores;
			let _priceFeedScores = _allScores[priceFeedId];

			if (_priceFeedScores[nft.id]) {
				_priceFeedScores[nft.id].win = win;
				_priceFeedScores[nft.id].changeScore = changeScore;
				_priceFeedScores[nft.id].resultScore = resultScore;
			} else {
				_priceFeedScores[nft.id] = { currentScore, changeScore, resultScore, win, long, nft, positionSize };
			}

			_allScores[priceFeedId] = _priceFeedScores;

			setAllScores(_allScores);
			updateBattleResults(_priceFeedScores, priceFeedId);
		}
	};

	const getBattleResults = async (priceFeedId) => {
		return battleResults[priceFeedId];
	};

	return (
		<EBAddScoreContext.Provider value={updateScore}>
			<EBScoreContext.Provider value={allScores}>
				<EBGetBattleResultsContext.Provider value={getBattleResults}>
					<EBNftsRegisterContext.Provider value={registerNFT}>{children}</EBNftsRegisterContext.Provider>
				</EBGetBattleResultsContext.Provider>
			</EBScoreContext.Provider>
		</EBAddScoreContext.Provider>
	);
}
