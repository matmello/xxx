import 'jquery-mask-plugin';

Template.home.helpers({
    instaPosts() {
        return Template.instance().instaPosts.get();
    }
});

Template.home.onRendered(() => {
    const self = Template.instance();

    HTTP.get('https://www.instagram.com/is2eat/?__a=1', {}, (err, res)=> {
        if(!err) {
           self.instaPosts.set(res.data.user.media.nodes.slice(0, 6).map((item)=> {
               item.url = `https://www.instagram.com/p/${item.code}`;
               return item;
           }));
           console.log(self.instaPosts.get());
        }
    });
});

Template.home.onCreated(()=> {
    const self = Template.instance();

    self.instaPosts = new ReactiveVar([]);

    Meteor.Loader.loadCss("/theme_css/animate.min.css");
    Meteor.Loader.loadCss("/theme_css/color.css");
    Meteor.Loader.loadCss("/theme_css/elegant-font-icons.css");
    Meteor.Loader.loadCss("/theme_css/elegant-line-icons.css");
    Meteor.Loader.loadCss("/theme_css/main.css");
    Meteor.Loader.loadCss("/theme_css/owl.carousel.css");
    Meteor.Loader.loadCss("/theme_css/responsive.css");
    Meteor.Loader.loadCss("/theme_css/venobox.css");
});

Template.home.events({
    'click #submitPreLaunch' (e, t) {
        e.preventDefault();

        let preLaunch = {
            nome: $('[name=q1]').val(),
            estabelecimento: $('[name=q2]').val(),
            cargo: $('[name=q3]').val(),
            email: $('[name=q4]').val(),
            telefone: $('[name=q5]').val(),
            desperdicio: $('[name=q6]').val(),
            mensagem: $('[name=mensagem]').val(),
        };

        console.log(preLaunch);

        Meteor.call('registerPreLaunch', preLaunch, (err, res) => {
            if (err) {
                toastr.error('Erro inesperado, Tente novamente.');
            } else {

                $('.formToHide').fadeOut("slow", function() {
                    $('#thanks').addClass('show');
                    // classie.addClass( messageEl, 'show' );
                });
            }
        });
    }
});

maskBehavior = function (val) {
    return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
  },
    options = {onKeyPress: function (val, e, field, options) {
      field.mask(maskBehavior.apply({}, arguments), options);
    },
  };

Template.home.onRendered(() => {
    const self = Template.instance();

    $('body').addClass('loaded');

    $('input[name=q5]').mask(maskBehavior, options);

    // Header

    var header = $("#header"),
    yOffset = 0,
    triggerPoint = 80;
    $(window).on( 'scroll', function() {
        yOffset = $(window).scrollTop();
        if (yOffset >= triggerPoint) {
            $('.logo-small').hide();
            $('.logo-written').show();
            header.addClass("navbar-fixed");
        } else {
            $('.logo-small').show();
            $('.logo-written').hide();
            header.removeClass("navbar-fixed");
        }
    });

    // Scripts

    $.getScript('/vendor/bubble-app.js');

    // wow

    var wow = new WOW( {
        mobile: false,
        offset: 150
    });
    wow.init();

    // Form

    var theForm = document.getElementById( 'theForm' );

                new stepsForm( theForm, {
                    onSubmit : function( form ) {
                        // hide form
                        // classie.addClass( theForm.querySelector( '.simform-inner' ), 'hide' );
                        $('.simform-inner').fadeOut("slow");
                        /*
                        form.submit()
                        or
                        AJAX request (maybe show loading indicator while we don't have an answer..)
                        */
                        let preLaunch = {
                            nome: $('[name=q1]').val(),
                            estabelecimento: $('[name=q2]').val(),
                            cargo: $('[name=q3]').val(),
                            email: $('[name=q4]').val(),
                            telefone: $('[name=q5]').val(),
                        };

                        console.log(preLaunch);

                        Meteor.call('registerPreLaunch', preLaunch, (err, res) => {
                            if (err) {

                            } else {
                                // let's just simulate something...
                                var messageEl = theForm.querySelector( '.final-message' );
                                messageEl.innerHTML = 'Obrigado! Registramos seu interesse e em breve entraremos em contato para apresentarmos a nossa plataforma que será lançada em Fevereiro de 2018.<br><br>Equipe IS2EAT';
                                $('.formToHide').fadeOut("slow", function() {
                                    classie.addClass( messageEl, 'show' );
                                });
                            }
                        });

                    }
                } );
});
