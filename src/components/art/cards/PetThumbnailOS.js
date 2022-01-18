import { useState, useEffect } from 'react';
import { useNFTUtils } from '../../../hooks/useNFTUtils';
import { Links } from '../../../constants/Links';
import { Addresses } from '../../../constants/contracts/Addresses';
import { useUser } from '../../../hooks/useUser';
import { usePetDataById } from '../../../hooks/usePetData';

const PetThumbnailOS = ({ id }) => {
	const { petData, isLoading } = usePetDataById(id);

	const { getEquipmentImages } = useNFTUtils();

	const { address } = useUser();

	const [nft, setNFT] = useState(undefined);
	const [owned, setOwned] = useState(false);

	useEffect(() => {
		if (petData) {
			setNFT(nft);
		}
	}, [petData, nft]);

	useEffect(() => {
		if (nft && address) {
			if (nft.owner.toLowerCase() === address.toLowerCase()) {
				setOwned(true);
			}
		}
	}, [nft, address]);

	if (isLoading || !nft) {
		return <div style={{ minWidth: '64px', minHeight: '60px', width: '64px', height: '64px' }} className="relative"></div>;
	}

	const bgImg = getEquipmentImages(nft.baseId).thumbnail;
	const openSeaURL = `${Links.OPENSEAS}/${Addresses.Equipables}/${nft.tokenId}`;

	return (
		<div
			style={{ minWidth: '64px', minHeight: '60px', width: '64px', height: '64px', backgroundColor: 'hsl(186, 33%, 94%)', borderWidth: '3px', borderColor: owned ? 'hsl(150, 100%, 40%)' : 'white' }}
			className="relative cursor-pointer shadow hover:opacity-80 hover:shadow-lg rounded-lg overflow-hidden"
		>
			<a href={openSeaURL} target="blank" rel="noreferrer">
				<img width="70" height="70" src={bgImg} alt="" />
			</a>
			<span className="text-xs font-bold text-white z-10 bg-black bg-opacity-50 w-full absolute bottom-0 text-left">#{nft.tokenId.toString().padStart(4, '0')}</span>
		</div>
	);
};

export default PetThumbnailOS;
