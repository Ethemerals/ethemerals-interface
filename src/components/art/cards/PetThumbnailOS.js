import { useState, useEffect } from 'react';
import { useGQLQueryL1 } from '../../../hooks/useGQLQuery';
import { Links } from '../../../constants/Links';
import { Addresses } from '../../../constants/contracts/Addresses';
import gql from 'graphql-tag';
import { useUser } from '../../../hooks/useUser';
import { getPetImages } from '../../../hooks/usePets';

const GET_PET = gql`
	query ($id: ID!) {
		pet(id: $id) {
			id
			tokenId
			baseId
			owner {
				id
			}
		}
	}
`;

const PetThumbnailOS = ({ id }) => {
	const { data, status, isLoading } = useGQLQueryL1(`nft_art_answer_pet_${id}`, GET_PET, { id: id }, { refetchOnMount: false });

	const { address } = useUser();

	const [nft, setNFT] = useState(undefined);
	const [owned, setOwned] = useState(false);

	useEffect(() => {
		if (status === 'success' && data && data.pet) {
			setNFT(data.pet);
		}
	}, [status, data, nft]);

	useEffect(() => {
		if (nft && address) {
			if (nft.owner.id.toLowerCase() === address.toLowerCase()) {
				setOwned(true);
			}
		}
	}, [nft, address, owned]);

	if (isLoading || !nft) {
		return <div style={{ minWidth: '64px', minHeight: '60px', width: '64px', height: '64px' }} className="relative"></div>;
	}

	const bgImg = getPetImages(nft.baseId).preview; // TODO PET
	const openSeaURL = `${Links.OPENSEAS}/${Addresses.Equipables}/${nft.tokenId}`;

	return (
		<div
			style={{ minWidth: '64px', minHeight: '60px', width: '64px', height: '64px', backgroundColor: 'hsl(186, 33%, 94%)', borderWidth: '3px', borderColor: owned ? 'hsl(150, 100%, 40%)' : 'white' }}
			className="relative cursor-pointer shadow hover:opacity-80 hover:shadow-lg rounded-lg overflow-hidden"
		>
			<a href={openSeaURL} target="blank" rel="noreferrer">
				<img width="70" height="70" src={bgImg} alt="" />
			</a>
			<span className="text-xs font-bold text-white z-10 bg-black bg-opacity-50 w-full absolute bottom-0 text-left">#{nft.id.toString().padStart(4, '0')}</span>
		</div>
	);
};

export default PetThumbnailOS;
