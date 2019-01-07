/**
 * Graphql resolvers
 */
const resolvers = {
  Query: {

    /**
     * Get resource list
     */
    getResources: async (root, args, context) => {
      const ModuleManager = use('core/ModuleManager');
      const results = ModuleManager.getResourcesNames();
      const total = results.length;
      return { total, results };
    }
  }
}

module.exports = resolvers;
