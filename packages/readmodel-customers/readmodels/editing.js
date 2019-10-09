module.exports = {
  projections: {
    CUSTOMER_CREATED: (
      { storage },
      { aggregateId, payload: { name, location } }
    ) => storage.insertOne('editing', { id: aggregateId, name, location }),

    CUSTOMER_UPDATED: (
      { storage },
      { aggregateId, payload: { name, location } }
    ) =>
      storage.updateOne(
        'editing',
        { id: aggregateId },
        { $set: { name, location } }
      )
  },

  resolvers: {
    byId: (storage, { id }) => {
      return storage
        .find('editing', { id })
        .project({ _id: 0 })
        .toArray();
    }
  }
};
