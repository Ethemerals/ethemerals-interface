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

export const GET_DELEGATES = gql`
	query {
		delegates {
			id
			active
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
			coin
			subClass
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
			coin
			mainClass
			subClass
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
			coin
			subClass
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
				atkBonus
				defBonus
				spdBonus
				baseId
				bgId
				coin
				mainClass
				subClass
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
				atkBonus
				defBonus
				spdBonus
				baseId
				bgId
				previousOwner {
					id
				}
				coin
				mainClass
				subClass

				actions(first: 1, orderBy: timestamp, orderDirection: desc, where: { staked: true }) {
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
