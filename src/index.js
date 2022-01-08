import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MoralisProvider } from 'react-moralis';

const queryClient = new QueryClient();

const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<QueryClientProvider client={queryClient}>
				<MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
					<App />
				</MoralisProvider>
			</QueryClientProvider>
		</Router>
	</React.StrictMode>,
	document.getElementById('root')
);
