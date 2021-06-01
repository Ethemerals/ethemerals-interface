const ConnectButton = ({ login }) => {
	return (
		<button className="py-2 px-2 bg-pink-600 hover:bg-yellow-300 text-white hover:text-yellow-800 rounded-xl transition duration-300" onClick={login}>
			Connect Wallet
		</button>
	);
};

export default ConnectButton;
