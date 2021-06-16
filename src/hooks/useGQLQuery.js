import { useQuery } from 'react-query';
import { GraphQLClient } from 'graphql-request';

export const useGQLQuery = (key, query, variables, config = {}) => {
	const endpoint = 'https://api.thegraph.com/subgraphs/name/ethemerals/ethemerals';

	// const headers = {
	//   headers: {
	//     authorization: `token here`
	//   }
	// }

	const graphQLClient = new GraphQLClient(endpoint);

	const fetchData = async () => await graphQLClient.request(query, variables);

	return useQuery(key, fetchData, config);
};

export const useUniGQLQuery = (key, query, variables, config = {}) => {
	const endpoint = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

	// const headers = {
	//   headers: {
	//     authorization: `token here`
	//   }
	// }

	const graphQLClient = new GraphQLClient(endpoint);

	const fetchData = async () => await graphQLClient.request(query, variables);

	return useQuery(key, fetchData, config);
};
