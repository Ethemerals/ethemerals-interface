import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './utils/items';

const ArtDrop = ({ tokenId, onDrop, allDropped, clearDrops }) => {
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
			console.log(allDropped);

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
		backgroundColor = 'pink';
	} else if (canDrop) {
		backgroundColor = 'gray';
	}

	return (
		<main style={{ left: '424px', width: 'calc(100% - 424px)', minWidth: '512px' }} className="mt-44 py-2 absolute">
			<div className="bg-gray-200 p-4 m-4">
				<h2>{tokenId}</h2>

				<button onClick={onCheckAnswer} className="bg-yellow-400 text-xl text-bold px-4 py-2 my-10 rounded-lg shadow-lg hover:bg-yellow-300 transition duration-300">
					Check Answer
				</button>
				<button onClick={clearDrops} className="bg-yellow-400 text-xl text-bold px-4 py-2 my-10 rounded-lg shadow-lg hover:bg-yellow-300 transition duration-300">
					Clear All
				</button>

				<div ref={drop} style={{ backgroundColor }} className="bg-gray-100 w-full h-56">
					drop zone
					<h2>Merals</h2>
					{allDropped[ItemTypes.MERALS].map((id) => (
						<div key={id}>
							<p>{id}</p>
						</div>
					))}
					<h2>Pets</h2>
					{allDropped[ItemTypes.PETS].map((id) => (
						<div key={id}>
							<p>{id}</p>
						</div>
					))}
				</div>
			</div>
		</main>
	);
};

export default ArtDrop;
