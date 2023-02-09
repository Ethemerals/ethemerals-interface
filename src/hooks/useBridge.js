import { getFirestore, collection } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { app } from '../utils/firebase/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

// export const db = getFirestore(app);
export const useBridgeCollection = () => {
	const [bridgeLogsActive, setLogs] = useState(undefined);
	const [bridgeLogsActiveCount, setCount] = useState(0);
	const [loadingBridgeLogsActive, setLoading] = useState(true);

	const [value, loading, error] = useCollection(collection(getFirestore(app), 'Bridge'), {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	useEffect(() => {
		if (!loading && !error) {
			let allLogs = [];
			value.docs.forEach((doc) => {
				allLogs.push(doc.data());
			});

			setLogs(allLogs);
			setCount(allLogs.length);
		}
		setLoading(loading);
	}, [value, loading, error]);

	return {
		bridgeLogsActive,
		bridgeLogsActiveCount,
		loadingBridgeLogsActive,
	};
};
