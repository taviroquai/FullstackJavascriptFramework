const Role = require('./Role');

// Fetch helper
const getRoleById = async (id) => {
  id = parseInt(id, 10);
  const role = await Role.query().findById(id);
  return role;
}

/**
 * Graphql resolvers
 */
const resolvers = {
  Query: {

    /**
     * Get roles list
     */
    getRoles: async (root, args, context) => {
      const query = Role.query();
      const limit = args.limit || 25;
      const page = args.page || 0;

      // Filter by query
      if (args.query) {
        query.where('label', 'ilike', '%' + args.query + '%')
      }

      // Get results
      const result = await query.page(page, limit);
      return result;
    },

    /**
     * Get role by id
     */
    getRoleById: async (root, args, context) => {
      const role = await getRoleById(args.id);
      if (!role) throw new Error('Role not found');
      return role;
    }
  },

  Mutation: {

    /**
     * Create role
     */
    createRole: async (root, args, context) => {
      const role = await Role.query()
        .insert(args)
        .returning('id');
      return await getRoleById(role.id);
    },

    /**
     * Update role
     */
    updateRole: async (root, args, context) => {
      if (!args.id) throw new Error('Role must exist');
      await Role.query()
        .update(args)
        .where('id', args.id)
      return await getRoleById(args.id);
    }

  }
}

module.exports = resolvers;