Sales = new Mongo.Collection('sales');

Sales.attachSchema(new SimpleSchema({
    userId: {
        type: String,
        label: 'Usuário',
        autoform: {
          options: function(){
            return _.map(Meteor.users.find().fetch(), function(user){
              return {
                label: user.profile.name,
                value: user._id,
              };
            });
          }
        }
      },
      restaurant: {
        type: String,
        label: 'Estabelecimento',
        autoform: {
          options: function(){
            return _.map(Restaurants.find().fetch(), function(restaurant){
              return {
                label: restaurant.nome,
                value: restaurant._id,
              };
            });
          }
        }
      },
      value: {
          type: Number,
          label: 'Valor'
      },
      quantity: {
          type: Number,
          label: 'Quantidade'
      },
      unityPrice: {
        type: Number,
        label: 'Valor unitário'
      },
      portion: {
        type: Number,
        label: 'Porção'
      },
        date: {
        optional: true,
        type: Date,
        autoValue: function() {
            if (this.isInsert||this.isUpsert) {
              return new Date();
            } else {
                return this.unset(); 
            }
          },
        },
        status: {
            type: 'String',
            autoform: {
                options: function(){
                    return [{
                      label: 'Confirmado',
                      value: 'Confirmado'
                    }, {
                      label: 'Recusado',
                      value: 'Recusado'
                    }, {
                      label: 'Cancelado',
                      value: 'Cancelado'
                    },
                    {
                      label: 'Aguardando',
                      value: 'Aguardando'
                    }];
                  }
              }
        },
  }));

    new Tabular.Table({
    name: "DashboardSales",
    collection: Sales,
    order: [[ 1, "desc" ]],
    columns: [
      {data: "_id", title: "ID",
        render(val, type, doc) {
          return val.substring(0,6).toUpperCase();
        }
      },
      {data: "date", title: "Data",
        render(val, type, doc) {
          return moment(val).format('DD/MM/YYYY');
        }
      },
      {data: "value", title: "Valor",
        render(val, type, doc) {
          return 'R$'+ (val/100).toFixed(2).replace('.',',');
        }
      },
      {data: "status", title: "Status"},
      // {data: "copies", title: "Copies Available"},
      // {
      //   data: "lastCheckedOut",
      //   title: "Last Checkout",
      //   render: function (val, type, doc) {
      //     if (val instanceof Date) {
      //       return moment(val).calendar();
      //     } else {
      //       return "Never";
      //     }
      //   }
      // },
      // {data: "summary", title: "Summary"},
      {
        tmpl: Meteor.isClient && Template.checkSale
      }
    ]
  });
