PreLaunch = new Mongo.Collection('preLaunch');

PreLaunch.attachSchema(new SimpleSchema({
  nome: {
    type: String,
    optional: true,
    // autoform: {
    //       type: 'hidden',
    //     }
  },
  estabelecimento: {
    type: String,
    optional: true,
    // autoform: {
    //       type: 'hidden',
    //     }
  },
  cargo: {
    type: String,
    optional: true,
    // autoform: {
    //       type: 'hidden',
    //     }
  },
  email: {
    type: String,
    optional: true,
    // autoform: {
    //       type: 'hidden',
    //     }
  },
  telefone: {
    type: String,
    optional: true,
    // autoform: {
    //       type: 'hidden',
    //     }
  },
  desperdicio: {
    type: String,
    optional: true,
    // autoform: {
    //       type: 'hidden',
    //     }
  },
  mensagem: {
    type: String,
    optional: true,
    autoform: {
          type: 'textarea',
        }
  },
  criadoEm: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      }
    },
    autoform: {
          // type: 'hidden',
        }
  },
}));
