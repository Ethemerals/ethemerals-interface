import { useEffect, useState } from 'react';
import Moralis from 'moralis';
import { useQuery } from 'react-query';

import nftMetadata from '../constants/NFTMetadata';
import { objectIDs } from '../constants/IdsMoralis';
import { Links } from '../constants/Links';

const MeralData = Moralis.Object.extend(
	'MeralData',
	{
		getCurrentColor: function () {
			return this.get('currentColor');
		},
		getColors: function () {
			return this.get('colors');
		},
		getIsColorUnlocked: function (col) {
			const colors = this.get('colors');
			return colors[col].unlocked;
		},
	},
	{
		// Class methods
		spawn: function (id) {
			const meralData = new MeralData();
			meralData.set('tokenId', id);
			meralData.set('currentColor', 0);
			const colors = [
				{ name: 'OG Color', unlocked: true },
				{ name: 'Color 1', unlocked: false },
				{ name: 'Color 2', unlocked: false },
				{ name: 'Color 3', unlocked: false },
				{ name: 'Color 4', unlocked: false },
				{ name: 'Color 5', unlocked: false },
			];

			meralData.set('colors', colors);
			return meralData;
		},
	}
);

export const getMeralImages = (cmId, currentColor = 0) => {
	let colors = {
		large: `${Links.BUCKET}${cmId}_large.png`,
		preview: `${Links.BUCKET}${cmId}_preview.png`,
		inventory: `${Links.BUCKET}${cmId}_inventory.png`,
		thumbnail: `${Links.BUCKET}${cmId}_thumbnail.png`,
	};

	if (currentColor > 0) {
		colors = {
			large: `${Links.BUCKET}${cmId}_large_${currentColor + 1}.png`,
			preview: `${Links.BUCKET}${cmId}_preview_${currentColor + 1}.png`,
			inventory: `${Links.BUCKET}${cmId}_inventory_${currentColor + 1}.png`,
			thumbnail: `${Links.BUCKET}${cmId}_thumbnail_${currentColor + 1}.png`,
		};
	}

	return colors;
};

const getMeralGlobal = async () => {
	const MeralGlobalObject = Moralis.Object.extend('MeralGlobal', {
		getGen1Colors: function () {
			return this.get('gen1');
		},
	});

	const query = new Moralis.Query(MeralGlobalObject);
	const meralGlobal = await query.get(objectIDs.meralGlobal);
	return meralGlobal;
};

const getMeralDataById = async (tokenId) => {
	const query = new Moralis.Query(MeralData);
	query.equalTo('tokenId', parseInt(tokenId));
	const results = await query.find();
	if (results && results.length > 0) {
		return results[0];
	}
	return null;
};

export const useMeralImagePaths = (tokenId, gen = 0) => {
	const tokenToRanks = nftMetadata.tokenToRanks;
	const cmId = nftMetadata.all[tokenToRanks[tokenId][0]][0];

	const [meralImagePaths, setMeralImagePaths] = useState(getMeralImages(cmId, 0));
	const { isLoading: meralGlobalIsLoading, data } = useQuery('meralGlobal', () => getMeralGlobal(), { refetchOnMount: false });

	useEffect(() => {
		if (data && !meralGlobalIsLoading) {
			let currentColors;
			if (gen === 0 || gen === 1) {
				currentColors = data.getGen1Colors();
				setMeralImagePaths(getMeralImages(cmId, currentColors[tokenId]));
			}
		}
	}, [data, tokenId, meralGlobalIsLoading]);

	return { meralImagePaths };
};

export const useMeralDataById = (tokenId) => {
	const [meralData, setMeralData] = useState(undefined);
	const { isLoading, data } = useQuery([`meralData_${tokenId}`], () => getMeralDataById(tokenId), { refetchOnMount: false });

	useEffect(() => {
		if (data && !isLoading) {
			setMeralData(data);
		}
	}, [data, isLoading]);

	return { meralData };
};

export const useChooseMeralImagePaths = () => {
	const tokenToRanks = nftMetadata.tokenToRanks;

	const chooseMeralImagePath = (tokenId, colorId) => {
		const cmId = nftMetadata.all[tokenToRanks[tokenId][0]][0];
		return getMeralImages(cmId, colorId);
	};

	return { chooseMeralImagePath };
};
