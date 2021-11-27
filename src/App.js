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

import Web3ContextProvider from './hooks/Web3Context';

// import Dev from './pages/Dev';
// import DevItems from './pages/DevItems';

import TxContextProvider from './hooks/TxContext';
import Receipt from './components/modals/Receipt';
import EBContextProvider from './hooks/EternalBattleContext';
import Items from './pages/Items';
import EthemeralsPets from './pages/EthemeralsPets';
import Mint from './pages/Mint';

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
							<Route exact path="/">
								<Home />
							</Route>
							<Route exact path="/mint">
								<Mint />
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
