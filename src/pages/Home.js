import { useEffect } from 'react';

import { useUser } from '../hooks/useUser';

const Home = () => {
	const { isAuthenticated, login, logout, user } = useUser();

	return (
		<div>
			<div className="page_bg"></div>
			<div
				style={{ backgroundImage: "url('https://ethemerals-media.s3.amazonaws.com/webapp/home_banner.png')", backgroundRepeat: 'no-repeat', height: '495px' }}
				className="absolute top-2/4 w-full bg-cover bg-center"
			></div>

			<div className="py-20">
				test
				{!isAuthenticated ? (
					<div>
						<button onClick={login}>Authenticate</button>
					</div>
				) : (
					<div>
						<h1>Welcome {user.get('username')}</h1>
						<button onClick={logout}>Logout</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
