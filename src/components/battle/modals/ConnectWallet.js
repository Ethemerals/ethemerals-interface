import { useLogin } from '../../../context/Web3Context';

const ConnectWallet = ({ toggle }) => {
	const login = useLogin();

	const handleLogin = () => {
		login();
		toggle();
	};

	return (
		<>
			<div className="w-full h-full fixed flex justify-center z-30 top-0 left-0">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 bg-opacity-50 bg-black"></div>
				<div className=" w-11/12 max-w-420 h-420 center border-gray-400 rounded tracking-wide shadow-xl bg-gray-50 text-black">
					<div className="flex items-center justify-end">
						<span onClick={toggle} className="cursor-pointer px-4 py-2 text-gray-900 hover:text-gray-600">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
								<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
							</svg>
						</span>
					</div>

					<div className="text-center">
						<>
							<p className="px-10 mt-10 mb-4">Login to your account!</p>

							<button onClick={handleLogin} className="bg-brandColor text-white text-lg text-bold px-4 py-1 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
								Connect Wallet
							</button>
						</>
					</div>
				</div>
			</div>
		</>
	);
};

export default ConnectWallet;
