import { useState, useEffect } from 'react';
import { useMeralsUtils } from '../../../hooks/useMeralsUtils';
import { getMeralImages } from '../../../hooks/useMerals';
import { useGQLQueryL1 } from '../../../hooks/useGQLQuery';
import { Links } from '../../../constants/Links';
import { Addresses } from '../../../constants/contracts/Addresses';
import gql from 'graphql-tag';

import { useUser } from '../../../hooks/useUser';

const GET_NFT = gql`
	query ($id: ID!) {
		meral(id: $id) {
			id
			cmId
			tokenId
			owner {
				id
			}
			element
		}
	}
`;

const MeralThumbnailOS = ({ id }) => {
	const { data, status, isLoading } = useGQLQueryL1(`nft_art_answer_meral_${id}`, GET_NFT, { id: id }, { refetchOnMount: false });
	const { address } = useUser();

	const { elements } = useMeralsUtils();
	const [nft, setNFT] = useState(undefined);
	const [owned, setOwned] = useState(false);

	useEffect(() => {
		if (status === 'success' && data && data.meral) {
			setNFT(data.meral);
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

	const openSeaURL = `${Links.OPENSEAS}/${Addresses.Ethemerals}/${nft.tokenId}`;

	return (
		<div
			style={{
				minWidth: '64px',
				minHeight: '60px',
				width: '64px',
				height: '60px',
				backgroundColor: elements[nft.element].color,
				borderWidth: '3px',
				borderColor: owned ? 'hsl(150, 100%, 40%)' : 'white',
			}}
			className="relative cursor-pointer shadow hover:opacity-80 hover:shadow-lg rounded-lg overflow-hidden"
		>
			<a href={openSeaURL} target="blank" rel="noreferrer">
				<img width="70" height="70" src={getMeralImages(nft.cmId).preview} alt="" />
			</a>
			<span className="text-xs font-bold text-white z-10 bg-black bg-opacity-50 w-full absolute bottom-0 text-left">#{nft.tokenId.padStart(4, '0')}</span>
		</div>
	);
};

export default MeralThumbnailOS;
