import gql from 'graphql-tag';

export const GET_CORE = gql`
	query ($id: ID!) {
		core(id: $id) {
			id
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

export const GET_NFTS = gql`
	query {
		ethemerals(first: 100, orderBy: timestamp, orderDirection: desc) {
			id
			timestamp
			edition
			score
			owner {
				id
			}
			metadata {
				coin
				mainClass
				subClass
				special1
				special2
				attack
				defence
				speed
				baseImage
			}
		}
	}
`;

export const GET_NFT = gql`
	query ($id: ID!) {
		ethemeral(id: $id) {
			id
			timestamp
			creator {
				id
			}
			owner {
				id
			}
			edition
			score
			rewards
			actions(first: 10, orderBy: timestamp, orderDirection: desc) {
				timestamp
				win
				transaction {
					id
					from
					to
				}
				type
			}
			scorecard {
				highestScore
				highestRewards
				battles
				wins
				revived
				resurrected
				reaped
				drained
			}
			metadata {
				coin
				artist
				mainClass
				subClass
				special1
				attack
				defence
				speed
				baseImage
			}
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
				rewards
				scorecard {
					battles
				}
				metadata {
					coin
					mainClass
					subClass
				}
			}
		}
	}
`;

export const GET_ETERNALBATTLE_ACCOUNT = gql`
	query ($id: ID!) {
		account(id: $id) {
			id
			ethemerals(orderBy: score, orderDirection: desc) {
				id
				score
				previousOwner {
					id
				}
				metadata {
					coin
					mainClass
					subClass
				}
				actions(first: 1, where: { staked: true }) {
					timestamp
					priceFeed
					staked
					long
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

export const GET_CORE_ACCOUNT = gql`
	query ($id: ID!) {
		account(id: $id) {
			elfBalance
		}
	}
`;
