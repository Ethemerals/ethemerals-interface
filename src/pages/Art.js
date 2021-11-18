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
		<div className="">
			<div className="page_bg"></div>
			{/* <div className="w-full h-48">hi</div> */}

			{/* SIDEBAR */}
			{/* <div className="h-screen w-72 fixed border-r border-gray-400 overflow-y-scroll">
				<div className="">Filter</div>
				<div className="flex">
					{coinData && <FilterSearch data={coinData} setFilterList={setCoinFilterList} keys={['name', 'email']} filterList={coinFilterList} filterByText="by Coin" />}
					{coinData && <FilterSearch data={coinData} setFilterList={setElementFilterList} keys={['name', 'email']} filterList={ElementFilterList} filterByText="by Coin" />}
				</div>
			</div>

			<div className="flex items-center">
				<FilterBar setFilterList={setCoinFilterList} filterList={coinFilterList} />
				<FilterBar setFilterList={setElementFilterList} filterList={ElementFilterList} />
			</div> */}

			<div className="h-40"></div>
		</div>
	);
};

export default Art;
