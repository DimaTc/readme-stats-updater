import { graphql } from '@octokit/graphql';

// GraphQL query to fetch top languages used in user's repositories
const TOP_LANGUAGES_QUERY = `
  query TopLanguagesQuery($login: String!) {
    user(login: $login) {
      repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
        nodes {
          name
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Extracts languages and their total size from repositories.
 * @param {Array} repositories - The array of repositories.
 * @returns {Object} Accumulated sizes of languages across repositories.
 */
const aggregateLanguages = repositories => repositories.reduce((accumulator, repository) => {
    repository.languages.edges.forEach(({ size, node: { name, color } }) => {
        if (!accumulator[name])
            accumulator[name] = { color, size: 0 };
        accumulator[name].size += size;
    });
    return accumulator;
}, {});


/**
 * Fetches and ranks languages used across a user's repositories.
 * @returns {Object} Sorted languages by usage.
 */
export const fetchTopLanguages = async () => {
    const headers = { authorization: `Bearer ${process.env.GITHUB_TOKEN}` };
    const requestData = graphql.defaults({ headers });
    const parameters = { login: process.env.GITHUB_REPOSITORY_OWNER };

    const { user } = await requestData(TOP_LANGUAGES_QUERY, parameters);
    if (!user) throw new Error('Could not retrieve repository statistics.');

    const languages = aggregateLanguages(user.repositories.nodes);
    return Object.fromEntries(Object.entries(languages).sort(([, a], [, b]) => b.size - a.size));
};

