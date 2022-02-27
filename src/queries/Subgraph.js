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

export const GET_DELEGATES = gql`
	query {
		delegates(first: 100, orderBy: timestamp, orderDirection: asc) {
			id
			timestamp
			active
		}
	}
`;

export const GET_NFTS_ORDERED = gql`
	query ($orderBy: String!, $first: Int!, $orderDirection: String!) {
		merals(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
			id
			tokenId
			meralId
			timestamp
			hp
			elf
			atk
			def
			spd
			cmId
			element
			coin
			name
			subclass
		}
	}
`;

export const GET_NFTS_FILTERED = gql`
	query {
		meral(where: { edition: 1 }, orderBy: "baseId", orderDirection: "asc") {
			id
			tokenId
			meralId
			timestamp
			hp
			elf
			atk
			def
			spd
			cmId
			element
			coin
			name
			subclass
		}
	}
`;

export const GET_NFT = gql`
	query ($id: ID!) {
		meral(id: $id) {
			id
			tokenId
			meralId
			timestamp
			creator {
				id
			}
			owner {
				id
			}
			cmId
			edition
			hp
			elf
			atk
			def
			spd
			atkBonus
			defBonus
			spdBonus
			element
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
				reviver
				reaped
				reaper
			}
			coin
			name
			subclass
			mainclass
			artist
		}
	}
`;

export const GET_NFT_LIGHT = gql`
	query ($id: ID!) {
		meral(id: $id) {
			id
			tokenId
			meralId
			owner {
				id
			}
			edition
			hp
			elf
			atk
			def
			spd
			cmId
			element
			coin
			name
			subclass
			scorecard {
				battles
				wins
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
			merals(orderBy: timestamp, orderDirection: desc) {
				id
				tokenId
				meralId
				timestamp
				hp
				elf
				atk
				def
				spd
				atkBonus
				defBonus
				spdBonus
				cmId
				element
				scorecard {
					battles
				}
				coin
				name
				mainclass
				subclass
			}
			pets(orderBy: timestamp, orderDirection: desc) {
				id
				tokenId
				timestamp
				baseId
				rarity
				atk
				def
				spd
				name
			}
			actions(first: 10, orderBy: timestamp, orderDirection: desc) {
				id
				timestamp
				account {
					id
				}
				meral {
					tokenId
					meralId
				}
				pet {
					tokenId
				}
				transaction {
					id
					to
					from
				}
				type
			}
		}
	}
`;

export const GET_ETERNALBATTLE_ACCOUNT = gql`
	query ($id: ID!) {
		account(id: $id) {
			id
			merals(orderBy: timestamp, orderDirection: desc) {
				id
				tokenId
				meralId
				timestamp
				hp
				elf
				atk
				def
				spd
				atkBonus
				defBonus
				spdBonus
				cmId
				element
				previousOwner {
					id
				}
				scorecard {
					battles
				}
				coin
				name
				mainclass
				subclass
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
				meral {
					tokenId
					meralId
				}
				pet {
					tokenId
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
			baseId
			timestamp
			atk
			def
			spd
			rarity
			name
		}
	}
`;

export const GET_PET = gql`
	query ($id: ID!) {
		pet(id: $id) {
			id
			baseId
			timestamp
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
			name
		}
	}
`;

export const GET_PET_LIGHT = gql`
	query ($id: ID!) {
		pet(id: $id) {
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
			name
		}
	}
`;
