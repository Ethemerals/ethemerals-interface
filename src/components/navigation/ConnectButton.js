import { useUser } from '../../hooks/useUser';
import { useWeb3 } from '../../hooks/useWeb3';

const ConnectButton = () => {
	const { login, isUnauthenticated } = useUser();
	const { provider } = useWeb3();

	if (!provider) {
		return (
			<button className="h-10 w-48 px-6 text-lg bg-brandColor hover:bg-brandColor-pale text-white rounded-lg transition duration-300 flex items-center justify-center" onClick={login}>
				<a href="https://metamask.io/" target="blank" rel="noreferrer">
					Get Metamask
				</a>
			</button>
		);
	}

	return (
		<button className="h-10 w-48 px-6 text-lg bg-brandColor hover:bg-brandColor-pale text-white rounded-lg transition duration-300 flex items-center justify-center" onClick={login}>
			{isUnauthenticated ? (
				<span>Connect Wallet</span>
			) : (
				<>
					<span className="mr-2">Sign Message</span>
					<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
				</>
			)}
		</button>
	);
};

export default ConnectButton;
