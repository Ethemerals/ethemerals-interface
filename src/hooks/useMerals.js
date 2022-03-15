import { useEffect, useState } from 'react';
import Moralis from 'moralis';
import { useQuery } from 'react-query';

import { Links } from '../constants/Links';
import { getGenByTokenId } from './useMeralsUtils';

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

export const getMeralDataById = async (meralId) => {
	const MeralData = Moralis.Object.extend('MeralData');
	const query = new Moralis.Query(MeralData);
	query.equalTo('meralId', meralId);
	const result = await query.first();
	return result;
};

const getMeralGlobalByGen = async (gen) => {
	const MeralGlobal = Moralis.Object.extend('MeralGlobal', {
		getColors: function () {
			return this.get('colors');
		},
	});
	const query = new Moralis.Query(MeralGlobal);
	query.equalTo('gen', gen);
	const result = await query.first();
	return result;
};

export const useMeralDataById = (id) => {
	const [meralData, setMeralData] = useState(undefined);
	const [currentColor, setCurrentColor] = useState(undefined);
	const { isLoading, data } = useQuery(`meralData_${id}`, () => getMeralDataById(id), { refetchOnMount: true });

	useEffect(() => {
		if (data && !isLoading) {
			setMeralData(data);
			setCurrentColor(data.get('currentColor'));
		}
	}, [data, isLoading]);

	return { meralData, currentColor };
};

export const useMeralGlobal = (tokenId) => {
	const gen = getGenByTokenId(tokenId);
	const [globalColors, setGlobalColors] = useState(undefined);
	const { isLoading, data } = useQuery(`meralGlobal_${gen}`, () => getMeralGlobalByGen(gen), { refretchOnMount: false });

	useEffect(() => {
		if (data && !isLoading) {
			setGlobalColors(data.get('colors'));
		}
	}, [data, isLoading]);

	return { globalColors };
};

export const useMeralImagePaths = (nft) => {
	const tokenId = nft.tokenId;
	let cmId = nft.cmId;
	const gen = getGenByTokenId(tokenId);

	const [meralImagePaths, setMeralImagePaths] = useState(getMeralImages(cmId, 0));
	const { isLoading: meralGlobalIsLoading, data } = useQuery(`meralGlobal_${gen}`, () => getMeralGlobalByGen(gen), { refetchOnMount: false });

	useEffect(() => {
		if (data && !meralGlobalIsLoading) {
			let currentColors;
			currentColors = data.getColors();
			setMeralImagePaths(getMeralImages(cmId, currentColors[tokenId]));
		}
	}, [data, tokenId, meralGlobalIsLoading, cmId, gen]);

	return { meralImagePaths };
};
