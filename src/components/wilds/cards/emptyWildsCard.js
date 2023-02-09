const EmptyWildsCard = ({ stakeType }) => {
	return (
		<>
			<div style={{ width: '280px' }} className="flex h-74 mb-1 mx-1 cursor-pointer hover:shadow-xl bg-white opacity-50 hover:opacity-100 transition duration-300 relative">
				<div className="center text-xs text-gray-500">empty</div>
			</div>
		</>
	);
};

export default EmptyWildsCard;
