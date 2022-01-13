import { useEffect } from 'react';
import { useMoralisCloudFunction } from 'react-moralis';
import Chains from '../components/chains/Chains';
import { useGQLQueryL1 } from '../hooks/useGQLQuery';
import { useUser } from '../hooks/useUser';
import { GET_TEST } from '../queries/Subgraph';

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

				<Chains />

				{/* <UserInfo /> */}
			</div>
		</div>
	);
};

export default Home;
