import ArtCard from './cards/ArtCard';

const ArrivingSoon = () => {
	const arts = [{ id: 1 }, { id: 2 }, { id: 3 }];
	return (
		<div className="w-full h-420 m-4">
			<h1 className="text-2xl border-gray-100 border-b-2 pb-4">Releasing soon...</h1>
			<div className="flex flex-wrap mx-auto justify-center">
				{/* {arts.map((art) => {
					return <ArtCard key={art.id} tokenId={art.id} />;
				})} */}
			</div>
		</div>
	);
};

export default ArrivingSoon;
