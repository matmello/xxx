AdminConfig = {
  skin: 'red-light',
  name: 'IS2EAT',
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
        {label:'Tipo', name:'profile.type', template: 'type'}
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
        },
        new: {
          name: 'newUser',
          data: {
            user() {
              if (Meteor.isClient) {
                return Session.get('admin_doc');
              }
            }
          }
        }
      },
      label: 'Users',
      color: 'red',
      icon: 'user',
      // showWidget: false,
    },
    Restaurants: {
      // omitFields: ['userId'],
      showWidget: true,
      showInSideBar: false,
      label: 'Estabelecimentos',
      icon: 'cutlery',
      color: 'red',
      tableColumns: [{label:'Nome', name:'nome'}],
    },
    RestaurantTypes: {
      showWidget: false,
      showInSideBar: false,
      label: 'Tipos',
      icon: 'bars',
      color: 'red',
      tableColumns: [{label:'Nome', name:'nome'}],
    },
    Specialities: {
      showWidget: false,
      showInSideBar: false,
      label: 'Especialidades',
      icon: 'bars',
      color: 'red',
      tableColumns: [{label:'Nome', name:'nome'}],
    },
    Cards: {
      showWidget: false,
      showInSideBar: false,
      label: 'Cartões',
      icon: 'bars',
      color: 'red',
      tableColumns: [{label:'Nome', name:'nome'}],
    },
    Sales: {
      showWidget: true,
      showInSideBar: false,
      label: 'Vendas',
      icon: 'shopping-cart',
      color: 'red',
      tableColumns: [{label:'Valor', name:'value'}],
    },
    PreLaunch: {
      omitFields: ['criadoEm'],
      showWidget: true,
      showInSideBar: false,
      label: 'Pré Lançamentos',
      icon: 'rocket',
      color: 'red',
      tableColumns: [{label:'Nome', name:'nome'}, {label:'Criado em', name:'criadoEm', template: 'createdAt'}],
    },
    Institutions: {
      // omitFields: ['criadoEm'],
      showWidget: false,
      showInSideBar: false,
      label: 'Instituições',
      icon: 'rocket',
      color: 'red',
      tableColumns: [{label:'Nome', name:'nome'}, {label:'Ativo', name:'isActive', template: 'boolAutoForm'}],
    },
}
};


AdminDashboard.addSidebarItem('Users', AdminDashboard.path('/Meteor.users'), { icon: 'user' });
AdminDashboard.addSidebarItem('Estabelecimentos', AdminDashboard.path('/Restaurants'), { icon: 'cutlery' });
AdminDashboard.addSidebarItem('Vendas', AdminDashboard.path('/Sales'), { icon: 'shopping-cart' });



AdminDashboard.addSidebarItem('Listas', {
  icon: 'list',
  urls: [
      { title: 'Tipos', url: AdminDashboard.path('/RestaurantTypes') },
      { title: 'Especialidades', url: AdminDashboard.path('/Specialities') },
      { title: 'Cartões', url: AdminDashboard.path('/Cards') },
    ]
});

AdminDashboard.addSidebarItem('Instituições', AdminDashboard.path('/Institutions'), { icon: 'university' });
