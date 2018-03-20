function distanceInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}


Api.addRoute('restaurants/categories', {authRequired: false}, {
    get: {
        action() {
            /**
             * @api {get} /restaurants/categories Get Categories
             * @apiVersion 0.1.0
             * @apiName GetCategories
             * @apiGroup Restaurants
             * @apiDescription Get restaurants categories
             * @apiPermission none
             *
             */
            return RestaurantTypes.find().fetch();
        }
    }
})

Api.addRoute('restaurants/:id', {authRequired: false}, {
    get: {
        action() {
            let restaurant = Restaurants.findOne(this.urlParams.id);

            let lat = this.queryParams.lat;
            let lng = this.queryParams.lng;

            if (!restaurant) {
                restaurant = Restaurants.findOne({id: this.urlParams.id});
            }

            if (!restaurant) {
                return {
                    statusCode: 400,
                    body: {status: 'fail', message: 'Estabelecimento não encontrado'}
                  };
            }

            let userId = this.request.headers['user-id'];
            let authToken = this.request.headers['auth-token'];

            let user = Meteor.users.findOne(userId);

            // console.log(restaurant.imgId);
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
                restaurant.distancia = distanceInKm(restaurant.location[0], restaurant.location[1], lat, lng) * 1000;
            } else {
                restaurant.distancia = null;
            }

            restaurant.location = {
                lat: restaurant.location[1],
                lng: restaurant.location[0]
            }

            let restaurantPortion = Portions.findOne({restaurantId: restaurant._id});

            if (restaurantPortion) {

                let dayOfWeek = new moment().isoWeekday();

                restaurant.today = {
                    day: restaurantPortion.descs[dayOfWeek - 1].dia,
                    description: restaurantPortion.descs[dayOfWeek - 1].desc,
                    portions: restaurantPortion.portions.map((item)=> {
                        return {
                            qnt: parseInt(item.qnt),
                            price: parseFloat(item.price.replace(/\D/g,'')),
                            stock: 5
                        }
                    })
                }
            } else {
                restaurant.today = null;
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

            return restaurant;
        }
    }
});

Api.addRoute('restaurants/', {authRequired: false}, {
    get: {
        action() {

            let page = parseInt(this.queryParams.page);
            let perPage = parseInt(this.queryParams.per_page);

            let lat = parseFloat(this.queryParams.lat);
            let lng = parseFloat(this.queryParams.lng);

            let categories = this.queryParams.categories;

            let userId = this.request.headers['user-id'];
            let authToken = this.request.headers['auth-token'];

            let user = Meteor.users.findOne(userId);

            if(!Match.test(page, Match.Integer) || !Match.test(perPage, Match.Integer)) {
                return {
                  statusCode: 400,
                  body:       {status: 'fail', message: 'Parâmetros Inválidos, envie os parâmetros de paginação: page e per_page'},
                };
              }

            let limit = (page - 1) * perPage;
            let options = {};
            let query = {location: {
                $near :
                {
                  $geometry: { type: "Point",  coordinates: [ lng, lat ] },
                  $minDistance: 0,
                  $maxDistance: 500000000000
                }
            }};

            if (categories) {
                query.categoria = {$in: categories.split(',')};
            }

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

                // Today

                let restaurantPortion = Portions.findOne({restaurantId: restaurant._id});

                if (restaurantPortion) {

                    let dayOfWeek = new moment().isoWeekday();

                    restaurant.today = {
                        day: restaurantPortion.descs[dayOfWeek - 1].dia,
                        description: restaurantPortion.descs[dayOfWeek - 1].desc,
                        portions: restaurantPortion.portions.map((item)=> {
                            return {
                                qnt: parseInt(item.qnt),
                                price: parseFloat(item.price.replace(/\D/g,'')),
                                stock: 5
                            }
                        })
                    }
                } else {
                    restaurant.today = null;
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
