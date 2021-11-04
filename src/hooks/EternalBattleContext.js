import React, { useContext, useState, useEffect, createContext } from 'react';

import PriceFeeds from '../constants/PriceFeeds';

// CONTEXT
const EBScoreContext = createContext();
const EBAddScoreContext = createContext();
const EBNftsContext = createContext();
const EBNftsRegisterContext = createContext();

// PROVIDER
export function useEBScoreContext() {
	return useContext(EBScoreContext);
}

export function useEBAddScoreContext() {
	return useContext(EBAddScoreContext);
}

export function useEBNftsContext() {
	return useContext(EBNftsContext);
}

export function useEBNftsRegisterContext() {
	return useContext(EBNftsRegisterContext);
}

export default function EBContextProvider({ children }) {
	const [allScores, setAllScores] = useState({});
	const [nftIds, setNftIds] = useState([]);

	useEffect(() => {
		if (PriceFeeds && PriceFeeds.length > 0) {
			let _allScores = {};
			for (let i = 0; i < PriceFeeds.length; i++) {
				_allScores[i.toString()] = {};
			}

			setAllScores(_allScores);
		}
	}, []);

	const registerNFT = (nft) => {
		let _nftIds = nftIds;
		if (nftIds.indexOf(parseInt(nft.id)) === -1) {
			_nftIds.push(nft.id);
			setNftIds(_nftIds);
		}
	};

	const addScore = async (priceFeedId, nft, score, long) => {
		if (nft) {
			let _allScores = allScores;
			let _priceFeedScores = _allScores[priceFeedId];

			if (_priceFeedScores[nft.id]) {
				_priceFeedScores[nft.id].score = score;
			} else {
				_priceFeedScores[nft.id] = { score, long };
			}

			_allScores[priceFeedId] = _priceFeedScores;

			setAllScores(_allScores);
		}
	};

	return (
		<EBScoreContext.Provider value={allScores}>
			<EBNftsContext.Provider value={nftIds}>
				<EBNftsRegisterContext.Provider value={registerNFT}>
					<EBAddScoreContext.Provider value={addScore}>{children}</EBAddScoreContext.Provider>
				</EBNftsRegisterContext.Provider>
			</EBNftsContext.Provider>
		</EBScoreContext.Provider>
	);
}
