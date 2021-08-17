import { useQuery } from 'react-query';
import { GraphQLClient } from 'graphql-request';
import Links from '../constants/Links';

export const useGQLQuery = (key, query, variables, config = {}) => {
	// let endpoint = 'https://api.thegraph.com/subgraphs/name/ethemerals/ethemerals';
	const endpoint = Links.SUBGRAPH_ENDPOINT;
	// let endpoint = `https://gateway.testnet.thegraph.com/api/${apiKey}/subgraphs/id/0xf8e29f760d92dfd371d864976d7a4729ddd98300-0`;

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
