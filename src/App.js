import { Route, Switch } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import { isMobile } from 'react-device-detect';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import Navbar from './components/navigation/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Art from './pages/Art';
import BattleEternal from './pages/BattleEternal';
import BattleWilds from './pages/BattleWilds';
import BattleRoyale from './pages/BattleRoyale';
import Dashboard from './pages/Dashboard';
import Ethemerals from './pages/Ethemerals';
import NFTDetails from './pages/NFTDetails';
import Resurrect from './pages/Resurrect';
import Redemption from './pages/Redemption';
import Marketplace from './pages/Marketplace';
import About from './pages/About';
import Help from './pages/Help';
import Dev from './pages/Dev';

import Web3ContextProvider from './hooks/Web3Context';
import TxContextProvider from './hooks/TxContext';
import Receipt from './components/modals/Receipt';
import ClaimHighestHonor from './pages/ClaimHighestHonor';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchInterval: 240000,
		},
	},
});

function App() {
	return (
		<HelmetProvider>
			<QueryClientProvider client={queryClient}>
				<Web3ContextProvider>
					<TxContextProvider>
						<div className={`text-white pt-8 sm:pt-14 ${isMobile ? 'overflow-hidden' : ''}`}>
							<Navbar />
							<Receipt />
							<ReactQueryDevtools initialIsOpen={false} />
							<Helmet>
								<title>Ethemerals</title>
							</Helmet>
							<Switch>
								<Route exact path="/">
									<Home />
								</Route>
								<Route exact path="/mint">
									<Home />
								</Route>
								<Route exact path="/admin">
									<Admin />
								</Route>
								<Route exact path="/art">
									<Art />
								</Route>
								<Route exact path="/battle">
									<BattleEternal />
								</Route>
								<Route exact path="/battle/eternal">
									<BattleEternal />
								</Route>
								<Route exact path="/battle/wilds">
									<BattleWilds />
								</Route>
								<Route exact path="/battle/royale">
									<BattleRoyale />
								</Route>
								<Route exact path="/dashboard">
									<Dashboard />
								</Route>
								<Route exact path="/ethemerals">
									<Ethemerals />
								</Route>
								<Route exact path="/ethemerals/:sort">
									<Ethemerals />
								</Route>
								<Route exact path="/ethemeral/:id">
									<NFTDetails />
								</Route>
								<Route exact path="/resurrect/:id">
									<Resurrect />
								</Route>
								<Route exact path="/redemption/:id">
									<Redemption />
								</Route>
								<Route exact path="/claim/:id">
									<ClaimHighestHonor />
								</Route>
								<Route exact path="/marketplace">
									<Marketplace />
								</Route>
								<Route exact path="/about">
									<About />
								</Route>
								<Route exact path="/help">
									<Help />
								</Route>
								<Route exact path="/dev">
									<Dev />
								</Route>
								<Route exact path="/dev/:crop">
									<Dev />
								</Route>
							</Switch>
						</div>
					</TxContextProvider>
				</Web3ContextProvider>
			</QueryClientProvider>
		</HelmetProvider>
	);
}

export default App;
