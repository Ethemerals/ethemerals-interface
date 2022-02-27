import { useState, useEffect } from 'react';

import 'react-dropdown/style.css';
import FilterSearch from '../components/FilterSearch';
import { metaCoinName, metaSubclass, metaCostumes, metaEyeColors, metaHairColors, metaSkinColors } from '../constants/MetadataStats';
import { metaPetName } from '../constants/MetadataStats';

import MeralsList from '../components/art/MeralsList';
import PetsList from '../components/art/PetsList';
import ArtDrop from '../components/art/ArtDrop';
import { useParams } from 'react-router';
import { ItemTypes } from '../components/art/utils/items';
import FilterStatus from '../components/FilterStatus';

import { useUserAccount } from '../hooks/useUser';
import { elementsToIds, subclassesToIds } from '../hooks/useNFTUtils';

const coinData = [];
for (let i = 0; i < metaCoinName.length; i++) {
	coinData.push({
		name: metaCoinName[i],
	});
}

const subclassData = [];
for (let i = 0; i < metaSubclass.length; i++) {
	subclassData.push({
		name: metaSubclass[i],
	});
}

const costumeData = [];
for (let i = 0; i < metaCostumes.length; i++) {
	costumeData.push({
		name: metaCostumes[i],
	});
}

const eyeColorData = [];
for (let i = 0; i < metaEyeColors.length; i++) {
	eyeColorData.push({
		name: metaEyeColors[i],
	});
}

const hairColorData = [];
for (let i = 0; i < metaHairColors.length; i++) {
	hairColorData.push({
		name: metaHairColors[i],
	});
}

const skinColorData = [];
for (let i = 0; i < metaSkinColors.length; i++) {
	skinColorData.push({
		name: metaSkinColors[i],
	});
}

const elementsData = [{ name: 'Void' }, { name: 'Earth' }, { name: 'Fire' }, { name: 'Water' }, { name: 'Wind' }];

const statusData = [{ name: 'Owned' }];

const petData = [];
for (let i = 0; i < metaPetName.length; i++) {
	petData.push({
		name: metaPetName[i],
	});
}

