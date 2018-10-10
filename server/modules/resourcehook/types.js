module.exports = `

  type ResourceHookList {
    total: Int
    results: [ResourceHook]
  }

  type ResourceHook {
    id: ID!
    hook: String!
    resource: String!
    active: Boolean
    type: String
    order: Int
  }
`
