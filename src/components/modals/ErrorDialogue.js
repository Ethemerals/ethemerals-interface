const ErrorDialogue = ({ toggle, message }) => {
	return (
		<>
			<div className="w-full h-full flex justify-center fixed top-0 left-0">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 z-20 bg-opacity-40 bg-black"></div>
				<div className=" w-96 h-64 center border-gray-400 bg-opacity-100 rounded-2xl overflow-hidden z-30 tracking-wide shadow-xl bg-white">
					<div className="flex justify-end">
						<span onClick={toggle} className="cursor-pointer p-4 text-black hover:text-gray-500">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
								<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
							</svg>
						</span>
					</div>
					<div className="center w-max text-center">
						<div className="flex justify-center py-4">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="red">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<p className="py-1 text-red-700">{message}</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default ErrorDialogue;
