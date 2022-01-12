import { useEffect } from 'react';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import Chains from '../components/chains/Chains';
import { useUser, useUserAccount } from '../hooks/useUser';
import { useWeb3 } from '../hooks/useWeb3';
import { useEternalBattleApproval } from '../hooks/useUser';
import abis from '../constants/contracts/abis';
import { Addresses } from '../constants/contracts/Addresses';
import { useMeralGlobal } from '../hooks/useMeralImagePaths';

const Home = () => {
	const { isApproved } = useEternalBattleApproval();
	const { isAuthenticated, login, logout, user, address } = useUser();
	const { meralGlobal, meralGlobalIsLoading } = useMeralGlobal();

	useEffect(() => {
		console.log(isApproved);
	}, [isApproved]);

	useEffect(() => {
		if (meralGlobal) {
			console.log(meralGlobal.getGen1Colors());
		}
	}, [meralGlobal]);

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
