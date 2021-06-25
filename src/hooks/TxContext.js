import React, { useContext, useState } from 'react';

import { useWeb3, useRehydrate } from './Web3Context';

const MiningStatusContext = React.createContext();
const SendTxContext = React.createContext();
const ReceiptContext = React.createContext();

export function useMiningStatus() {
	return useContext(MiningStatusContext);
}
export function useSendTx() {
	return useContext(SendTxContext);
}
export function useReceipt() {
	return useContext(ReceiptContext);
}

export default function TxContextProvider({ children }) {
	const provider = useWeb3();
	const rehydrate = useRehydrate();

	// const updateUserData = useUpdateUserData();

	const [miningStatus, setMiningStatus] = useState(false);
	const [receipt, setReceipt] = useState({ status: -1 });

	const sendTx = async (hash, method) => {
		setMiningStatus(true);
		provider.once(hash, (receipt) => {
			receiptTx(receipt, method);
			// setTimeout(() => rehydrate('account'), 5000);
			// setTimeout(() => rehydrate('account_actions'), 6000);
			// setTimeout(() => rehydrate('core'), 7000);
			setTimeout(() => rehydrate('user'), 1000);
			setMiningStatus(false);
		});
	};

	const receiptTx = async (receipt, method) => {
		const _receipt = {
			status: receipt.status,
			method,
			txHash: receipt.transactionHash,
		};
		setReceipt(_receipt);
	};

	return (
		// CLIENT

		<MiningStatusContext.Provider value={miningStatus}>
			<SendTxContext.Provider value={sendTx}>
				<ReceiptContext.Provider value={receipt}>{children}</ReceiptContext.Provider>
			</SendTxContext.Provider>
		</MiningStatusContext.Provider>
	);
}
