import { useQuery } from 'react-query';
import { GraphQLClient } from 'graphql-request';

export const useGQLQuery = (key, query, variables, config = {}) => {
	let endpoint = 'https://api.thegraph.com/subgraphs/name/ethemerals/ethemerals';

	if (variables) {
		if (variables.id === null) {
			console.log('null');
			endpoint = 'null';
		}
	}

	// const headers = {
	// 	headers: {
	// 		'Access-Control-Allow-Origin': '*',
	// 		'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
	// 		'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
	// 	},
	// };

	const fetchData = async () => await graphQLClient.request(query, variables);

	const graphQLClient = new GraphQLClient(endpoint);

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
