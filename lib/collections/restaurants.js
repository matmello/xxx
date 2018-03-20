Restaurants = new Mongo.Collection('restaurants');

if(Meteor.isServer) {
  Restaurants._ensureIndex({'location': '2dsphere'});
  // Restaurants.rawCollection().createIndex({ location : "2dsphere" });
}

Hours = new SimpleSchema({
  isActive: {
    type: Boolean
  },
  timeFrom: {
    optional: true,
    type: String,
  },
  timeTill: {
    optional: true,
    type: String,
  }
});

Restaurants.attachSchema(new SimpleSchema({
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
  status: {
    // optional: true,
    type: Boolean,
    defaultValue: true,
    autoform: {
      type: 'boolean-select',
      trueLabel: 'Ativo',
      falseLabel: 'Bloqueado',
      // nullLabel: '',
    }
  },
  nome: {
    type: String,
    label: "Nome Fantasia",
    // autoform: {
    //       type: 'hidden',
    //     }
  },
  id: {
    type: String,
    label: 'CNPJ'
  },
  nomeFantasia: {
    type: String,
    label: 'Razão Social'
  },
  descricao: {
    optional: true,
    type: String,
    label: 'Descrição',
    autoform: {
          type: 'textarea',
        }
  },
  categoria: {
    type: String,
    label: 'Categoria',
    autoform: {
      options: function(){
        return _.map(RestaurantTypes.find().fetch(), function(categoria){
          return {
            label: categoria.nome,
            value: categoria._id,
          };
        });
      }
    }
  },
  especialidade: {
    type: String,
    label: 'Especialidade',
    autoform: {
      options: function(){
        return _.map(Specialities.find().fetch(), function(categoria){
          return {
            label: categoria.nome,
            value: categoria._id,
          };
        });
      }
    }
  },
    // 'schedule': {
    //   type: String,
    //   autoform: {
    //     type: "bootstrap-daysofweek",
    //   }
    // },
    cep: {
        type: String,
        label: 'CEP'
    },
    endereco: {
        type: String,
        label: 'Endereço'
    },
    bairro: {
        type: String,
        label: 'Bairro'
    },
    estado: {
        type: String,
        autoform: {
          options: [{
            label: 'Acre',
            value: 'ac',
          },
          {
            label: 'Alagoas',
            value: 'al',
          },{
            label: 'Amazonas',
            value: 'am',
          },{
            label: 'Amapá',
            value: 'ap',
          },{
            label: 'Bahia',
            value: 'ba',
          },{
            label: 'Ceará',
            value: 'ce',
          },{
            label: 'Distrito Federal',
            value: 'df',
          },{
            label: 'Espírito Santo',
            value: 'es',
          },{
            label: 'Goiás',
            value: 'go',
          },{
            label: 'Maranhão',
            value: 'ma',
          },{
            label: 'Mato Grosso',
            value: 'mt',
          },{
            label: 'Mato Grosso do Sul',
            value: 'ms',
          },{
            label: 'Minas Gerais',
            value: 'mg',
          },{
            label: 'Pará',
            value: 'pa',
          },{
            label: 'Paraíba',
            value: 'pb',
          },{
            label: 'Paraná',
            value: 'pr',
          },{
            label: 'Pernambuco',
            value: 'pe',
          },{
            label: 'Piauí',
            value: 'pi',
          },{
            label: 'Rio de Janeiro',
            value: 'rj',
          },{
            label: 'Rio Grande do Norte',
            value: 'rn',
          },{
            label: 'Rondônia',
            value: 'ro',
          },{
            label: 'Rio Grande do Sul',
            value: 'rs',
          },{
            label: 'Roraima',
            value: 'rr',
          },{
            label: 'Santa Catarina',
            value: 'sc',
          },{
            label: 'Sergipe',
            value: 'se',
          },{
            label: 'São Paulo',
            value: 'sp',
          },{
            label: 'Tocantins',
            value: 'to',
          },
          ]
        }
      },
      cidade: {
        label: 'Cidade',
        type: String,
        autoform: {
        },
      },
      telefone: {
        label: 'Telefone',
        type: String,
        autoform: {
        },
      },
      facebook: {
        optional: true,
        label: 'Facebook',
        type: String,
        autoform: {
        },
      },
      instagram: {
        optional: true,
        label: 'Instagram',
        type: String,
        autoform: {
        },
      },
      imgId: {
        optional: true,
        type: String,
        label: "Logo",
        autoform: {
          afFieldInput: {
            type: 'fileUpload',
            collection: 'Logos',
            label: 'Escolha a Imagem',
          }
        }
      },
      imgCapaId: {
        optional: true,
        type: String,
        label: "Capa",
        autoform: {
          afFieldInput: {
            type: 'fileUpload',
            collection: 'Capas',
            label: 'Escolha a Imagem',
          }
        }
      },
    //   imagem: {
    //     type: String,
    //     autoValue: function() {
    //         var image = Logos.findOne(this.field('imgId').value);
    //         return image.url().slice(1);
    //     },
    //     autoform: {
    //           type: 'hidden',
    //         }
    //   },
      cartoes: {
        type: [String],
        label: 'Cartões Aceitos',
        autoform: {
          type: "selectize",
          multiple: true,
          options: function() {
            return _.map(Cards.find().fetch(), function(categoria){
                return {
                  label: categoria.nome,
                  value: categoria._id,
                };
              });
          },
          selectizeOptions: {
           hideSelected: true,
           plugins: {
             "remove_button": {}
           }
         }
        }
      },
      hours: {
        label: 'Horário de Funcionamento',
        type: [Hours],
        autoform: {
          type: "businessHours"
        },
      },
      // 'hours.$.isActive': {
      //   type: Boolean
      // },
      // 'hours.$.timeFrom': {
      //   type: String
      // },
      // 'hours.$.timeTill': {
      //   type: String
      // },
        //  sabado: {
        //   label: "Sábado",
        //   type: String,
        //   autoform: {
        //    type: 'masked-input',
        //    mask: 'H0:M0 às H0:M0',
        //    maskOptions: {
        //        placeholder: 'Horário de Funcionamento',
        //        translation: {
        //          'H': {
        //              pattern: /[0-2]/
        //          },
        //          'M': {
        //              pattern: /[0-5]/
        //          },
        //          'S': {
        //              pattern: /[0-5]/
        //          }
        //      }
        //    }
        //  }
        //  },
      reembolso: {
        label: "Porcentagem de reembolso",
        type: Number,
        max: 100,
        min: 90,
        autoform: {
          type: "noUiSlider",
          step: 1,
          noUiSliderOptions: {
            // start: 90,
            slide: function(event, ui) {
              console.log('qweeqw');
            },
            range: {
              'min': 0,
              'max': 100
            },
            tooltips: true,
            connect: 'lower',
          },
          noUiSlider_pipsOptions: {
            // mode: 'steps',
            density: 5
          }
        }
      },
      location:{
        type: [Number],
        decimal: true,
        autoform: {
          type: 'map',
          afFieldInput: {
            geolocation: false,
            searchBox: true,
            autolocate: true,
            defaultLat: -15.7941,
            defaultLng: -47.8825,
            zoom: 9,
          },
        },
      },
      // 'location.lat': {
      //   type: String,
      //   optional: true,
      // },
      // 'location.lng': {
      //   type: String,
      //   optional: true,
      // },

}));
