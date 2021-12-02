import { useState, useEffect } from 'react';
import Confetti from 'react-dom-confetti';

const config = {
	angle: '76',
	spread: 360,
	startVelocity: 40,
	elementCount: '151',
	dragFriction: '0.09',
	duration: '9500',
	stagger: '2',
	width: '10px',
	height: '10px',
	perspective: '750px',
	colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
};

const WinningModal = ({ toggle }) => {
	const [show, setShow] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShow(true);
		}, 500);
		return () => clearTimeout(timer);
	}, []);

	return (
		<>
			<div className="w-full h-full flex justify-center fixed top-0 left-0 text-black z-50">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 bg-opacity-40 bg-black"></div>
				<div className=" w-11/12 max-w-420 h-96 center border-gray-400 bg-opacity-100 rounded-2xl tracking-wide shadow-xl bg-white">
					<div className="flex justify-end">
						<span onClick={toggle} className="cursor-pointer p-4 text-black hover:text-gray-500">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
								<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
							</svg>
						</span>
					</div>
					<div className="center w-max text-center">
						<div className="py-2">
							<p className="text-4xl pb-4">Congratulations!</p>
							<p className="px-2">We will be giving out the rewards shortly</p>
							<p className="px-2 text-gray-600">(when gas is cheap!)</p>
							<p className="px-2 pt-8">Thank you for playing.</p>
						</div>
						<Confetti active={show} config={config} />
					</div>
				</div>
			</div>
		</>
	);
};

export default WinningModal;
