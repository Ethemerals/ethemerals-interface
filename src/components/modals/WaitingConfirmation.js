const SpinnerSVG = () => (
	<svg className=" animate-spin-slow text-brandColor-dark" width="100" height="100" viewBox="0 0 304 304" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g opacity="1">
			<path
				d="M152 304C68.0527 304 0 235.947 0 152C0 68.0527 68.0527 0 152 0L152 10.6431C73.9306 10.6431 10.6429 73.9308 10.6429 152C10.6429 230.069 73.9306 293.357 152 293.357C230.069 293.357 293.357 230.069 293.357 152L304 152C304 235.947 235.947 304 152 304Z"
				fill="currentColor"
			/>
		</g>
	</svg>
);

const WaitingConfirmation = ({ toggle, message }) => {
	return (
		<>
			<div className="w-full h-full flex justify-center fixed top-0 left-0">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 z-20 bg-opacity-50 bg-black"></div>
				<div className=" w-11/12 max-w-420 h-96 center border-gray-400 bg-opacity-100 rounded-2xl overflow-hidden z-30 tracking-wide shadow-xl bg-gray-900">
					<div className="flex justify-end">
						<span onClick={toggle} className="cursor-pointer p-4 text-gray-300 hover:text-gray-100">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
								<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
							</svg>
						</span>
					</div>
					<div className="center w-max text-center">
						<div className="flex justify-center py-14">
							<SpinnerSVG />
						</div>
						<div className="py-2">
							<p className="text-2xl">Waiting for Confirmation</p>
							<p className="py-1">{message && message}</p>
							<p className="text-sm text-gray-500">Confirm this transaction in your wallet</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default WaitingConfirmation;
