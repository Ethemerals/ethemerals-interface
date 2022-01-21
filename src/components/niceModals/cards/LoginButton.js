import { useUser } from '../../../hooks/useUser';

const LoginButton = () => {
	const { login } = useUser();
	return (
		<>
			<button onClick={login} className="px-4 p-2 bg-blue-100">
				Login
			</button>
		</>
	);
};

export default LoginButton;
