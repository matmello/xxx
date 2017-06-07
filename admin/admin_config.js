AdminConfig = {
  skin: 'blue',
  name: 'Meteor Starter',
  nonAdminRedirectRoute: 'home',
  adminEmails: ['mat.mello93@gmail.com'],
  dashboard: {

  },
  collections: {
    'Meteor.users': {
      showInSideBar: false,
      extraFields: ['roles'],
      tableColumns: [
        {label:'Nome', name:'profile.name'},
        {label:'Email', name:'emails[0].address'},
        {label:'Criado em', name:'createdAt', template: 'createdAt'},
      ],
      routes: {
      },
      templates: {
        edit: {
          name: 'editUser',
          data: {
            user() {
              if (Meteor.isClient) {
                return Session.get('admin_doc');
              }
            }
          }
        }
      },
      label: 'Usuários',
      color: 'blue',
      icon: 'user',
      // showWidget: false,
    },
}
};


AdminDashboard.addSidebarItem('Usuários', AdminDashboard.path('/Meteor.users'), { icon: 'user' });

// AdminDashboard.addSidebarItem('Alunos', {
//   icon: 'user',
//   urls: [
//       { title: 'Criar', url: AdminDashboard.path('/alunos/new') },
//       { title: 'Ver todos', url: AdminDashboard.path('/alunos') },
//     ]
// });
