import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './utils/items';
import MeralThumbnail from './cards/MeralThumbnail';
import PetThumbnail from './cards/PetThumbnail';

const ArtDrop = ({ onDrop, droppedMerals, droppedPets, clearDrops, handleRemove }) => {
	const [{ canDrop, isOver }, drop] = useDrop({
		accept: ItemTypes.CARD,
		drop: onDrop,
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	});

	const { register, handleSubmit } = useForm();
	const [submitting, setSubmitting] = useState(false);

	const onCheckAnswer = async () => {
		try {
			setSubmitting(true);
			console.log('merals', droppedMerals);
			console.log('pets', droppedPets);

			// await mutateArtHuntAnswer.mutateAsync({ address: address ? address : null, tokenId: id, answer: data });
			// setTimeout(() => queryClient.invalidateQueries(`${nft.id}_colors`), 3000);
			setSubmitting(false);
		} catch (error) {
			console.log(error);
		}
	};

	const isActive = canDrop && isOver;
	let backgroundColor = 'white';
	if (isActive) {
		backgroundColor = 'hsl(160, 60%, 95%)';
	} else if (canDrop) {
		backgroundColor = 'hsl(160, 20%, 95%)';
	}

	return (
		<main style={{ left: '424px', width: 'calc(100% - 424px)', minWidth: '512px' }} className="mt-12 absolute">
			<div>
				<div>
					<div className="w-11/12 h-96 bg-red-100 mx-auto my-11">ARTWORK</div>
				</div>

				<div style={{ backgroundColor }} className="w-full relative">
					{droppedPets.length === 0 && droppedMerals.length === 0 && !isOver && !canDrop && (
						<p className="absolute text-center text-5xl mx-auto w-full mt-7 font-light text-gray-200">DRAG CARDS HERE</p>
					)}
					<div ref={drop} style={{ height: '164px' }} className="flex space-x-2 justify-center pt-7 overflow-hidden">
						{droppedMerals.map((item) => (
							<div key={item.id}>
								<MeralThumbnail nft={item.nft} handleRemove={() => handleRemove(ItemTypes.MERALS, item.id)} />
							</div>
						))}
						{droppedPets.map((item) => (
							<div key={item.id}>
								<PetThumbnail nft={item.nft} handleRemove={() => handleRemove(ItemTypes.PETS, item.id)} />
							</div>
						))}
					</div>

					<div className="flex justify-center space-x-4 mx-auto pb-6">
						<button onClick={onCheckAnswer} className="bg-blue-100 text-xl text-bold px-4 py-2 rounded-lg shadow-lg hover:bg-blue-200 transition duration-300">
							Check Answer
						</button>
						<button onClick={clearDrops} className="bg-blue-100 text-xl text-bold px-4 py-2 rounded-lg shadow-lg hover:bg-blue-200 transition duration-300">
							Clear All
						</button>
					</div>
				</div>
			</div>
		</main>
	);
};

export default ArtDrop;
