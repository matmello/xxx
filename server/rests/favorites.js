Api.addRoute('favorite/:id', {authRequired: false}, {
    post: {
        action() {
             /**
             * @api {post} /favorite/:id Favorite
             * @apiVersion 0.1.0
             * @apiName Favorite
             * @apiGroup Restaurants
             * @apiDescription Favorite or unfavorite an restaurant
             * @apiPermission logged user
             *
             * @apiParam (url) {String} id Restaurant Id
             */
            let id = this.urlParams.id;

            let userId = this.request.headers['user-id'];
            let authToken = this.request.headers['auth-token'];

            let user = Meteor.users.findOne(userId);


            if(!id||!userId) {
                return {
                   statusCode: 400,
                   body: {status: 'fail', message: 'Parâmetros inválidos'}
                 };
              }

            if(!user) {
              return {
                 statusCode: 400,
                 body: {status: 'fail', message: 'Usuário não existe'}
               };
            }

            if(!Restaurants.findOne(id)) {
            return {
                statusCode: 400,
                body: {status: 'fail', message: 'Restaurante não encontrado'}
                };
            }

            if (user.profile.favorites) {
                if (user.profile.favorites.indexOf(id)>=0) {
                    Meteor.users.update(userId, {
                        $pull: {
                            'profile.favorites': id
                        }
                    });
                    return {
                        status: 'success',
                        message: 'Restaurante desfavoritado com sucesso'
                     }
                } else {
                    Meteor.users.update(userId, {
                        $addToSet: {
                            'profile.favorites': id
                        }
                    });
                    return {
                        status: 'success',
                        message: 'Restaurante favoritado com sucesso'
                     }
                }

            } else {
                Meteor.users.update(userId, {
                    $set: {
                        'profile.favorites': [id]
                    }
                });
                return {
                    status: 'success',
                    message: 'Restaurante favoritado com sucesso'
                 }
            }
        }
    }
});

Api.addRoute('favorites/', {authRequired: false}, {
    get: {
        action() {

            let page = parseInt(this.queryParams.page);
            let perPage = parseInt(this.queryParams.per_page);

            let lat = parseFloat(this.queryParams.lat);
            let lng = parseFloat(this.queryParams.lng);

            let userId = this.request.headers['user-id'];
            let authToken = this.request.headers['auth-token'];

            let user = Meteor.users.findOne(userId);

            if(!Match.test(page, Match.Integer) || !Match.test(perPage, Match.Integer)) {
                return {
                  statusCode: 400,
                  body:       {status: 'fail', message: 'Parâmetros Inválidos, envie os parâmetros de paginação: page e per_page'},
                };
              }

            let favoritesIds = user.profile.favorites ? user.profile.favorites : [];
            console.log(user.profile.favorites);
            console.log(favoritesIds);

            let limit = (page - 1) * perPage;
            let options = {};
            let query = {
                _id: {$in: favoritesIds},
                location: {
                    $near :
                    {
                        $geometry: { type: "Point",  coordinates: [ lng, lat ] },
                        $minDistance: 0,
                        $maxDistance: 500000000000
                    }
                }
            };

            let restaurants;

            if (page == 1) {
                options.limit = page * perPage;
            } else {
                options.limit = perPage;
                options.skip = perPage * (page - 1);
            }

            restaurants = Restaurants.find(query, options);

            return restaurants.map((restaurant)=>{
                if (restaurant.imgId) {
                    restaurant.imagem = Meteor.absoluteUrl('') + Logos.findOne(restaurant.imgId).url().slice(1);
                } else {
                    restaurant.imagem = null;
                }

                if (restaurant.imgCapaId) {
                    restaurant.capa = Meteor.absoluteUrl('') + Capas.findOne(restaurant.imgCapaId).url().slice(1);
                } else {
                    restaurant.capa = null;
                }

                // Open or Closed

                if (restaurant.hours) {
                    var now = moment().day();

                    now = now == 0 ? 6 : now - 1;

                    var restaurantNow = restaurant.hours[now];

                    if (!restaurantNow.isActive) {
                        restaurant.aberto = false;
                    } else {
                        var start = moment().set({
                            hour: restaurantNow.timeFrom.substring(0,2),
                            minute: restaurantNow.timeFrom.substring(3,5)
                        });

                        var end = moment().set({
                            hour: restaurantNow.timeTill.substring(0,2),
                            minute: restaurantNow.timeTill.substring(3,5)
                        });

                        var range = moment().range(start, end)

                        restaurant.aberto = range.contains(moment());
                    }
                }


                // Avaliations

                let avaliations = Avaliations.find({restaurantId: restaurant._id}).fetch();
                let avaliationsAverage = null;

                if (avaliations.length > 0) {
                    avaliationsAverage = avaliations.reduce((previous, actual) => {
                        // console.log(previous);
                        // console.log(actual);
                        return previous.rate + actual.rate}, {rate: 0}) / avaliations.length;
                }

                restaurant.avaliacoes = avaliationsAverage;

                if (user && user.profile.favorites) {
                    restaurant.favorito = user.profile.favorites.indexOf(restaurant._id) >= 0;
                } else {
                    restaurant.favorito = false;
                }

                restaurant.categoria = {
                    nome: RestaurantTypes.findOne(restaurant.categoria).nome,
                    id: restaurant.categoria
                }

                restaurant.especialidade = {
                    nome: Specialities.findOne(restaurant.especialidade).nome,
                    id: restaurant.especialidade
                }

                restaurant.cartoes = restaurant.cartoes.map((card)=> {
                    return {
                        nome: Cards.findOne(card).nome,
                        id: card
                    }
                });

                if (lat && lng) {
                    restaurant.distancia = distanceInKm(restaurant.location[1], restaurant.location[0], lat, lng) * 1000;
                } else {
                    restaurant.distancia = null;
                }

                restaurant.location = {
                    lat: restaurant.location[1],
                    lng: restaurant.location[0]
                }

                return restaurant;
            });
        }
    }
});
