export default {
  routes: [
    {
      method: 'GET',
      path: '/students',
      handler: 'student.find',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/students/:id',
      handler: 'student.findOne',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/students',
      handler: 'student.create',
      config: { auth: false },
    },
    {
      method: 'PUT',
      path: '/students/:id',
      handler: 'student.update',
      config: { auth: false },
    },
    {
      method: 'DELETE',
      path: '/students/:id',
      handler: 'student.delete',
      config: { auth: false },
    },
  ],
};
