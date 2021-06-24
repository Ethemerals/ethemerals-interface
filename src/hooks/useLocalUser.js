import { useState, useCallback, useEffect } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';

const useLocalUser = () => {
	const [localUser, setLocalUser] = useState(undefined);
	// reactLocalStorage.clear();

	useEffect(() => {
		const user = reactLocalStorage.getObject('localUser', {}, true);

		if (user) {
			setLocalUser(user);
		}
	}, []);

	useEffect(() => {
		if (localUser) {
			setLocalUser(localUser);
		}
	}, [localUser]);

	const updateLocalUser = (_localUser) => {
		const userUpdate = {
			...localUser,
			..._localUser,
		};
		reactLocalStorage.setObject('localUser', userUpdate);
		setLocalUser(userUpdate);
	};

	return [localUser, updateLocalUser];
};

export default useLocalUser;
