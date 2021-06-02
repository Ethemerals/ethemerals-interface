import { Route, Switch } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import { isMobile } from 'react-device-detect';

import Navbar from './components/navigation/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Art from './pages/Art';
import Battle from './pages/Battle';
import Dashboard from './pages/Dashboard';
import Ethemerals from './pages/Ethemerals';
import Marketplace from './pages/Marketplace';

function App() {
	return (
		<div className={`text-white pt-8 sm:pt-14 ${isMobile ? 'overflow-hidden' : ''}`}>
			<Navbar />
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
				<Route exact path="/marketplace">
					<Marketplace />
				</Route>
			</Switch>
		</div>
	);
}

export default App;