const ArtGame = () => {
	const { id } = useParams();
	const { address } = useUserAccount();

	const [droppedMerals, setDroppedMerals] = useState([]);
	const [droppedPets, setDroppedPets] = useState([]);

	const [statusFilterList, setStatusFilterList] = useState([]);
	const [coinFilterList, setCoinFilterList] = useState([]);
	const [elementFilterList, setElementFilterList] = useState([]);
	const [subclassFilterList, setSubclassFilterList] = useState([]);
	const [costumeFilterList, setCostumeFilterList] = useState([]);
	const [eyeFilterList, setEyeFilterList] = useState([]);
	const [hairFilterList, setHairFilterList] = useState([]);
	const [skinFilterList, setSkinFilterList] = useState([]);

	const [petNameFilterList, setPetNameFilterList] = useState([]);
	const [petShouldFilter, setPetShouldFilter] = useState(false);
	const [petFilters, setPetFilters] = useState({});

	const [shouldFilter, setShouldFilter] = useState(false);
	const [filters, setFilters] = useState({});
	const [filterTab, setFilterTab] = useState(0);

	const order = { orderBy: 'timestamp', orderDirection: 'asc' };

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		setShouldFilter(false);
		let _filters = {};
		if (coinFilterList.length > 0) {
			setShouldFilter(true);
			_filters.coin_in = coinFilterList;
		}
		if (elementFilterList.length > 0) {
			setShouldFilter(true);
			_filters.element_in = elementsToIds(elementFilterList);
		}
		if (statusFilterList.length > 0) {
			setShouldFilter(true);
			_filters.owner_in = address ? [address.toLowerCase()] : [''];
		}
		if (subclassFilterList.length > 0) {
			setShouldFilter(true);
			_filters.subclass_in = subclassesToIds(subclassFilterList);
		}
		if (costumeFilterList.length > 0) {
			setShouldFilter(true);
			_filters.costume_in = costumeFilterList;
		}
		if (eyeFilterList.length > 0) {
			setShouldFilter(true);
			_filters.eyes_in = eyeFilterList;
		}
		if (hairFilterList.length > 0) {
			setShouldFilter(true);
			_filters.hair_in = hairFilterList;
		}
		if (skinFilterList.length > 0) {
			setShouldFilter(true);
			_filters.skin_in = skinFilterList;
		}

		setFilters(_filters);
	}, [statusFilterList, coinFilterList, elementFilterList, subclassFilterList, costumeFilterList, eyeFilterList, hairFilterList, skinFilterList, address]);

	useEffect(() => {
		setPetShouldFilter(false);
		let _filters = {};
		if (petNameFilterList.length > 0) {
			setPetShouldFilter(true);
			_filters.name_in = petNameFilterList;
		}
		if (statusFilterList.length > 0) {
			setPetShouldFilter(true);
			_filters.owner_in = address ? [address.toLowerCase()] : [''];
		}

		setPetFilters(_filters);
	}, [statusFilterList, petNameFilterList, address]);

	const clearDrops = () => {
		setDroppedMerals([]);
		setDroppedPets([]);
	};

	const isDuplicate = (array, item) => {
		let isDup = false;
		if (array.length > 0) {
			array.forEach((element) => {
				if (element.id === item.id) {
					isDup = true;
				}
			});
		}
		return isDup;
	};

	const handleRemove = (type, id) => {
		if (type === ItemTypes.MERALS) {
			let _droppedMerals = droppedMerals.filter((element) => element.id !== id);
			setDroppedMerals(_droppedMerals);
		}

		if (type === ItemTypes.PETS) {
			let _droppedPets = droppedPets.filter((element) => element.id !== id);
			setDroppedPets(_droppedPets);
		}
	};

	const handleDrop = (item) => {
		if (item.type === ItemTypes.MERALS) {
			if (isDuplicate(droppedMerals, item)) {
				return;
			}

			setDroppedMerals((prev) => {
				return [...prev, { nft: item.nft, id: item.id }];
			});
		}

		if (item.type === ItemTypes.PETS) {
			if (isDuplicate(droppedPets, item)) {
				return;
			}

			setDroppedPets((prev) => {
				return [...prev, { nft: item.nft, id: item.id }];
			});
		}
	};

	return (
		<div>
			{/* MAIN */}
			<div className="">
				{/* SIDEBAR */}
				<aside style={{ minWidth: '212px', width: '212px', backgroundColor: 'hsl(212, 39%, 90%)' }} className="h-screen top-12 fixed border-r border-gray-400 overflow-y-auto">
					<div className="flex mb-8 mt-1">
						<div
							onClick={() => setFilterTab(0)}
							className={`py-1 px-4 m-4 mr-0 text-lg cursor-pointer bg-white shadow-md ${filterTab === 0 ? 'text-brandColor' : 'hover:text-yellow-500 hover:shadow-lg'}  `}
						>
							Merals
						</div>
						<div
							onClick={() => setFilterTab(1)}
							className={`py-1 px-4 m-4 mr-0 ml-2 text-lg cursor-pointer bg-white shadow-md ${filterTab === 1 ? 'text-brandColor' : 'hover:text-yellow-500 hover:shadow-lg'}  `}
						>
							Pets
						</div>
					</div>
					<div className="pl-4 mb-2 text-sm">FILTER</div>

					{filterTab === 0 && (
						<div>
							{statusData && <FilterStatus data={statusData} setFilterList={setStatusFilterList} filterList={statusFilterList} filterByText="Status" />}
							{coinData && <FilterSearch data={coinData} setFilterList={setCoinFilterList} keys={['name']} filterList={coinFilterList} filterByText="Coin" />}
							{elementsData && <FilterSearch data={elementsData} setFilterList={setElementFilterList} keys={['name']} filterList={elementFilterList} filterByText="Element" />}
							{subclassData && <FilterSearch data={subclassData} setFilterList={setSubclassFilterList} keys={['name']} filterList={subclassFilterList} filterByText="Subclass" />}
							{costumeData && <FilterSearch data={costumeData} setFilterList={setCostumeFilterList} keys={['name']} filterList={costumeFilterList} filterByText="Outfit" />}
							{eyeColorData && <FilterSearch data={eyeColorData} setFilterList={setEyeFilterList} keys={['name']} filterList={eyeFilterList} filterByText="Eye Color" />}
							{hairColorData && <FilterSearch data={hairColorData} setFilterList={setHairFilterList} keys={['name']} filterList={hairFilterList} filterByText="Hair Color" />}
							{skinColorData && <FilterSearch data={skinColorData} setFilterList={setSkinFilterList} keys={['name']} filterList={skinFilterList} filterByText="Skin Color" />}
						</div>
					)}
					{filterTab === 1 && (
						<div>
							{statusData && <FilterStatus data={statusData} setFilterList={setStatusFilterList} filterList={statusFilterList} filterByText="Status" />}
							{petData && <FilterSearch data={petData} setFilterList={setPetNameFilterList} keys={['name']} filterList={petNameFilterList} filterByText="Pet Type" />}
						</div>
					)}
				</aside>

				<div
					style={{ left: '212px', width: '212px', minWidth: '212px', maxWidth: '212px', backgroundColor: 'hsl(212, 39%, 94%)' }}
					className="h-screen top-12 fixed border-r border-gray-400 overflow-y-auto pb-20"
				>
					{filterTab === 0 && <MeralsList order={order} shouldFilter={shouldFilter} filters={filters} allDropped={droppedMerals} />}
					{filterTab === 1 && <PetsList order={order} shouldFilter={petShouldFilter} filters={petFilters} allDropped={droppedPets} />}
				</div>

				<ArtDrop tokenId={id} droppedMerals={droppedMerals} droppedPets={droppedPets} onDrop={(item) => handleDrop(item)} clearDrops={clearDrops} handleRemove={handleRemove} />
			</div>
		</div>
	);
};

export default ArtGame;
