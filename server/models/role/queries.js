module.exports = `

  getRoles(
    query: String
    limit: Int
    page: Int
  ): RoleList

  getRoleById(id: ID!): Role

`
