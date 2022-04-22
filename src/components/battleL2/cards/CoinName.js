const CoinName = ({ logo, coinname }) => {
	return (
		<div className=" bg-white mt-2 rounded">
			<div className="flex items-center space-x-2 relative p-4">
				<img style={{ width: '18px', height: '18px', marginRight: '8px' }} src={logo} alt={``} />
				<div className="text-sm text-gray-600">
					<p>{coinname}</p>
				</div>
			</div>
		</div>
	);
};

export default CoinName;
