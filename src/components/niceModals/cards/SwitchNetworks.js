import NetworksButton from '../../navigation/NetworksButton';

const SwitchNetworks = ({ message }) => {
	return (
		<>
			<div className="bg-blue-100">
				{message}
				<NetworksButton />
			</div>
		</>
	);
};

export default SwitchNetworks;
