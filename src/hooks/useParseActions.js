// import { useState, useCallback, useEffect } from 'react';
// import gql from 'graphql-tag';
// import { useQuery } from 'react-query';
// import { GraphQLClient, request } from 'graphql-request';

import Links from '../constants/Links';
import { shortenAddress } from '../utils';

// const graphQLClient = new GraphQLClient(Links.SUBGRAPH_ENDPOINT);

// export const GET_ACCOUNT = gql`
// 	query ($id: ID!) {
// 		account(id: $id) {
// 			id
// 			elfBalance
// 			disallowDelegates
// 			ethemerals(orderBy: id, orderDirection: asc) {
// 				id
// 			}
// 		}
// 	}
// `;

// Default
// Minted
// Transfer
// SendELF
// ReceiveELF
// Send
// Receive
// Staked
// Unstaked
// Revive
// Reaped
// RedeemELF
// RedeemHonor
// Resurrection
// DelegateChange

const useParseAction = (action) => {
	if (!action) {
		return ['', ''];
	}

	// const fetchData = async (query, variables) => {
	// 	const data = await graphQLClient.request(query, variables);
	// 	return data;
	// };

	let actionString = 'Default Transaction';
	const txLink = `${Links.ETHERSCAN_URL}tx/${action.transaction.id}`;

	switch (action.type) {
		case 'Default':
			actionString = 'Default Transaction';
			break;
		case 'Minted': // TOKEN ACTION
			actionString = `Minted by ${shortenAddress(action.transaction.from)} on ${action.timestamp}`;
			break;
		case 'Transfer': // TOKEN ACTION
			actionString = `Transfer`;
			break;
		case 'SendELF':
			actionString = `Sent ELF to ${shortenAddress(action.transaction.to)}`;
			break;
		case 'ReceiveELF':
			// TODO PARSE FROM CONTRACT OR FARM
			actionString = `Received ELF from ${shortenAddress(action.transaction.from)}`;
			break;
		case 'Send': // ACCOUNT SEND TOKEN
			actionString = `Sent Ethemeral #${action.ethemeral.id} to ${shortenAddress(action.transaction.to)}`;
			break;
		case 'Receive': // ACCOUNT RECEIVED TOKEN // New Minted if from == self
			if (action.ethemeral.id !== null) {
				if (action.transaction.from === action.account.id) {
					actionString = `Minted Ethemeral #${action.ethemeral.id}. Congratulations! `;
				} else {
					actionString = `Received Ethemeral #${action.ethemeral.id} from ${shortenAddress(action.transaction.from)} `;
				}
			}
			break;
		case 'DelegateChange': // ACCOUNT
			actionString = `Allow Delegates Change`;

			break;
		default:
			console.log('did not parse action');
	}

	return [actionString, txLink];
};

export default useParseAction;
