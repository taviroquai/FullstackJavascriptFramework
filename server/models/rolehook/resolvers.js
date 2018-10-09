const RoleHook = require('./RoleHook');

// Fetch helper
const getRoleHookById = async (id) => {
  id = parseInt(id, 10);
  const rolehook = await RoleHook.query().findById(id);
  return rolehook;
}

/**
 * Graphql resolvers
 */
const resolvers = {
  Query: {

    /**
     * Get rolehooks list
     */
    getRoleHooks: async (root, args, context) => {
      const query = RoleHook.query();
      const limit = args.limit || 999;
      const page = args.page || 0;

      // Load relations
      query.eager('[role, hook]');

      // Filter by role
      if (args.role_id) query.where('role_id', args.role_id)

      // Filter by hook
      if (args.hook_id) query.where('hook_id', args.role_id)

      // Filter by bypass
      if (args.bypass) query.where('bypass', args.bypass)

      // Order
      query.orderBy('id', 'desc')

      // Get results
      const result = await query.page(page, limit);
      return result;
    }
  },

  Mutation: {

    /**
     * Update rolehook
     */
    updateRoleHook: async (root, args, context) => {
      await RoleHook.query()
        .patch({ bypass: args.bypass })
        .where('id', args.id)
      return true;
    }
  }
}

module.exports = resolvers;
