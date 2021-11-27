import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useArtHunt, useMutateArtHuntAnswer } from '../hooks/useArtHunt';

import useUserAccount from '../hooks/useUserAccount';

const SpinnerSVG = () => (
	<svg className=" animate-spin-slow text-brandColor" width="50" height="50" viewBox="0 0 304 304" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g opacity="1">
			<path
				d="M152 304C68.0527 304 0 235.947 0 152C0 68.0527 68.0527 0 152 0L152 10.6431C73.9306 10.6431 10.6429 73.9308 10.6429 152C10.6429 230.069 73.9306 293.357 152 293.357C230.069 293.357 293.357 230.069 293.357 152L304 152C304 235.947 235.947 304 152 304Z"
				fill="currentColor"
			/>
		</g>
	</svg>
);

const Art = () => {
	const { address } = useUserAccount();

	let id = 1;

	const { mutateArtHuntAnswer } = useMutateArtHuntAnswer();

	const { register, handleSubmit } = useForm();

	const [submitting, setSubmitting] = useState(false);

	const onSubmitAnswer = async (data) => {
		console.log(data);

		try {
			setSubmitting(true);

			await mutateArtHuntAnswer.mutateAsync({ address: address ? address : null, tokenId: id, answer: data });
			// setTimeout(() => queryClient.invalidateQueries(`${nft.id}_colors`), 3000);
			setSubmitting(false);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<div style={{ maxWidth: '864px' }} className="bg-white bg-opacity-40 text-black text-left mx-auto mt-20 p-6">
				<h1 className=" text-brandColor-purple text-3xl">The Great Art Hunt</h1>
				<p>
					Coming soon... Meanwhile checkout the{' '}
					<a href="https://medium.com/@ethemerals/ethemerals-the-great-art-hunt-5f44a3579325" className="text-blue-600" target="blank" rel="noreferrer">
						medium post
					</a>
				</p>
			</div>

			{/* <form className="p-4">
				<input className="w-10 h-8 p-2 bg-green-100 shadow-inner border border-gray-300 text-black" {...register('answer1')} />
				<input className="w-10 h-8 p-2 bg-green-100 shadow-inner border border-gray-300 text-black" {...register('answer2')} />
				<input className="w-10 h-8 p-2 bg-green-100 shadow-inner border border-gray-300 text-black" {...register('answer3')} />

				<button onClick={handleSubmit(onSubmitAnswer)} className="bg-yellow-400 text-xl text-bold px-4 py-2 my-10 rounded-lg shadow-lg hover:bg-yellow-300 transition duration-300">
					Submit
				</button>
				<p>{submitting ? 'submitting...' : 'try answer'}</p>
			</form> */}

			<div className="h-40"></div>
		</div>
	);
};

export default Art;
