import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const IsWildsContext = React.createContext();
const IsWildsHomeContext = React.createContext();

export function useIsWildsContext() {
	return useContext(IsWildsContext);
}

export function useIsWildsHomeContext() {
	return useContext(IsWildsHomeContext);
}

export default function MenuContext({ children }) {
	const location = useLocation();

	const [isWilds, setIsWilds] = useState(false);
	const [isWildsHome, setIsWildsHome] = useState(false);

	useEffect(() => {
		if (location.pathname.includes('wilds') || location.pathname.includes('register') || location.pathname.includes('battle') || location.pathname.includes('onsen')) {
			setIsWilds(true);
		} else {
			setIsWilds(false);
		}
		if (location.pathname === '/wilds') {
			setIsWildsHome(true);
		} else {
			setIsWildsHome(false);
		}
	}, [location]);

	return (
		<IsWildsContext.Provider value={isWilds}>
			<IsWildsHomeContext.Provider value={isWildsHome}>{children}</IsWildsHomeContext.Provider>
		</IsWildsContext.Provider>
	);
}
