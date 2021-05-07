module.exports = {
    client: {
      excludes: ['**/src/services/graphql/uniswap/**/*'], // array of glob patterns
      service: {
        name: "dexkit",
        url: "https://dexkit.graphql.bitquery.io"
      }
    }
  };