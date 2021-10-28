import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import Images from '../constants/Images';
import { useMeralColor, useMutateMeralColor, refreshMetadata } from '../hooks/useColorTraits';

import useUserAccount from '../hooks/useUserAccount';

const ColorChoice = ({ account, isOwned, colorNames, selectedColor, index, allowedColors, setSelected }) => {
	const handleClick = () => {
		if (allowedColors[index]) {
			setSelected(index);
		}
	};
	return (
		<div
			onClick={handleClick}
			className={`flex items-center rounded-lg cursor-default ${account && isOwned && allowedColors[index] ? 'cursor-pointer hover:text-blue-600 transition duration-200' : 'text-gray-400'}`}
		>
			<div className="w-8 h-8 mr-1 relative">{selectedColor === index && <img className="center" width="26px" height="26px" alt="icon main" src={Images.iconSelected} />}</div>
			<p>{colorNames[index]}</p>
		</div>
	);
};

const NFTChooseColorScheme = ({ nft, setColor }) => {
	const { account } = useUserAccount();
	const queryClient = useQueryClient();

	const { meralColor } = useMeralColor(nft.id);
	const { mutateMeralColor } = useMutateMeralColor();
	const [colorNames, setColorNames] = useState(['OG Color', 'Color 2', 'Color 3', 'Color 4']);
	const [currentColor, setCurrentColor] = useState(0);
	const [selectedColor, setSelectedColor] = useState(0);
	const [saving, setSaving] = useState(false);
	const [allowedColors, setAllowedColors] = useState([true, false, false, false]);

	const [isOwned, setIsOwned] = useState(false);

	useEffect(() => {
		let owned = false;
		if (account && account.ethemerals.length > 0) {
			account.ethemerals.forEach((userNft) => {
				if (userNft.id === nft.id) {
					owned = true;
				}
			});
		}
		setIsOwned(owned);
	}, [account, nft]);

	useEffect(() => {
		setColor(selectedColor);
	}, [selectedColor, setColor]);

	useEffect(() => {
		if (meralColor) {
			setCurrentColor(meralColor.current);
			setColorNames([meralColor.colors[0].name, meralColor.colors[1].name, meralColor.colors[2].name, meralColor.colors[3].name]);
			setAllowedColors([meralColor.colors[0].unlocked, meralColor.colors[1].unlocked, meralColor.colors[2].unlocked, meralColor.colors[3].unlocked]);
			setSelectedColor(meralColor.current);
		}
	}, [meralColor]);

	const handleSave = async () => {
		if (account && isOwned && selectedColor !== currentColor) {
			setSaving(true);
			try {
				await mutateMeralColor.mutateAsync({ address: account.id, selected: selectedColor, tokenId: nft.id });
				setTimeout(() => queryClient.invalidateQueries(`${nft.id}_colors`), 3000);
				setTimeout(() => refreshMetadata(nft.id), 1000);
				setTimeout(() => setSaving(false), 3000);
			} catch (error) {
				console.log(error);
			}
		}
	};

	if (!nft) {
		return null;
	}

	return (
		<div className="grid grid-cols-2 gap-2 px-2 text-sm text-black">
			<ColorChoice account={account} isOwned={isOwned} colorNames={colorNames} selectedColor={selectedColor} index={0} allowedColors={allowedColors} setSelected={setSelectedColor} />
			<ColorChoice account={account} isOwned={isOwned} colorNames={colorNames} selectedColor={selectedColor} index={2} allowedColors={allowedColors} setSelected={setSelectedColor} />
			<ColorChoice account={account} isOwned={isOwned} colorNames={colorNames} selectedColor={selectedColor} index={1} allowedColors={allowedColors} setSelected={setSelectedColor} />
			<ColorChoice account={account} isOwned={isOwned} colorNames={colorNames} selectedColor={selectedColor} index={3} allowedColors={allowedColors} setSelected={setSelectedColor} />

			{account && isOwned && (
				<div
					onClick={handleSave}
					className={`flex items-center rounded-lg ${currentColor !== selectedColor ? 'bg-customBlue-pale cursor-pointer hover:bg-blue-400 transition duration-200' : 'text-gray-400'} `}
				>
					<div className="w-8 h-8 mr-1 relative"></div>
					<p>{saving ? 'Saving...' : 'Save Choice'}</p>
				</div>
			)}
		</div>
	);
};

export default NFTChooseColorScheme;
