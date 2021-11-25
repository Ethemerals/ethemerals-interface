import { useMemo } from 'react';
import { useMoralis } from 'react-moralis';
import { useNativeBalance } from 'react-moralis';

export const useUser = () => {
	// const [balance, setBalance] = useState(null);
	const { authenticate, isAuthenticated, isAuthenticating, isUnauthenticated, authError, logout, user } = useMoralis();
	const { data: balance } = useNativeBalance();

	const address = useMemo(() => user?.attributes.ethAddress, [user]);

	const login = () => {
		if (!user) {
			authenticate({ signingMessage: 'Ethemerals Authentication' });
		} else {
			logout();
		}
	};

	return {
		login,
		isAuthenticated,
		isAuthenticating,
		isUnauthenticated,
		authError,
		logout,
		user,
		address,
		balance: balance ? balance.balance : null,
	};
};
