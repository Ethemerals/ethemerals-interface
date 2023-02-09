import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useMoralisCloudFunction } from 'react-moralis';

import Images from '../../../constants/Images';
import { useUserAccount } from '../../../hooks/useUser';
import { getGenByTokenId } from '../../../hooks/useMeralsUtils';
import { refreshMetadata } from '../../../hooks/useOpensea';

const ColorChoice = ({ isOwned, colorNames, selectedColor, index, allowedColors, setSelected }) => {
	const handleClick = () => {
		if (allowedColors[index]) {
			setSelected(index);
		}
	};

	return (
		<div
			onClick={handleClick}
			className={`flex items-center rounded-lg cursor-default ${isOwned && allowedColors[index] ? 'cursor-pointer hover:text-blue-600 transition duration-200' : 'text-gray-400'}`}
		>
			<div className="w-8 h-8 mr-1 relative">{selectedColor === index && <img className="center" width="26px" height="26px" alt="icon main" src={Images.iconSelected} />}</div>
			{colorNames ? <p>{colorNames[index]}</p> : <p>Loading...</p>}
		</div>
	);
};

const NFTChooseColorScheme = ({ nft, color, setColor, currentColor, meralData }) => {
	const { address, userMerals } = useUserAccount();

	const queryClient = useQueryClient();
	const [buttonMsg, setButtonMsg] = useState('Save Choice');

	const [colorNames, setColorNames] = useState(undefined);
	const [selectedColor, setSelectedColor] = useState(undefined);
	const [saving, setSaving] = useState(false);
	const [allowedColors, setAllowedColors] = useState([true, false, false, false]);
	const [isOwned, setIsOwned] = useState(false);

	const { fetch } = useMoralisCloudFunction('setColor', { selectedColor, tokenId: nft.tokenId }, { autoFetch: false });

	useEffect(() => {
		let owned = false;
		if (nft && userMerals && userMerals.length > 0) {
			userMerals.forEach((userMeral) => {
				if (userMeral.meralId === nft.meralId) {
					owned = true;
				}
			});
		}
		setIsOwned(owned);
	}, [userMerals, nft]);

	useEffect(() => {
		if (saving) {
			setButtonMsg('Saving costume change ...');
		} else {
			setButtonMsg('Save Choice');
		}

		return () => {
			setButtonMsg('Save Choice');
		};
	}, [saving]);

	useEffect(() => {
		if (meralData) {
			let colorNames = [meralData.get('colorName0'), meralData.get('colorName1'), meralData.get('colorName2'), meralData.get('colorName3')];
			let colorUnlocked = [meralData.get('colorUnlocked0'), meralData.get('colorUnlocked1'), meralData.get('colorUnlocked2'), meralData.get('colorUnlocked3')];

			setColorNames(colorNames);
			setAllowedColors(colorUnlocked);
			setSelectedColor(color);
		}
	}, [meralData, color]);

	const handleSave = async () => {
		if (address && isOwned) {
			setSaving(true);
			try {
				await fetch();
				setButtonMsg('Updating Opensea ...');
				await refreshMetadata(nft.tokenId);
				setButtonMsg('Done!');
				setTimeout(() => {
					setButtonMsg('Save Choice');
					queryClient.invalidateQueries(`meralData_${nft.meralId}`, `meralGlobal_${getGenByTokenId(nft.tokenId)}`);
				}, 3000);
				setTimeout(() => setSaving(false), 3000);
			} catch (error) {
				console.log(error);
			}
		}
	};

	if (!meralData) {
		return null;
	}

	return (
		<div className="grid grid-cols-2 gap-2 px-2 text-sm text-black">
			<ColorChoice isOwned={isOwned} colorNames={colorNames} selectedColor={selectedColor} index={0} allowedColors={allowedColors} setSelected={setColor} />
			<ColorChoice isOwned={isOwned} colorNames={colorNames} selectedColor={selectedColor} index={2} allowedColors={allowedColors} setSelected={setColor} />
			<ColorChoice isOwned={isOwned} colorNames={colorNames} selectedColor={selectedColor} index={1} allowedColors={allowedColors} setSelected={setColor} />
			<ColorChoice isOwned={isOwned} colorNames={colorNames} selectedColor={selectedColor} index={3} allowedColors={allowedColors} setSelected={setColor} />

			{address && isOwned && (
				<div onClick={handleSave} className={`col-span-2 flex items-center rounded-lg ${currentColor !== color ? 'bg-customBlue-pale cursor-pointer hover:bg-blue-400 transition duration-200' : ''}`}>
					<div className="w-8 h-8 mr-1 relative"></div>
					<p>{buttonMsg}</p>
				</div>
			)}
		</div>
	);
};

export default NFTChooseColorScheme;
