import gql from 'graphql-tag';

export const GET_ESCROWL1_ACCOUNT = gql`
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
				metadata {
					id
					coin
					mainClass
					subClass
				}
				actions(first: 1, orderBy: timestamp, orderDirection: desc) {
					timestamp
				}
			}
		}
	}
`;
