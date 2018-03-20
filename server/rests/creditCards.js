function getCreditCardLabel(cardNumber){

    // Visa: ^4[0-9]{12}(?:[0-9]{3})?$ All Visa card numbers start with a 4. New cards have 16 digits. Old cards have 13.
    // MasterCard: ^5[1-5][0-9]{14}$ All MasterCard numbers start with the numbers 51 through 55. All have 16 digits.
    // American Express: ^3[47][0-9]{13}$ American Express card numbers start with 34 or 37 and have 15 digits.
    // Diners Club: ^3(?:0[0-5]|[68][0-9])[0-9]{11}$ Diners Club card numbers begin with 300 through 305, 36 or 38. All have 14 digits. There are Diners Club cards that begin with 5 and have 16 digits. These are a joint venture between Diners Club and MasterCard, and should be processed like a MasterCard.
    // Discover: ^6(?:011|5[0-9]{2})[0-9]{12}$ Discover card numbers begin with 6011 or 65. All have 16 digits.
    // JCB: ^(?:2131|1800|35\d{3})\d{11}$ JCB cards beginning with 2131 or 1800 have 15 digits. JCB cards beginning with 35 have 16 digits.
    // http://www.regular-expressions.info/creditcard.html

    var regexVisa = /^4[0-9]{12}(?:[0-9]{3})?/;
    var regexMaster = /^5[1-5][0-9]{14}/;
    var regexAmex = /^3[47][0-9]{13}/;
    var regexDiners = /^3(?:0[0-5]|[68][0-9])[0-9]{11}/;
    var regexDiscover = /^6(?:011|5[0-9]{2})[0-9]{12}/;
    var regexJCB = /^(?:2131|1800|35\d{3})\d{11}/;

    if(regexVisa.test(cardNumber)){
     return 'visa';
    }
    if(regexMaster.test(cardNumber)){
     return 'master';
    }
    if(regexAmex.test(cardNumber)){
     return 'amex';
    }
    if(regexDiners.test(cardNumber)){
     return 'diners';
    }
    if(regexDiscover.test(cardNumber)){
     return 'discover';
    }
    if(regexJCB.test(cardNumber)){
     return 'jcb';
    }

    return '';

}

Api.addRoute('card/', {authRequired: false}, {
    post: {
        action() {
             /**
             * @api {post} /card Save Card
             * @apiVersion 0.1.0
             * @apiName card
             * @apiGroup User
             * @apiDescription Save a credit card
             * @apiPermission logged user
             *
             * @apiParam (body) {String} cardNumber
             * @apiParam (body) {String} holder
             * @apiParam (body) {String} expirationDate format: MM/YYYY
             */


            let userId = this.request.headers['user-id'];
            let authToken = this.request.headers['auth-token'];

            let user = Meteor.users.findOne(userId);

            let card = {
                userId: userId,
                principal: false,
                scielo: {
                    CustomerName: user.profile.name,
                    CardNumber: this.bodyParams.cardNumber,
                    Holder: this.bodyParams.holder,
                    ExpirationDate: this.bodyParams.expirationDate,
                    Cvv: this.bodyParams.cvv
                }
            }

            console.log('###########');
            console.log(userId);
            console.log(card);
            console.log('###########');

            if(!userId||!card.scielo.CustomerName||!card.scielo.CardNumber||!card.scielo.Holder||!card.scielo.ExpirationDate ) {
                return {
                   statusCode: 400,
                   body: {status: 'fail', message: 'Parâmetros inválidos'}
                 };
              }

            if (!card.scielo.Cvv) {
                return {
                    statusCode: 400,
                    body: {status: 'fail', message: 'Parâmetros inválidos (forneça o Cvv)'}
                  };
            }

            if(!user) {
              return {
                 statusCode: 400,
                 body: {status: 'fail', message: 'Usuário não existe'}
               };
            }

            CreditCards.insert(card);

            return {
                status: 'success',
                message: 'Cartão salvo com sucesso'
             }

        }
    },
    get: {
        action() {
               /**
             * @api {get} /card Get Cards
             * @apiVersion 0.1.0
             * @apiName getCards
             * @apiGroup User
             * @apiDescription Get credit cards
             * @apiPermission logged user
             *
             * @apiParam (query) {int} page
             * @apiParam (query) {int} per_page
             */

            let page = parseInt(this.queryParams.page);
            let perPage = parseInt(this.queryParams.per_page);

            let userId = this.request.headers['user-id'];
            let authToken = this.request.headers['auth-token'];

            let user = Meteor.users.findOne(userId);

            if(!user) {
                return {
                   statusCode: 400,
                   body: {status: 'fail', message: 'Usuário não existe'}
                 };
              }

              if(!Match.test(page, Match.Integer) || !Match.test(perPage, Match.Integer)) {
                return {
                  statusCode: 400,
                  body:       {status: 'fail', message: 'Parâmetros Inválidos, envie os parâmetros de paginação: page e per_page'},
                };
              }

              let limit = (page - 1) * perPage;
              let options = {};
              let query = {userId: user._id};

              let cards;

                if (page == 1) {
                    options.limit = page * perPage;
                } else {
                    options.limit = perPage;
                    options.skip = perPage * (page - 1);
                }

                cards = CreditCards.find(query, options).fetch();

                let card = {
                    userId: userId,
                    scielo: {
                        CustomerName: this.bodyParams.customerName,
                        CardNumber: this.bodyParams.cardNumber,
                        Holder: this.bodyParams.holder,
                        ExpirationDate: this.bodyParams.expirationDate,
                    }
                }

                return cards.map((card)=> {
                    console.log("card: ", card);
                    return {
                        principal: card.principal,
                        _id: card._id,
                        lastFour: card.scielo.CardNumber.toString().substring(card.scielo.CardNumber.length -4),
                        flag: getCreditCardLabel(card.scielo.CardNumber.toString()),
                    }
                });

        }
    }
});

