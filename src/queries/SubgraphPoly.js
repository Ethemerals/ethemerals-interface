import gql from 'graphql-tag';

export const GET_NFTS_FILTERED_POLY = gql`
	query {
		meral(where: { edition: 1 }, orderBy: "baseId", orderDirection: "asc") {
			id
			timestamp
			hp
			xp
			atk
			def
			spd
			baseId
			element
			coin
			subclass
		}
	}
`;

export const GET_NFT_POLY = gql`
	query ($id: ID!) {
		meral(id: $id) {
			id
			timestamp
			owner {
				id
			}
			hp
			xp
			atk
			def
			spd
			element
			coin
			artist
			subclass
			# actions(first: 10, orderBy: timestamp, orderDirection: desc) {
			# 	timestamp
			# 	win
			# 	transaction {
			# 		id
			# 		from
			# 		to
			# 	}
			# 	type
			# }
		}
	}
`;

export const GET_NFT_LIGHT_POLY = gql`
	query ($id: ID!) {
		ethemeral(id: $id) {
			id
			owner {
				id
			}
			edition
			hp
			xp
			atk
			def
			spd
			baseId
			element
			coin
			subclass
		}
	}
`;
