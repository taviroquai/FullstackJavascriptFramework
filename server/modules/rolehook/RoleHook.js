const Model = require('../Model');
const Role = require('../role/Role');

class RoleHook extends Model {

  /**
   * Set database table name
   */
  static get tableName() {
    return 'role_hooks';
  }

  /**
   * Set validation schema
   */
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['role_id', 'hook', 'bypass'],
      properties: {
        bypass: { type: 'boolean' }
      }
    }
  };

  /**
   * Role relation
   */
  static get relationMappings() {
    return {
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: 'role_hooks.role_id',
          to: 'roles.id'
        }
      }
    }
  }

  /**
   * Populate with role
   */
  static async populateWithRole(role) {
    const ModuleManager = require('../../ModuleManager');
    const hooks = ModuleManager.getHooksNames();
    const items = [];
    for (let h of hooks) items.push({
      role_id: role.id,
      hook: h,
      bypass: false
    });
    await RoleHook.query().insert(items)
  }
}

module.exports = RoleHook;
