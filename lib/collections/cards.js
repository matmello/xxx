Cards = new Mongo.Collection('cards');

Cards.attachSchema(new SimpleSchema({
  nome: {
    type: String,
    // autoform: {
    //       type: 'hidden',
    //     }
  }
}));
