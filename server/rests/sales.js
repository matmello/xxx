Api.addRoute('sales/', {authRequired: false}, {
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
            let page = parseInt(this.queryParams.page);
            let perPage = parseInt(this.queryParams.per_page);

            let userId = this.request.headers['user-id'];
            let authToken = this.request.headers['auth-token'];

            let user = Meteor.users.findOne(userId);

            if(!Match.test(page, Match.Integer) || !Match.test(perPage, Match.Integer)) {
                return {
                  statusCode: 400,
                  body:       {status: 'fail', message: 'Parâmetros Inválidos, envie os parâmetros de paginação: page e per_page'},
                };
              }

              if (!user) {
                return {
                   statusCode: 400,
                   body: {status: 'fail', message: 'Usuário não existe'}
                 };
              }

            let creditCard = CreditCards.findOne({
                userId: user._id,
                principal: true
            });

            if (!creditCard) {
                return {
                   statusCode: 400,
                   body: {status: 'fail', message: 'Forma de pagamento inválida, forneça um cartão principal'}
                 };
              }

            let limit = (page - 1) * perPage;
            let options = {};
            let query = {userId: user._id};

            let sales;

            if (page == 1) {
                options.limit = page * perPage;
            } else {
                options.limit = perPage;
                options.skip = perPage * (page - 1);
            }

            sales = Sales.find(query, options);

            return sales.fetch().map((item) => {
                item.restaurantId = item.restaurant;

                let restaurant = Restaurants.findOne(item.restaurant);

                let image;

                if (restaurant.imgId) {
                    image = Meteor.absoluteUrl('') + Logos.findOne(restaurant.imgId).url().slice(1);
                } else {
                    image = null;
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

                item.restaurant = {
                    _id: item.restaurant,
                    avaliacoes: avaliationsAverage,
                    imagem: image
                };

                return item;
            });
        }
    },
    post: {
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
            let userId = this.request.headers['user-id'];
            let authToken = this.request.headers['auth-token'];

            let user = Meteor.users.findOne(userId);

            if (!user) {
                return {
                   statusCode: 400,
                   body: {status: 'fail', message: 'Usuário não existe'}
                 };
              }

            let restaurantId = this.bodyParams.restaurant;

            let restaurant = Restaurants.findOne(restaurantId);

            if (!restaurant) {
                return {
                    statusCode: 400,
                    body: {status: 'fail', message: 'Estabelecimento não existe'}
                  };
            }

            let portion = this.bodyParams.portion;

            let portions = Portions.findOne({restaurantId: restaurant._id}).portions;

            let value = false;

            portions.forEach((item) => {
                if (item.qnt == portion) {
                    value = item.price
                }
            });

            if (!value) {
                return {
                    statusCode: 400,
                    body: {status: 'fail', message: 'Porção não encontrada'}
                  };
            }

            let qnt = this.bodyParams.quantity;

            if (!qnt) {
                return {
                    statusCode: 400,
                    body: {status: 'fail', message: 'Quantidade não fornecida'}
                  };
            }

            value = value.replace(/[^0-9]+/g, "") * qnt;

            let saleId = Sales.insert({
                userId: user._id,
                restaurant: restaurant._id,
                value: value,
                quantity: qnt,
                unityPrice: value / qnt,
                portion:  portion,
                status: 'Confirmado'
            });

            let saleObj = Sales.findOne(saleId);

            let image;

                if (restaurant.imgId) {
                    image = Meteor.absoluteUrl('') + Logos.findOne(restaurant.imgId).url().slice(1);
                } else {
                    image = null;
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

                restaurantItem = {
                    _id: restaurant._id,
                    avaliacoes: avaliationsAverage,
                    imagem: image
                };


            return {
                status: 'success',
                message: 'Venda efetuada com sucesso',
                data: {
                    userId: userId,
                    value: value,
                    portion: portion,
                    unityPrice: value / qnt,
                    quantity: qnt,
                    status: 'Confirmado',
                    date: saleObj.date,
                    restaurantId: saleObj.restaurant,
                    restaurant: restaurantItem
                }
             }

        }
    }
});
