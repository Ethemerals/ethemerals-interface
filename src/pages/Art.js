import { useState, useEffect } from 'react';

import { metaCoinName } from '../constants/MetadataStats';

import FilterBar from '../components/FilterBar';
import FilterSearch from '../components/FilterSearch';

import gql from 'graphql-tag';
import NFTPreviewCard from '../components/NFTPreviewCard';
import { useHistory } from 'react-router-dom';
import Links from '../constants/Links';
import { GraphQLClient } from 'graphql-request';
import { useQuery } from 'react-query';

const Art = () => {
	const [coinData, setCoinData] = useState(undefined);

	const [coinFilterList, setCoinFilterList] = useState([]);
	const [ElementFilterList, setElementFilterList] = useState([]);

	useEffect(() => {
		let _coins = [];
		for (let i = 1; i < metaCoinName.length; i++) {
			//skip zero
			_coins.push({
				id: i,
				name: metaCoinName[i],
			});
		}
		setCoinData(_coins);
	}, []);

	return (
		<div>
			<div style={{ maxWidth: '864px' }} className="bg-white bg-opacity-40 text-black text-left mx-auto mt-20 p-6">
				<h1 className=" text-brandColor-purple text-3xl">The Great Art Hunt</h1>
				<p>
					Coming soon... Meanwhile checkout the{' '}
					<a href="https://medium.com/@ethemerals/ethemerals-the-great-art-hunt-5f44a3579325" className="text-blue-600" target="blank" rel="noreferrer">
						medium post
					</a>
				</p>
			</div>

			<div className="h-40"></div>
		</div>
	);
};

export default Art;
