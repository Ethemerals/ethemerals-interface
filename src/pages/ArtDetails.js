import { useParams } from 'react-router-dom';

const ArtDetails = () => {
	const { id } = useParams();

	return (
		<div>
			{/* <ArtGame tokenId={id} /> */}

			<div className="h-40">art {id}</div>
		</div>
	);
};

export default ArtDetails;
