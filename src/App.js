import { Route, Switch } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';

import Navbar from './components/navigation/Navbar';
import Home from './pages/Home';
import Art from './pages/Art';
import EternalBattle from './pages/EternalBattle';
import Dashboard from './pages/Dashboard';
import EthemeralsMerals from './pages/EthemeralsMerals';
import PetDetails from './pages/PetDetails';
import MeralDetails from './pages/MeralDetails';
import WildsWorld from './components/wilds/WildsWorld';
import WildsHub from './components/wilds/WildsHub';
import WildsLand from './components/wilds/lands/WildsLand';

import Receipt from './components/Receipt';
import EBContextProvider from './context/EternalBattleContext';
import EthemeralsPets from './pages/EthemeralsPets';
import Mint from './pages/Mint';
import ArtDetails from './pages/ArtDetails';
import ArtGame from './pages/ArtGame';
import { registerModals } from './components/niceModals/RegisterModals';

function App() {
	registerModals();

	return (
		<HelmetProvider>
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
					{parseInt(process.env.REACT_APP_NETWORK) === 1 ? <Home /> : <Mint />}
				</Route>
				<Route exact path="/art">
					<Art />
				</Route>
				<Route exact path="/art/:id">
					<ArtDetails />
				</Route>
				<Route exact path="/artgame/:id">
					<DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
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
				<Route exact path="/wilds/world">
					<WildsWorld />
				</Route>
				<Route exact path="/wilds/land/:id">
					<WildsLand />
				</Route>
				<Route exact path="/wilds/hub">
					<WildsHub />
				</Route>
				<Route exact path="/wilds">
					<WildsWorld />
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
				<Route exact path="/pet/:id">
					<PetDetails />
				</Route>
				<Route exact path="/ethemeral/:id">
					<MeralDetails />
				</Route>
			</Switch>
			<Navbar />
		</HelmetProvider>
	);
}

export default App;
