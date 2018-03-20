Api.addRoute('register', {authRequired: false}, {
    post: {
        /**
         * @api {post} /register Register
         * @apiVersion 0.1.0
         * @apiName Register
         * @apiGroup User
         * @apiPermission none
         *
         * @apiParam (body) {String} name
         * @apiParam (body) {String} cpf
         * @apiParam (body) {String} email
         * @apiParam (body) {String} telephone
         * @apiParam (body) {String} password
         * @apiParam (body) {String} fbid
         */
      action() {
        let name = this.bodyParams.name;
        let cpf = this.bodyParams.cpf;
        let email = this.bodyParams.email;
        let telephone = this.bodyParams.telephone
        let password = this.bodyParams.password;
        let fbid = this.bodyParams.fbid;

        let user = Meteor.users.findOne({
           username: cpf
         });

         let userByEmail = Accounts.findUserByEmail(email);

         let userByFacebook = Meteor.users.findOne({
          'profile.fbid': fbid
          });

         if (!name || !password || !email || !cpf) {
           return {
              statusCode: 400,
              body: {status: 'fail', message: 'Parâmetros inválidos'}
            };
         }

         if (user) {
           return {
              statusCode: 400,
              body: {status: 'fail', message: 'CPF já cadastrado'}
            };
         }

         if (userByEmail) {
           return {
              statusCode: 400,
              body: {status: 'fail', message: 'Email já cadastrado'}
            };
         }

          if (fbid && userByFacebook) {
            return {
                statusCode: 400,
                body: {status: 'fail', message: 'Facebook já cadastrado, por favor faça o login'}
              };
          }

         let userId = Accounts.createUser({
           username: cpf,
           password: password,
           email: email,
           profile: {
             type: 'PF',
             telephone: telephone,
             name: name,
             fbid: fbid || null
           }
         });

         let stampedLoginToken = Accounts._generateStampedLoginToken();
         Accounts._insertLoginToken(userId, stampedLoginToken);

         return {
             status: 'success',
             data: {
                type: 'PF',
                id: userId,
                token: stampedLoginToken.token,
                cpf: cpf,
                email: email,
                telephone: telephone,
                name: name,
             }
          };
      }
    }
  });

  Api.addRoute('user/edit', {authRequired: false}, {
    post: {
        /**
         * @api {post} /user/image Upload Profile Image
         * @apiVersion 0.1.0
         * @apiName UploadProfileImage
         * @apiGroup User
         * @apiPermission logged user
         *
         * @apiParam (body) {String} name
         * @apiParam (body) {String} cpf
         * @apiParam (body) {String} email
         * @apiParam (body) {String} telephone
         * @apiParam (body) {String} password
         * @apiParam (body) {String} fbid
         */
      action() {

        let userId = this.request.headers['user-id'];
        let authToken = this.request.headers['auth-token'];

        let user = Meteor.users.findOne(userId);

        if (!user) {
          return {
            statusCode: 400,
            body: {status: 'fail', message: 'Usuário não existe'}
          };
        }

        let set = {profile: {}};

        if (this.bodyParams.name) {
          set.profile.name = this.bodyParams.name;
        }

        if (this.bodyParams.telephone) {
          set.profile.telephone = this.bodyParams.telephone;
        }

        if (this.bodyParams.name || this.bodyParams.telephone) {
          Meteor.users.update({_id: userId}, {
            $set: set
          });
        }

        if (this.bodyParams.cpf) {
          try {
            Accounts.setUsername(userId, this.bodyParams.cpf)
          } catch (e) {
            return {
              statusCode: 400,
              body: {status: 'fail', message: 'CPF já cadastrado'}
            };
          }
        }

        if (this.bodyParams.newPassword) {

          try {
            if (!this.bodyParams.oldPassword) {
              return {
                statusCode: 400,
                body: {status: 'fail', message: 'Forneça a senha antiga'}
              };
            }

            if (ApiPassword.validate({email: user.emails[0].address, password: this.bodyParams.oldPassword})) {
              Accounts.setPassword(userId, this.bodyParams.newPassword);
          } else {
            return {
              statusCode: 400,
              body: {status: 'fail', message: 'Senha antiga não confere'}
            };
          }
          } catch(e) {
            return {
              statusCode: 400,
              body: {status: 'fail', message: 'Erro ao alterar senha'}
            };
          }


        }

        if (this.bodyParams.email) {
          try {
            let userByEmail = Accounts.findUserByEmail(this.bodyParams.email);

            if (userByEmail) {
              return {
                statusCode: 400,
                body: {status: 'fail', message: 'Email já cadastrado'}
              };
            }

            Accounts.removeEmail(userId, user.emails[0].address)
            Accounts.addEmail(userId, this.bodyParams.email);

          } catch(e) {
            return {
              statusCode: 400,
              body: {status: 'fail', message: 'Email inválido'}
            };
          }
        }


        return {
          status: 'success',
          message: 'Dados alterados com sucesso',
       };


      }
    }
  });

  Api.addRoute('user/image', {authRequired: false}, {
    post: {
        /**
         * @api {post} /user/image Upload Profile Image
         * @apiVersion 0.1.0
         * @apiName UploadProfileImage
         * @apiGroup User
         * @apiPermission logged user
         *
         * @apiParam (body) {Stringbase64} image
         */
      action() {
        let image = 'data:image/png;base64,'+this.bodyParams.image;
        let userId = this.request.headers['user-id'];
        let authToken = this.request.headers['auth-token'];

        let user = Meteor.users.findOne(userId);

        if (!user) {
          return {
            statusCode: 400,
            body: {status: 'fail', message: 'Usuário não existe'}
          };
        }

        if(!this.bodyParams.image) {
          return {
             statusCode: 400,
             body: {status: 'fail', message: 'Parâmetros inválidos'}
           };
        }

        let insercao = Images.insert(image);
        let imagem = Images.findOne(insercao._id);

        let imgUrl = Meteor.absoluteUrl()+imagem.url({brokenIsFine: true}).slice(1);

        Meteor.users.update(userId,
        {$set: {
              'profile.image': imgUrl,
            }}
        );

        return {
          status: 'success',
          message: 'Imagem alterada com sucesso',
          data: {
            type: user.profile.type,
            id: user._id,
            telephone: user.profile.telephone,
            name: user.profile.name,
            email: user.emails[0].address,
            cpf: user.username,
            image: imgUrl,
          }
       };


      }
    }
  });

  Api.addRoute('user/token', {authRequired: false}, {
    post: {
        /**
         * @api {post} /user/image Upload Profile Image
         * @apiVersion 0.1.0
         * @apiName UploadProfileImage
         * @apiGroup User
         * @apiPermission logged user
         *
         * @apiParam (body) {Stringbase64} image
         */
      action() {
        let type = this.bodyParams.type;
        let token = this.bodyParams.token;

        let userId = this.request.headers['user-id'];
        let authToken = this.request.headers['auth-token'];

        let user = Meteor.users.findOne(userId);

        if (!user) {
          return {
            statusCode: 400,
            body: {status: 'fail', message: 'Usuário não existe'}
          };
        }

        if(!token || !type || (type !== 'android' && type !== 'ios')) {
          return {
             statusCode: 400,
             body: {status: 'fail', message: 'Parâmetros inválidos'}
           };
        }

        if (type =='android') {
          Meteor.users.update(userId, {$set: {
            'profile.token.android' : token,
          }});
        } else if (type == 'ios') {
          Meteor.users.update(userId, {$set: {
            'profile.token.ios' : token,
          }});
        }

        return {
          status: 'success',
          message: 'Token gravado com sucesso',
       };


      }
    }
  });

  Api.addRoute('user/:id', {authRequired: false}, {
    get: {
      action() {
        /**
         * @api {get} /user/:id User Profile
         * @apiVersion 0.1.0
         * @apiName Userprofile
         * @apiGroup User
         * @apiPermission none
         *
         * @apiParam (url) {String} id
         */
        let user = Meteor.users.findOne(this.urlParams.id);

        if (!user) {
          return {
            statusCode: 400,
            body: {status: 'fail', message: 'Usuário não existe'}
          };
        }

        return {
          status: 'success',
          data: {
            type: user.profile.type,
            id: user._id,
            telephone: user.profile.telephone,
            name: user.profile.name,
            email: user.emails[0].address,
            cpf: user.username,
            image: user.profile.image ? user.profile.image : null,
          }
       };

      }
    }
  });

  Api.addRoute('login', {authRequired: false}, {
    post: {
        /**
         * @api {post} /login Login
         * @apiVersion 0.1.0
         * @apiName Login
         * @apiGroup User
         * @apiPermission none
         *
         * @apiParam (body) {String} email
         * @apiParam (body) {String} password
         * @apiParam (body) {String} fbid
         */
      action() {
        let email = this.bodyParams.email;
        let password = this.bodyParams.password;
        let fbid = this.bodyParams.fbid;

        if (fbid) {
          let userByFacebook = Meteor.users.findOne({
            'profile.fbid': fbid
          });

          let userByEmail = Accounts.findUserByEmail(email);

          if (!userByFacebook && !userByEmail) {
            return {
              statusCode: 400,
              body: {status: 'fail', message: 'Usuário não existe, faça o cadastro primeiro'}
            };
          }

          if (!userByFacebook) {
            userByFacebook = userByEmail;
          }

          let stampedLoginToken = Accounts._generateStampedLoginToken();
          Accounts._insertLoginToken(userByFacebook._id, stampedLoginToken);
          return {
              status: 'success',
              data: {
                type: userByFacebook.profile.type,
                id: userByFacebook._id,
                token: stampedLoginToken.token,
                telephone: userByFacebook.profile.telephone,
                name: userByFacebook.profile.name,
                email: userByFacebook.emails[0].address,
                cpf: userByFacebook.username,
                image: userByFacebook.profile.image ? userByFacebook.profile.image : null,
              }
           };

        }

        let user = Accounts.findUserByEmail(email);

        if(!user) {
          return {
             statusCode: 400,
             body: {status: 'fail', message: 'Usuário não existe'}
           };
        } else {
                if (ApiPassword.validate({email: email, password: password})) {

                  let stampedLoginToken = Accounts._generateStampedLoginToken();
                  Accounts._insertLoginToken(user._id, stampedLoginToken);
                  return {
                      status: 'success',
                      data: {
                        type: user.profile.type,
                        id: user._id,
                        token: stampedLoginToken.token,
                        telephone: user.profile.telephone,
                        name: user.profile.name,
                        email: user.emails[0].address,
                        cpf: user.username,
                        image: user.profile.image ? user.profile.image : null,
                      }
                   };
                } else {
                  return {
                      statusCode: 400,
                      body: {status: 'fail', message: 'Email ou senha inválidos'}
                    };
                }
        }

      }
    }
  });

  Api.addRoute('forgotpassword', {authRequired: false}, {
    post: {
      action() {
             /**
             * @api {post} /forgotpassword Forgot Password
             * @apiVersion 0.1.0
             * @apiName Forgot Password
             * @apiGroup User
             * @apiPermission none
             *
             * @apiParam (body) {String} email
             */
        // let telefone = this.bodyParams.phone;
        let email = this.bodyParams.email;

        // let user = Meteor.users.findOne({username: telefone});
        let user = Accounts.findUserByEmail(email);

        if (!user) {
          return {
             statusCode: 400,
             body: {status: 'fail', message: 'Usuário não existe'}
           };
        }

        Meteor.defer(()=>{
          Accounts.sendResetPasswordEmail(user._id, email, function(error, result){
            if (error) {
              console.log(error);
            } else {
            }
            });
        });

        // let newPassword = Math.floor(100000 + Math.random() * 900000);
        // let newPassword = Random.id(6);

        // Accounts.setPassword(user._id, newPassword);

        // Meteor.defer(()=>{
        //     Email.send({
        //       to: user.emails[0].address,
        //       from: 'YoCoach',
        //       subject: 'Solicitação de Mudança de Senha',
        //       html: `Olá ${user.profile.name}<br><br>Foi solicitada a recuperação de sua senha em YoCoach<br> Você pode acessar usando os seguintes dados:<br><br>Telefone: ${user.username}<br>Senha: ${newPassword}<br><br>Obrigado.`,
        //     });
        //   });

        return {
            status: 'success',
            message: 'Código de recuperação enviado com sucesso'
         }
      }
    }
  });
