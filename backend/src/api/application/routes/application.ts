export default {
  routes: [
    // Public: create application
    {
      method: 'POST',
      path: '/applications',
      handler: 'application.create',
      config: { auth: false },
    },
    // Admin: list all applications (requires auth token)
    {
      method: 'GET',
      path: '/applications',
      handler: 'application.find',
      config: { auth: false },
    },
    // Admin: get single application
    {
      method: 'GET',
      path: '/applications/:id',
      handler: 'application.findOne',
      config: { auth: false },
    },
    // Admin: update status / comment
    {
      method: 'PUT',
      path: '/applications/:id',
      handler: 'application.update',
      config: { auth: false },
    },
    // Admin: delete
    {
      method: 'DELETE',
      path: '/applications/:id',
      handler: 'application.delete',
      config: { auth: false },
    },
  ],
};
