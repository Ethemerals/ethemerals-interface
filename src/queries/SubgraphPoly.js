import gql from 'graphql-tag';

export const GET_NFT_L2 = gql`
	query ($id: ID!) {
		meral(id: $id) {
			id
			type
			tokenId
			meralId
			proxy
			timestamp
			verifiedOwner {
				id
			}
			creator {
				id
			}
			owner {
				id
			}
			cmId
			hp
			maxHp
			elf
			xp
			atk
			def
			spd
			element
			actions(first: 10, orderBy: timestamp, orderDirection: desc) {
				timestamp
				transaction {
					id
					from
					to
				}
				type
				description
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
		}
	}
`;

export const GET_ACCOUNT_L2 = gql`
	query ($id: ID!) {
		account(id: $id) {
			id
			elfBalance
			allowDelegates
			merals(orderBy: timestamp, orderDirection: desc, where: { status: 2 }) {
				id
				type
				tokenId
				meralId
				proxy
				timestamp
				hp
				maxHp
				elf
				xp
				atk
				def
				spd
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

export const GET_MERALS_BY_VERIFIEDOWNER = gql`
	query ($id: ID!) {
		merals(orderBy: timestamp, orderDirection: desc, where: { verifiedOwner: $id, status: 2 }) {
			id
		}
	}
`;

export const GET_PENDING_MERALS = gql`
	query ($id: ID!) {
		account(id: $id) {
			id
			merals(orderBy: timestamp, orderDirection: desc, where: { status: 1 }) {
				id
				type
				tokenId
				meralId
				proxy
				verifiedOwner {
					id
				}
				timestamp
				hp
				elf
				xp
				atk
				def
				spd
				cmId
				element
				coin
				name
				mainclass
				subclass
			}
		}
	}
`;

export const GET_PROXY_MERALS = gql`
	query ($id: ID!) {
		account(id: $id) {
			id
			merals(orderBy: timestamp, orderDirection: desc, where: { status: 2 }) {
				id
				type
				tokenId
				meralId
				proxy
				verifiedOwner {
					id
				}
				timestamp
				hp
				elf
				xp
				atk
				def
				spd
				cmId
				element
				coin
				name
				mainclass
				subclass
			}
		}
	}
`;
