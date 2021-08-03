const ConnectButton = ({ login }) => {
	return (
		<button className="h-10 px-6 mx-2 text-lg bg-brandColor hover:bg-yellow-400 text-white rounded-lg transition duration-300 " onClick={login}>
			Connect Wallet
		</button>
	);
};

export default ConnectButton;

// bg-brandColor shadow-lg bg-opacity-100 hover:bg-yellow-400 py-2 px-4 rounded-lg text-lg font-bold uppercase mt-6 sm:mt-16 transition duration-300
