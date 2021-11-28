import { Route, Switch } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Navbar from './components/navigation/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Art from './pages/Art';
import EternalBattle from './pages/EternalBattle';
import Dashboard from './pages/Dashboard';
import EthemeralsMerals from './pages/EthemeralsMerals';
import Equipable from './pages/Equipable';
import MeralDetails from './pages/MeralDetails';
import All from './pages/All';

import Web3ContextProvider from './context/Web3Context';

// import Dev from './pages/Dev';
// import DevItems from './pages/DevItems';

import TxContextProvider from './context/TxContext';
import Receipt from './components/modals/Receipt';
import EBContextProvider from './context/EternalBattleContext';
import Items from './pages/Items';
import EthemeralsPets from './pages/EthemeralsPets';
import Mint from './pages/Mint';
import ArtDetails from './pages/ArtDetails';
import ArtGame from './pages/ArtGame';

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
							<Route exact path="/art/:id">
								<ArtDetails />
							</Route>
							<Route exact path="/artgame/:id">
								<DndProvider backend={HTML5Backend}>
									<ArtGame />
								</DndProvider>
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
								<MeralDetails />
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
