Specialities = new Mongo.Collection('specialities');

Specialities.attachSchema(new SimpleSchema({
  nome: {
    type: String,
    // autoform: {
    //       type: 'hidden',
    //     }
  }
}));
