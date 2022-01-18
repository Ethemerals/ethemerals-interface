import { useEffect, useState } from 'react';
import Moralis from 'moralis';
import { useQuery } from 'react-query';

import nftMetadata from '../constants/NFTMetadata';
import { objectIDs } from '../constants/IdsMoralis';
import { Links } from '../constants/Links';

import { getIdFromType } from './useMeralUtils';
import { getMeralOriginDataById, getMeralOriginDataByTokenId } from './dataObjects/MeralOriginData';

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

export const getMeralImagesByTokenId = (tokenId, currentColor = 0) => {
	const tokenToRanks = nftMetadata.tokenToRanks;
	const cmId = nftMetadata.all[tokenToRanks[tokenId][0]][0];
	return getMeralImages(cmId, currentColor);
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
	}, [data, tokenId, meralGlobalIsLoading, cmId, gen]);

	return { meralImagePaths };
};

export const useMeralDataById = (id) => {
	const [meralData, setMeralData] = useState(undefined);
	const { isLoading, data } = useQuery([`meralData_${id}`], () => getMeralOriginDataById(id), { refetchOnMount: false });

	useEffect(() => {
		if (data && !isLoading) {
			setMeralData(data);
		}
	}, [data, isLoading]);

	return { meralData };
};

export const useMeralDataByIdType1 = (tokenId) => {
	const [meralData, setMeralData] = useState(undefined);
	let type = 1;
	const { isLoading, data } = useQuery([`meralData_${getIdFromType(type, tokenId)}`], () => getMeralOriginDataByTokenId(type, tokenId), { refetchOnMount: false });

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

export const combineMeralData = (meralL1, meralL2) => {
	let meral = { ...meralL1, ...meralL2 };
	meral.id = meralL1.id;
	return meral;
};
