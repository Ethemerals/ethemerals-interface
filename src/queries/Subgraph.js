import gql from 'graphql-tag';

export const GET_CORE = gql`
	query ($id: ID!) {
		core(id: $id) {
			id
			mintPrice
			maxAvailableIndex
			ethemeralSupply
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

export const GET_NFTS_ORDERED = gql`
	query ($orderBy: String!, $first: Int!, $orderDirection: String!) {
		ethemerals(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
			id
			timestamp
			score
			rewards
			atk
			def
			spd
			baseId
			bgId
			metadata {
				id
				coin
				subClass
			}
		}
	}
`;

export const GET_NFTS_FILTERED = gql`
	query {
		ethemerals(where: { edition: 1 }, orderBy: "baseId", orderDirection: "asc") {
			id
			timestamp
			score
			rewards
			atk
			def
			spd
			baseId
			bgId
			metadata {
				id
				coin
				subClass
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
			atk
			def
			spd
			atkBonus
			defBonus
			spdBonus
			bgId
			petRedeemed
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
				id
				coin
				artist
				mainClass
				subClass
			}
		}
	}
`;

export const GET_NFT_LIGHT = gql`
	query ($id: ID!) {
		ethemeral(id: $id) {
			id
			owner {
				id
			}
			edition
			score
			rewards
			atk
			def
			spd
			baseId
			bgId
			scorecard {
				battles
				wins
			}
			metadata {
				id
				coin
				subClass
			}
		}
	}
`;

export const GET_ACCOUNT = gql`
	query ($id: ID!) {
		account(id: $id) {
			id
			elfBalance
			allowDelegates
			ethemerals(orderBy: timestamp, orderDirection: desc) {
				id
				timestamp
				score
				rewards
				atk
				def
				spd
				baseId
				bgId
				scorecard {
					battles
				}
				metadata {
					id
					coin
					mainClass
					subClass
				}
			}
			pets(orderBy: timestamp, orderDirection: desc) {
				id
				baseId
				timestamp
				rarity
				atk
				def
				spd
				metadata {
					name
				}
			}
			items(orderBy: timestamp, orderDirection: desc) {
				id
				baseId
				timestamp
				rarity
				atk
				def
				spd
				metadata {
					name
				}
			}
		}
	}
`;

export const GET_ETERNALBATTLE_ACCOUNT = gql`
	query ($id: ID!) {
		account(id: $id) {
			id
			ethemerals(orderBy: timestamp, orderDirection: desc) {
				id
				timestamp
				score
				rewards
				atk
				def
				spd
				baseId
				bgId
				previousOwner {
					id
				}
				scorecard {
					battles
				}
				metadata {
					id
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
				pet {
					id
				}
				item {
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

export const GET_ITEMS_ORDERED = gql`
	query ($orderBy: String!, $first: Int!, $orderDirection: String!) {
		items(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
			id
			timestamp
			baseId
			atk
			def
			spd
			rarity
			metadata {
				name
			}
		}
	}
`;

export const GET_ITEM = gql`
	query ($id: ID!) {
		item(id: $id) {
			id
			timestamp
			baseId
			creator {
				id
			}
			owner {
				id
			}
			edition
			atk
			def
			spd
			rarity
			actions(first: 10, orderBy: timestamp, orderDirection: desc) {
				timestamp
				transaction {
					id
					from
					to
				}
				type
			}
			metadata {
				name
			}
		}
	}
`;

export const GET_ITEM_LIGHT = gql`
	query ($id: ID!) {
		item(id: $id) {
			id
			baseId
			owner {
				id
			}
			edition
			atk
			def
			spd
			rarity
			metadata {
				name
			}
		}
	}
`;

export const GET_PETS_ORDERED = gql`
	query ($orderBy: String!, $first: Int!, $orderDirection: String!) {
		pets(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
			id
			timestamp
			baseId
			atk
			def
			spd
			rarity
			metadata {
				name
			}
		}
	}
`;

export const GET_PET = gql`
	query ($id: ID!) {
		pet(id: $id) {
			id
			timestamp
			baseId
			creator {
				id
			}
			owner {
				id
			}
			edition
			atk
			def
			spd
			rarity
			metadata {
				name
			}
		}
	}
`;

export const GET_PET_LIGHT = gql`
	query ($id: ID!) {
		pet(id: $id) {
			id
			owner {
				id
			}
			baseId
			edition
			atk
			def
			spd
			rarity
			metadata {
				name
			}
		}
	}
`;
