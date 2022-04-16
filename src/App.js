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
import WildsWorldAlpha from './components/wilds/WildsWorldAlpha';
import RegisterMerals from './components/proxyMerals/RegisterMerals';
import EternalBattleL2 from './components/battleL2/EternalBattleL2';
import EternalBattleL1 from './components/battle/EternalBattleL1';

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
				<Route exact path="/battle/mainnet">
					<EBContextProvider>
						<EternalBattleL1 />
					</EBContextProvider>
				</Route>
				<Route exact path="/battle/mainnet/:id">
					<EBContextProvider>
						<EternalBattleL1 />
					</EBContextProvider>
				</Route>
				<Route exact path="/battle/poly">
					<EBContextProvider>
						<EternalBattleL2 />
					</EBContextProvider>
				</Route>
				<Route exact path="/battle/poly/:id">
					<EBContextProvider>
						<EternalBattleL2 />
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
					<WildsWorldAlpha />
					{/* {parseInt(process.env.REACT_APP_NETWORK) !== 1 ? <WildsWorld /> : <WildsWorldAlpha />} */}
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

				{/* MERALMANAGER */}
				<Route exact path="/register">
					<RegisterMerals />
				</Route>
			</Switch>
			<Navbar />
		</HelmetProvider>
	);
}

export default App;
