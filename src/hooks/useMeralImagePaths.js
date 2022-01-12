import { useEffect, useState } from 'react';
import Moralis from 'moralis';
import { useQuery } from 'react-query';
import axios from 'axios';

import nftMetadata from '../constants/NFTMetadata';
import { objectIDs } from '../constants/IdsMoralis';

const getAllColors = async (set) => {
	try {
		const { data } = await axios.get(`${process.env.REACT_APP_API_MERALS}allcolors/${set}`);
		return data;
	} catch (error) {
		throw new Error('get allColors error');
	}
};

const getMeralGlobal = async () => {
	const MeralGlobalObject = Moralis.Object.extend('MeralGlobal', {
		getGen1Colors: function () {
			return this.get('gen1');
		},
		setGen1Colors: function (colors) {
			this.set('gen1', colors);
		},
	});

	const query = new Moralis.Query(MeralGlobalObject);
	const meralGlobal = query.get(objectIDs.meralGlobal);
	return meralGlobal;
};

const s3URL = 'https://ethemerals-media.s3.amazonaws.com/';

export const getMeralImages = (cmId, currentColor = 0) => {
	let colors = {
		large: `${s3URL}${cmId}_large.png`,
		preview: `${s3URL}${cmId}_preview.png`,
		inventory: `${s3URL}${cmId}_inventory.png`,
		thumbnail: `${s3URL}${cmId}_thumbnail.png`,
	};

	if (currentColor > 0) {
		colors = {
			large: `${s3URL}${cmId}_large_${currentColor + 1}.png`,
			preview: `${s3URL}${cmId}_preview_${currentColor + 1}.png`,
			inventory: `${s3URL}${cmId}_inventory_${currentColor + 1}.png`,
			thumbnail: `${s3URL}${cmId}_thumbnail_${currentColor + 1}.png`,
		};
	}

	return colors;
};

export const useMeralGlobal = () => {
	const [meralGlobal, setMeralGlobal] = useState(undefined);
	const { isLoading: meralGlobalIsLoading, data } = useQuery(['meralGlobal'], () => getMeralGlobal(), { refetchOnMount: false });

	useEffect(() => {
		if (data && !meralGlobalIsLoading) {
			setMeralGlobal(data);
		}
	}, [data]);

	return { meralGlobal, meralGlobalIsLoading };
};

export const useMeralImagePaths = (tokenId, set = 0) => {
	const tokenToRanks = nftMetadata.tokenToRanks;
	const cmId = nftMetadata.all[tokenToRanks[tokenId][0]][0];

	const [meralImagePaths, setMeralImagePaths] = useState(getMeralImages(cmId, 0));
	const { isLoading: meralImagesIsLoading, data } = useQuery(['allColors'], () => getAllColors(set), { refetchOnMount: false });

	useEffect(() => {
		if (data && !meralImagesIsLoading) {
			const currentColor = data.data.currentColor[tokenId];
			setMeralImagePaths(getMeralImages(cmId, currentColor));
		}
	}, [data, tokenId, meralImagesIsLoading]);

	return { meralImagePaths };
};

export const useChooseMeralImagePaths = () => {
	const tokenToRanks = nftMetadata.tokenToRanks;

	const chooseMeralImagePath = (tokenId, colorId) => {
		const cmId = nftMetadata.all[tokenToRanks[tokenId][0]][0];
		return getMeralImages(cmId).colors[colorId];
	};

	return { chooseMeralImagePath };
};
