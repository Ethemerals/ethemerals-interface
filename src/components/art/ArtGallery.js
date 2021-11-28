import ArtCard from './cards/ArtCard';

const ArtGallery = () => {
	const arts = [{ id: 1 }, { id: 2 }, { id: 3 }];
	return (
		<div className="w-full h-420 bg-gray-50 m-4">
			art gallery
			<div className="flex flex-wrap mx-auto justify-center">
				{arts.map((art) => {
					console.log(art.id);
					return <ArtCard key={art.id} tokenId={art.id} />;
				})}
			</div>
		</div>
	);
};

export default ArtGallery;
