import React, { useContext, useState } from 'react';
import { useQueryClient } from 'react-query';

import { useWeb3 } from '../hooks/useWeb3';

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
	const { provider } = useWeb3();
	const queryClient = useQueryClient();

	const [miningStatus, setMiningStatus] = useState(false);
	const [receipt, setReceipt] = useState({ status: -1 });

	const sendTx = async (hash, method, shouldInvalidate = false, keys = ['core'], sendMessage = false, msgCallback) => {
		setMiningStatus(true);
		provider.once(hash, (receipt) => {
			receiptTx(receipt, method);

			if (shouldInvalidate) {
				keys.forEach((key) => {
					setTimeout(() => queryClient.invalidateQueries(key), 10000);
				});
				setTimeout(() => queryClient.invalidateQueries('user_balance'), 1000);
			}

			if (sendMessage) {
				msgCallback();
			}

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
