Institutions = new Mongo.Collection('institutions');

Institutions.attachSchema(new SimpleSchema({
  nome: {
    type: String,
    // autoform: {
    //       type: 'hidden',
    //     }
  },
  texto: {
    type: String,
    autoform: {
      type: 'textarea',
    }
  },
  link: {
    type: String,
    // autoform: {
    //       type: 'hidden',
    //     }
  },
  isActive: {
    label: 'Ativo',
    type: Boolean,
    defaultValue: true,
    autoform: {
      type: 'boolean-select',
      trueLabel: 'Visível',
      falseLabel: 'Não Visível',
      // nullLabel: '',
    }
  },
}));
