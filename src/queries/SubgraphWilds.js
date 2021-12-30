import gql from 'graphql-tag';

export const GET_LAND = gql`
	query ($id: ID!) {
		wildLand(id: $id) {
			id
			timestamp
			raidStatus
			remainingELFx
			emissionRate
			lastEvent
			lastRaid
			baseDefence
			wildStakes(where: { active: true }, orderBy: "startedAt", orderDirection: "asc") {
				id
				damage
				health
				stakeType
			}
			lcp(first: 10, orderBy: "points", orderDirection: "desc") {
				id
				points
			}
		}
	}
`;

export const GET_LANDS = gql`
	query {
		wildLands(first: 6) {
			id
			timestamp
			raidStatus
			remainingELFx
			wildStakes(where: { active: true }, orderBy: "startedAt", orderDirection: "asc") {
				id
				stakeType
			}
		}
	}
`;

export const GET_NFT_WILDS = gql`
	query ($id: ID!) {
		ethemeral(id: $id) {
			id
			timestamp
			creator {
				id
			}
			previousOwner {
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
