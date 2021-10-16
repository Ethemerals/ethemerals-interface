import { useEffect, useState } from 'react';

import { useQuery } from 'react-query';
import axios from 'axios';

import nftMetadata from '../constants/NFTMetadata';

const getAllColors = async (set) => {
	try {
		const { data } = await axios.get(`${process.env.REACT_APP_API_MERALS}allcolors/${set}`);
		return data;
	} catch (error) {
		throw new Error('get allColors error');
	}
};

const s3URL = 'https://ethemerals-media.s3.amazonaws.com/';

const getMeralImages = (cmId) => {
	let base = {
		large: `${s3URL}${cmId}_large.png`,
		preview: `${s3URL}${cmId}_preview.png`,
		inventory: `${s3URL}${cmId}_inventory.png`,
		thumbnail: `${s3URL}${cmId}_thumbnail.png`,
	};
	let color2 = {
		large: `${s3URL}${cmId}_large_2.png`,
		preview: `${s3URL}${cmId}_preview_2.png`,
		inventory: `${s3URL}${cmId}_inventory_2.png`,
		thumbnail: `${s3URL}${cmId}_thumbnail_2.png`,
	};
	let color3 = {
		large: `${s3URL}${cmId}_large_3.png`,
		preview: `${s3URL}${cmId}_preview_3.png`,
		inventory: `${s3URL}${cmId}_inventory_3.png`,
		thumbnail: `${s3URL}${cmId}_thumbnail_3.png`,
	};
	let special = {
		large: `${s3URL}${cmId}_large_special.png`,
		preview: `${s3URL}${cmId}_preview_special.png`,
		inventory: `${s3URL}${cmId}_inventory_special.png`,
		thumbnail: `${s3URL}${cmId}_thumbnail_special.png`,
	};

	let colors = [base, color2, color3, special];

	return { colors };
};

export const useMeralImagePaths = (tokenId, set = 0) => {
	const [meralImagePaths, setMeralImagePaths] = useState(undefined);

	const { isLoading: meralImagesIsLoading, data } = useQuery(['allColors'], () => getAllColors(set), { refetchOnMount: false });

	useEffect(() => {
		if (data && !meralImagesIsLoading) {
			const tokenToRanks = nftMetadata.tokenToRanks;
			const cmId = nftMetadata.all[tokenToRanks[tokenId][0]][0];
			setMeralImagePaths(getMeralImages(cmId).colors[data.data.currentColor[tokenId]]);
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
