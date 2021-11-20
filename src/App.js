import { Route, Switch } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import Navbar from './components/navigation/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Art from './pages/Art';
import EternalBattle from './pages/EternalBattle';
import Dashboard from './pages/Dashboard';
import EthemeralsMerals from './pages/EthemeralsMerals';
import Equipable from './pages/Equipable';
import NFTDetails from './pages/NFTDetails';
import All from './pages/All';
// import Resurrect from './pages/Resurrect';
// import Redemption from './pages/Redemption';
// import Marketplace from './pages/Marketplace';
// import About from './pages/About';
// import Help from './pages/Help';
// import Dev from './pages/Dev';
// import DevItems from './pages/DevItems';
// import NFTTest from './pages/NFTTest';

import Web3ContextProvider from './hooks/Web3Context';
import TxContextProvider from './hooks/TxContext';
import Receipt from './components/modals/Receipt';
import EBContextProvider from './hooks/EternalBattleContext';
// import ClaimHighestHonor from './pages/ClaimHighestHonor';
import Items from './pages/Items';
import OpenseaEquipables from './pages/OpenseaEquipables';
import EthemeralsPets from './pages/EthemeralsPets';

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
						<Receipt />

						<Helmet>
							<title>Ethemerals</title>
						</Helmet>
						<ReactQueryDevtools initialIsOpen={false} />

						<Switch>
							<Route exact path="/opensea_equipables/:id">
								<OpenseaEquipables />
							</Route>
							<Route exact path="/">
								<Home />
							</Route>
							<Route exact path="/mint">
								<Home />
							</Route>
							<Route exact path="/admin">
								<Admin />
							</Route>
							<Route exact path="/all">
								<All />
							</Route>
							<Route exact path="/art">
								<Art />
							</Route>

							<Route exact path="/battle/">
								<EBContextProvider>
									<EternalBattle />
								</EBContextProvider>
							</Route>
							<Route exact path="/battle/:id">
								<EBContextProvider>
									<EternalBattle />
								</EBContextProvider>
							</Route>
							<Route exact path="/dashboard">
								<Dashboard />
							</Route>
							<Route exact path="/ethemerals">
								<EthemeralsMerals />
							</Route>
							<Route exact path="/ethemerals/merals">
								<EthemeralsMerals />
							</Route>
							<Route exact path="/ethemerals/pets">
								<EthemeralsPets />
							</Route>
							<Route exact path="/items">
								<Items />
							</Route>
							<Route exact path="/items/:sort">
								<Items />
							</Route>
							<Route exact path="/equipable/:id">
								<Equipable />
							</Route>
							<Route exact path="/ethemeral/:id">
								<NFTDetails />
							</Route>
							{/* <Route exact path="/test">
									<NFTTest />
								</Route> */}
							{/* <Route exact path="/resurrect/:id">
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
								</Route> */}
							{/* <Route exact path="/dev">
									<Dev />
								</Route>
								<Route exact path="/dev/:crop">
									<Dev />
								</Route>
								<Route exact path="/devitems">
									<DevItems />
								</Route>
								<Route exact path="/devitems/:crop">
									<DevItems />
								</Route> */}
						</Switch>
						<Navbar />
					</TxContextProvider>
				</Web3ContextProvider>
			</QueryClientProvider>
		</HelmetProvider>
	);
}

export default App;
