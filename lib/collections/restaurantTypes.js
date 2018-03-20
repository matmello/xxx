RestaurantTypes = new Mongo.Collection('restaurantTypes');

RestaurantTypes.attachSchema(new SimpleSchema({
  nome: {
    type: String,
    // autoform: {
    //       type: 'hidden',
    //     }
  }
}));
