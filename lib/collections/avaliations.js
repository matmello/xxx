Avaliations = new Mongo.Collection('avaliations');

Avaliations.attachSchema(new SimpleSchema({
    userId: {
      type: String,
    },
    restaurantId: {
        type: String,
    },
    rate: {
        type: Number,
    },
    message: {
      optional: true,
      type: String,
    },
    criadoEm: {
        type: Date,
        autoValue: function() {
          if (this.isInsert||this.isUpsert) {
            return new Date();
          }
        },
        autoform: {
              // type: 'hidden',
            }
      },
  }));
