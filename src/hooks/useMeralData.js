import { useEffect, useState } from 'react';
import Moralis from 'moralis';
import { useQuery } from 'react-query';

import nftMetadata from '../constants/NFTMetadata';
import { Links } from '../constants/Links';

import { getIdFromType } from './useMeralUtils';
import { getMeralOriginDataById } from './dataObjects/MeralOriginData';

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

const MeralGlobal = Moralis.Object.extend('MeralGlobal', {
	setGen: function (gen) {
		this.set('gen', gen);
	},
	setColors: function (colors) {
		this.set('colors', colors);
	},
	getColors: function () {
		return this.get('colors');
	},
});

export const getMeralsFiltered = async (filters, order, page, firstEditions = false) => {
	try {
		const result = await Moralis.Cloud.run('meralsFiltered', { ...filters, ...order, page, firstEditions });
		return result;
	} catch (error) {
		throw new Error('get account error');
	}
};

const getMeralGlobalByGen = async (gen) => {
	const query = new Moralis.Query(MeralGlobal);
	query.equalTo('gen', gen);
	const result = await query.first();
	return result;
};

export const useMeralImagePaths = (tokenId, gen = 1, type = 1) => {
	const tokenToRanks = nftMetadata.tokenToRanks;
	const cmId = nftMetadata.all[tokenToRanks[tokenId][0]][0];

	const [meralImagePaths, setMeralImagePaths] = useState(getMeralImages(cmId, 0));
	const { isLoading: meralGlobalIsLoading, data } = useQuery(`meralGlobal${gen}`, () => getMeralGlobalByGen(gen), { refetchOnMount: false });

	useEffect(() => {
		if (data && !meralGlobalIsLoading) {
			let currentColors;
			currentColors = data.getColors();
			let index = tokenId - (gen - 1) * 1000 - 1;
			setMeralImagePaths(getMeralImages(cmId, currentColors[index]));
		}
	}, [data, tokenId, meralGlobalIsLoading, cmId, gen]);

	return { meralImagePaths };
};

export const useMeralDataById = (id) => {
	const [meral, setMeral] = useState(undefined);
	const { isLoading, data } = useQuery([`meralDataOld_${id}`], () => getMeralOriginDataById(id), { refetchOnMount: false });

	useEffect(() => {
		if (data && !isLoading) {
			setMeral(data);
		}
	}, [data, isLoading]);

	return { meral };
};

export const useMeralDataByIdType1 = (tokenId) => {
	const [meral, setMeral] = useState(undefined);
	let type = 1;
	const { isLoading, data } = useQuery([`meralDataOld_${getIdFromType(type, tokenId)}`], { refetchOnMount: false });

	useEffect(() => {
		if (data && !isLoading) {
			setMeral(data);
		}
	}, [data, isLoading]);

	return { meral };
};

export const useChooseMeralImagePaths = () => {
	const tokenToRanks = nftMetadata.tokenToRanks;

	const chooseMeralImagePath = (tokenId, colorId) => {
		const cmId = nftMetadata.all[tokenToRanks[tokenId][0]][0];
		return getMeralImages(cmId, colorId);
	};

	return { chooseMeralImagePath };
};
