import { useState, useEffect } from 'react';
import { useNFTUtils } from '../../../hooks/useNFTUtils';
import { useMeralImagePaths } from '../../../hooks/useMeralImagePaths';
import { useGQLQuery } from '../../../hooks/useGQLQuery';
import { Links } from '../../../constants/Links';
import { Addresses } from '../../../constants/contracts/Addresses';
import gql from 'graphql-tag';
import { useAddress } from '../../../context/Web3Context';

const GET_NFT = gql`
	query ($id: ID!) {
		ethemeral(id: $id) {
			id
			owner {
				id
			}
			bgId
		}
	}
`;

const MeralThumbnailOS = ({ id }) => {
	const { data, status, isLoading } = useGQLQuery(`nft_art_answer_meral_${id}`, GET_NFT, { id: id }, { refetchOnMount: false });
	const address = useAddress();

	const { meralImagePaths } = useMeralImagePaths(id);
	const { elements } = useNFTUtils();
	const [nft, setNFT] = useState(undefined);
	const [owned, setOwned] = useState(false);

	useEffect(() => {
		if (status === 'success' && data && data.ethemeral) {
			setNFT(data.ethemeral);
		}
	}, [status, data, nft]);

	useEffect(() => {
		if (nft && address) {
			if (nft.owner.id.toLowerCase() === address.toLowerCase()) {
				setOwned(true);
			}
		}
	}, [nft, address, owned]);

	if (!meralImagePaths || isLoading || !nft) {
		return <div style={{ minWidth: '64px', minHeight: '60px', width: '64px', height: '64px' }} className="relative"></div>;
	}

	const openSeaURL = `${Links.OPENSEAS}/${Addresses.Ethemerals}/${nft.id}`;

	return (
		<div
			style={{
				minWidth: '64px',
				minHeight: '60px',
				width: '64px',
				height: '60px',
				backgroundColor: elements[nft.bgId].color,
				borderWidth: '3px',
				borderColor: owned ? 'hsl(150, 100%, 40%)' : 'white',
			}}
			className="relative cursor-pointer shadow hover:opacity-80 hover:shadow-lg rounded-lg overflow-hidden"
		>
			<a href={openSeaURL} target="blank" rel="noreferrer">
				<img width="70" height="70" src={meralImagePaths.thumbnail} alt="" />
			</a>
			<span className="text-xs font-bold text-white z-10 bg-black bg-opacity-50 w-full absolute bottom-0 text-left">#{nft.id.padStart(4, '0')}</span>
		</div>
	);
};

export default MeralThumbnailOS;