Api.addRoute('card/principal', {authRequired: false}, {
    get: {
        action() {
            /**
             * @api {get} /maincard Main Card
             * @apiVersion 0.1.0
             * @apiName Get main card
             * @apiGroup User
             * @apiDescription Get main card
             * @apiPermission logged user
             *
             */

            let userId = this.request.headers['user-id'];
            let authToken = this.request.headers['auth-token'];


            let user = Meteor.users.findOne(userId);

            if(!user) {
                return {
                   statusCode: 400,
                   body: {status: 'fail', message: 'Usuário não existe'}
                 };
              }

            let card = CreditCards.findOne({userId: user._id, principal: true});

            if(!card) {
                return {
                    status: 'success',
                    card: {}
                 }
            } else {
                return {
                    status: 'success',
                    card: {
                        principal: card.principal,
                        _id: card._id,
                        lastFour: card.scielo.CardNumber.toString().substring(card.scielo.CardNumber.length -4),
                        flag: getCreditCardLabel(card.scielo.CardNumber.toString()),
                    }
                 }
            }

        }
    }
});

Api.addRoute('card/:id', {authRequired: false}, {
    post: {
        action() {
            /**
             * @api {post} /card/main Choose Card
             * @apiVersion 0.1.0
             * @apiName ChooseCard
             * @apiGroup User
             * @apiDescription Choose a main card
             * @apiPermission logged user
             *
             * @apiParam (url) {int} id
             */

            let userId = this.request.headers['user-id'];
            let authToken = this.request.headers['auth-token'];

            let cardId = this.urlParams.id;

            let user = Meteor.users.findOne(userId);

            if(!user) {
                return {
                   statusCode: 400,
                   body: {status: 'fail', message: 'Usuário não existe'}
                 };
              }

            let card = CreditCards.findOne(cardId);

            if(!card) {
                return {
                   statusCode: 400,
                   body: {status: 'fail', message: 'Cartão inválido'}
                 };
              }

            CreditCards.update({userId: user._id}, {
                $set: {
                    principal: false
                }
            });

            CreditCards.update({_id: cardId}, {
                $set: {
                    principal: true
                }
            });

            return {
                status: 'success',
                message: 'Cartão escolhido com sucesso'
             }

        }
    }
});
