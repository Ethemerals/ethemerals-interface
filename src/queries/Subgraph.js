import gql from 'graphql-tag';

export const GET_CORE = gql`
	query ($id: ID!) {
		core(id: $id) {
			id
			owner
			mintPrice
			revivePrice
			winnerFunds
			winnerMult
			winningCoin
		}
	}
`;

export const GET_ACCOUNTS = gql`
	query {
		accounts {
			id
			elfBalance
		}
	}
`;

export const GET_ACCOUNT = gql`
	query ($id: ID!) {
		account(id: $id) {
			id
			elfBalance
			disallowDelegates
			ethemerals(orderBy: timestamp, orderDirection: desc) {
				id
				timestamp
				score
				metadata {
					coin
					mainClass
				}
			}
		}
	}
`;

export const GET_ACCOUNT_ACTIONS = gql`
	query ($id: ID!) {
		account(id: $id) {
			id
			actions(first: 8, orderBy: timestamp, orderDirection: desc) {
				id
				type
				timestamp
				account {
					id
					disallowDelegates
				}
				ethemeral {
					id
				}
				transaction {
					id
					from
					to
				}
			}
		}
	}
`;
