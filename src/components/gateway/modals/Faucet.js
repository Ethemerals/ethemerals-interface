import NiceModal, { useModal } from '@ebay/nice-modal-react';
import CloseButton from './CloseButton';
import { useState } from 'react';
import { useMoralisCloudFunction } from 'react-moralis';
import { useGetFaucet } from '../../../hooks/useGetFaucet';

import { useUser, useUserAccount } from '../../../hooks/useUser';
import { shortenAddress } from '../../../utils';
import { useQueryClient } from 'react-query';
import { useWeb3 } from '../../../hooks/useWeb3';

export default NiceModal.create(() => {
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const { userFaucet } = useGetFaucet();
	const queryClient = useQueryClient();
	const modal = useModal();

	const { fetch } = useMoralisCloudFunction('setFaucet', {}, { autoFetch: false });

	const { address } = useUserAccount();
	const { login, isUnauthenticated } = useUser();
	const { provider } = useWeb3();

	const handleRequestMatic = async () => {
		if (address) {
			setSaving(true);
			try {
				await fetch();
				setTimeout(() => {
					queryClient.invalidateQueries(`faucet_${address}`);
				}, 1000);
			} catch (error) {
				console.log(error);
			}
			setSaving(false);
			setSaved(true);
		}
	};

	const toggle = () => {
		modal.remove();
	};

	return (
		<>
			<div onClick={toggle} className="fixed left-0 top-0 w-screen h-screen bg-black bg-opacity-30 z-30"></div>
			<div style={{ height: '666px' }} className="w-512 fixed center rounded-xl shadow-xl bg-white z-50 overflow-hidden">
				<div className="flex justify-end">
					<CloseButton toggle={toggle} />
				</div>

				{/* HEADER */}
				<div className="px-4">
					<p className="text-4xl font-light">Request Matic</p>
					<p className="py-2 text-sm text-gray-700">
						Need a little Matic to get you started? Request free Matic! Matic is needed to pay for gas fees on the Polygon Network. Each transaction is estimated to cost less then a cent
					</p>
				</div>

				{/* CONTENT */}
				<div style={{ bottom: '10px', height: '466px' }} className=" w-full absolute">
					<h2 className="text-sm text-gray-800 px-4">REQUEST 1 MATIC FOR {address && shortenAddress(address)}</h2>
					<div style={{ borderTop: '1px solid skyblue' }} className="h-full overflow-auto bg-blue-50 pt-2 px-4">
						<div className="text-center mt-10">
							{!userFaucet && address && (
								<button
									onClick={handleRequestMatic}
									className={`px-4 py-2 w-96 text-sm shadow-md font-bold relative rounded-md border text-white bg-blue-400 ${
										!saved || (!saving && 'hover:bg-blue-300 hover:text-blue-40 transition 300 cursor-pointer')
									}`}
								>
									{!saved && <span>{!saving ? `SUBMIT REQUEST` : 'SUBMITTING'}</span>}
									{saved && <span>REQUEST HAS BEEN SUBMITTED</span>}
								</button>
							)}
							{address && userFaucet && (
								<button className="px-4 py-2 w-96 text-sm shadow-md font-bold relative rounded-md border text-white bg-blue-400">
									<span>REQUEST HAS BEEN SUBMITTED</span>
								</button>
							)}
							{!address && (
								<button onClick={login} className="px-4 py-2 w-96 text-sm shadow-md font-bold relative rounded-md border text-white bg-blue-400">
									<span>SIGN IN FIRST</span>
								</button>
							)}
						</div>
						<div className="mt-10 text-xs text-gray-600 text-center">
							<p className="font-bold">STATUS</p>
							{userFaucet && userFaucet.requested && !userFaucet.denied && <p>Request is pending, please wait up to 5 minutes</p>}
							{userFaucet && userFaucet.denied && <p>Request is denied, please reach out in discord</p>}
							{userFaucet && userFaucet.sent && <p>Matic has already been sent to this address</p>}
						</div>

						<div className="mt-10 text-xs text-gray-600 text-center">
							<p className="font-bold">REQUIREMENTS</p>
							<p>Only one request per account</p>
							<p>Account needs to hold at least one Ethemeral</p>
							<p>Account needs to own zero Matic on Polygon</p>
						</div>
					</div>
				</div>
				<div style={{ bottom: '0px', backgroundColor: 'skyblue', height: '8px' }} className="absolute w-full"></div>
			</div>
		</>
	);
});
