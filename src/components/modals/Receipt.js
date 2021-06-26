import { useEffect, useState } from 'react';
import { useTransition, animated } from '@react-spring/web';
import { useReceipt } from '../../hooks/TxContext';

import Links from '../../constants/Links';

const etherscanURL = Links.ETHERSCAN_URL;

const ExternalLinkSVG = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
		<polyline points="15 3 21 3 21 9"></polyline>
		<line x1="10" y1="14" x2="21" y2="3"></line>
	</svg>
);

const Receipt = () => {
	const receipt = useReceipt();

	const [show, set] = useState(false);

	useEffect(() => {
		if (receipt.status !== -1) {
			set(true);
		}
	}, [receipt]);

	const clickedClose = () => {
		set(false);
	};

	const fadeOff = () => {
		setTimeout(() => set(false), 3000);
	};

	// SPRING
	const transitions = useTransition(show, {
		from: { opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		reverse: show,
		onRest: fadeOff,
	});

	return transitions(
		(styles, item) =>
			item && (
				<animated.div style={styles}>
					<div className="text-white text-xs sm:text-sm rounded-lg top-16 right-4 w-64 sm:w-72 h-20 bg-gray-800 absolute shadow-lg overflow-hidden z-50">
						<div className="flex items-center h-full">
							{receipt.status === 1 && (
								<div className="pl-2 text-green-600">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
							)}
							{receipt.status === 0 && (
								<div className="pl-2 text-red-600">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
							)}
							<div className="px-2">
								<p className="text-sm sm:text-base">
									{receipt.status === 1 ? 'Transaction success' : 'Transaction failed'}
									<br></br>
									{receipt.method}
								</p>
								<a href={`${etherscanURL}tx/${receipt.txHash}`} target="_blank" rel="noreferrer" className="flex items-center gap-x-2 text-blue-600 hover:text-blue-400 text-xs">
									View on Etherscan
									<ExternalLinkSVG />
								</a>
							</div>
							<div onClick={clickedClose} className="cursor-pointer p-2 mr-0 ml-auto flex justify-end w-min text-gray-300 hover:text-gray-100 mb-auto">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path
										fillRule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						</div>
					</div>
				</animated.div>
			)
	);
};

export default Receipt;
