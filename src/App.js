import { Route, Switch } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import { isMobile } from 'react-device-detect';
import { QueryClient, QueryClientProvider } from 'react-query';

import Navbar from './components/navigation/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Art from './pages/Art';
import Battle from './pages/Battle';
import Dashboard from './pages/Dashboard';
import Ethemerals from './pages/Ethemerals';
import NFTDetails from './pages/NFTDetails';
import Marketplace from './pages/Marketplace';
import About from './pages/About';
import Help from './pages/Help';

import Web3ContextProvider from './hooks/Web3Context';
import TxContextProvider from './hooks/TxContext';
import Receipt from './components/modals/Receipt';

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Web3ContextProvider>
				<TxContextProvider>
					<div className={`text-white pt-8 sm:pt-14 ${isMobile ? 'overflow-hidden' : ''}`}>
						<Navbar />
						<Receipt />
						<ReactQueryDevtools initialIsOpen={false} />
						<Switch>
							<Route exact path="/">
								<Home />
							</Route>
							<Route exact path="/admin">
								<Admin />
							</Route>
							<Route exact path="/art">
								<Art />
							</Route>
							<Route exact path="/battle">
								<Battle />
							</Route>
							<Route exact path="/dashboard">
								<Dashboard />
							</Route>
							<Route exact path="/ethemerals">
								<Ethemerals />
							</Route>
							<Route exact path="/ethemerals/:id">
								<NFTDetails />
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
						</Switch>
					</div>
				</TxContextProvider>
			</Web3ContextProvider>
		</QueryClientProvider>
	);
}

export default App;
