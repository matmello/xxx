Template.registerRestaurant.helpers({
    categorias() {
        return RestaurantTypes.find();
    },
    especialidades() {
        return Specialities.find();
    },
    cartoes() {
        return Cards.find();
    },
    restaurantNome() {
        return Template.instance().restaurant.get().nome;
    },
    categoriaNome() {
        let catId = Template.instance().restaurant.get().especialidade;
        if (catId) {
            return Specialities.findOne(catId).nome;
        } else {
            return '';
        }
    }
});

Template.registerRestaurant.events({
    'click .logo-btn'(e, t) {
        e.preventDefault();
        $('#logo-img').click();
    },
    'click .capa-btn'(e, t) {
        e.preventDefault();
        $('#capa-img').click();
    },
    'change #logo-img'(e, t) {
        e.preventDefault();
        var file = e.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function(fileLoadEvent) {
        //    Meteor.call('file-upload', file, reader.result);
        let base64 = reader.result;
        t.logo = base64;
        // document.getElementById('capa-img-src').setAttribute('src', base64);
        // $('.cel-wrap').imagedrag();
        $('.crop-logo').attr('src', base64);

        };
        reader.readAsDataURL(file);
    },
    'change #capa-img'(e, t) {
        e.preventDefault();
        var file = e.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function(fileLoadEvent) {
        //    Meteor.call('file-upload', file, reader.result);
        let base64 = reader.result;
        t.capa = base64;
        // document.getElementById('capa-img-src').setAttribute('src', base64);
        // $('.cel-wrap').imagedrag();
        $('.crop').css('cursor', 'move');
        $('.crop').attr('src', base64);
        $('.crop').jWindowCrop({
            targetWidth: 350, //Width of facebook cover division
            targetHeight: 120, //Height of cover division
            loadingText: 'Carregando capa....',
            zoomSteps: 10,
            smartControls: false,
            showControlsOnStart: false,
            onChange: function(result) {
                t.crop = {
                    cropX: result.cropX,
                    cropY: result.cropY,
                    cropW: result.cropW,
                    cropH: result.cropH
                }
                // console.log("separation from left- "+result.cropX);
                // console.log("separation from top- "+result.cropY);
                // console.log("width- "+result.cropW);
                // console.log("Height- "+result.cropH);
            }
        });

        };
        reader.readAsDataURL(file);

        if (t.firstTime) {
            t.firstTime = false;

            // $('.tooltip-img').show();
            $( ".tooltip-img" ).fadeIn( "slow", function() {
                // Animation complete
                Meteor.setTimeout(()=> {
                    $('.tooltip-img').fadeOut("slow");
                }, 4000);
              });
            // $('[data-toggle="tooltip"]').tooltip();
            // $('[data-toggle="tooltip"]').tooltip('option', 'show');
            // Tooltips.show();

        }
    }
});

Template.registerRestaurant.onRendered(()=> {
    const self = Template.instance();

    $('[name=telefone]').mask("(00) 00000-0000",{});
    $('[name=cnpj]').mask("00.000.000/0000-00",{});
});

Template.registerRestaurant.events({
    'click .to1'(e, t) {
        e.preventDefault();

        $('.step2').hide();
        $('.step1').show();

        console.log($(".bs-wizard:nth-child(2)"));

        $(".bs-wizard-step:eq(1)").removeClass('active');
        $(".bs-wizard-step:eq(1)").addClass('disabled');
        $(".bs-wizard-step:eq(0)").removeClass('complete');
        $(".bs-wizard-step:eq(0)").addClass('active');

        $('[name=telefone]').mask("(00) 00000-0000",{});
        $('[name=cnpj]').mask("00.000.000/0000-00",{});
    },
    'click .to3from4'(e, t) {
        e.preventDefault();

        $('.step4').hide();
        $('.step3').show();

        $(".bs-wizard-step:eq(3)").removeClass('active');
        $(".bs-wizard-step:eq(3)").addClass('disabled');
        $(".bs-wizard-step:eq(2)").removeClass('complete');
        $(".bs-wizard-step:eq(2)").addClass('active');

        var options = {};

                t.businessHoursManager = $("#businessHoursContainer").businessHours(options);
                    // $('[name=startTime]').mask("00:00",{ "placeholder": "hh:mm" });
                    // $('[name=endTime]').mask("00:00",{ "placeholder": "hh:mm" });
    },
    'click .to2from3'(e, t) {
        e.preventDefault();

        $('.step3').hide();
        $('.step2').show();

        $(".bs-wizard-step:eq(2)").removeClass('active');
        $(".bs-wizard-step:eq(2)").addClass('disabled');
        $(".bs-wizard-step:eq(1)").removeClass('complete');
        $(".bs-wizard-step:eq(1)").addClass('active');

        $('[name=cep]').mask("00.000-000",{});



        GoogleMaps.create({
            name: 'map',
            element: document.getElementById('map'),
            options: {
              center: new google.maps.LatLng(-15.793752, -47.882682),
              zoom: 12
            }
          });

        //   -15,7941 -47,8825

          google.maps.event.addListener(GoogleMaps.maps.map.instance, 'click', function(event) {
            // placeMarker(event.latLng);
            t.marker.setPosition(event.latLng);
        });

          Tracker.autorun(function() {
            let currentLocation = Geolocation.latLng();
            console.log(currentLocation);
            // console.log(GoogleMaps.maps.map.instance);

            if(GoogleMaps.maps.map && currentLocation) {
                $('.standard').hide();

                let position = new google.maps.LatLng(currentLocation.lat, currentLocation.lng);
                let mapInstance = GoogleMaps.maps.map.instance;

                mapInstance.setCenter(position);

                t.marker = new google.maps.Marker({
                    position: position,
                    map: mapInstance,
                    title: ''
                  });
            }
        });


    },
    'click .to2'(e, t) {
        e.preventDefault();

        let restaurant = t.restaurant.get();
        restaurant.nome = $("[name=nome]").val();
        restaurant.cnpj = $("[name=cnpj]").val();
        restaurant.razao = $("[name=razao]").val();
        restaurant.telefone = $("[name=telefone]").val();
        // restaurant.descricao = $("[name=descricao]").val();
        restaurant.categoria = $("[name=categoria]").val();
        restaurant.especialidade = $("[name=especialidade]").val();
        restaurant.facebook = $("[name=facebook]").val();
        restaurant.instagram = $("[name=instagram]").val();

        if(!restaurant.nome || !restaurant.cnpj || !restaurant.razao || !restaurant.telefone  || !restaurant.categoria || !restaurant.especialidade) {
            return toastr.error('Preencha todos os campos');
        }

        t.restaurant.set(restaurant);

        $('.step1').hide();
        $('.step2').show();

        $(".bs-wizard-step:eq(0)").removeClass('active');
        $(".bs-wizard-step:eq(0)").addClass('complete');
        $(".bs-wizard-step:eq(1)").removeClass('disabled');
        $(".bs-wizard-step:eq(1)").addClass('active');

        $('[name=cep]').mask("00.000-000",{});



        GoogleMaps.create({
            name: 'map',
            element: document.getElementById('map'),
            options: {
              center: new google.maps.LatLng(-15.793752, -47.882682),
              zoom: 12
            }
          });

          google.maps.event.addListener(GoogleMaps.maps.map.instance, 'click', function(event) {
            // placeMarker(event.latLng);
            t.marker.setPosition(event.latLng);
        });

          Tracker.autorun(function() {
            // let currentLocation = Geolocation.latLng();

            // console.log(currentLocation);
            // console.log(GoogleMaps.maps.map.instance);
            // console.log(currentLocation);

            if(GoogleMaps.maps.map && false) {
                $('.standard').hide();

                let position = new google.maps.LatLng(currentLocation.lat, currentLocation.lng);
                let mapInstance = GoogleMaps.maps.map.instance;

                mapInstance.setCenter(position);

                t.marker = new google.maps.Marker({
                    position: position,
                    map: mapInstance,
                    title: ''
                  });
            } else if (GoogleMaps.maps.map){
                let position = new google.maps.LatLng(-15.793752, -47.882682);

                let mapInstance = GoogleMaps.maps.map.instance;
                console.log('123123123');
                mapInstance.setCenter(position);

                t.marker = new google.maps.Marker({
                    position: position,
                    map: mapInstance,
                    title: ''
                  });
            }
        });


    },
    'click .to3'(e, t) {
        e.preventDefault();

        let restaurant = t.restaurant.get();
        restaurant.endereco = $("[name=endereco]").val();
        restaurant.cep = $("[name=cep]").val();
        restaurant.bairro = $("[name=bairro]").val();
        restaurant.cidade = $("[name=cidade]").val();
        restaurant.estado = $("[name=estado]").val();
        restaurant.location = [t.marker.getPosition().lng(), t.marker.getPosition().lat()];

        if(!restaurant.endereco || !restaurant.cep || !restaurant.bairro || !restaurant.cidade || !restaurant.estado || !restaurant.location) {
            return toastr.error('Preencha todos os campos');
        }

        t.restaurant.set(restaurant);

        $('.step2').hide();
        $('.step3').show();

        $('[name=startTime]').mask("00:00",{ "placeholder": "hh:mm" });
        $('[name=endTime]').mask("00:00",{ "placeholder": "hh:mm" });

        $(".bs-wizard-step:eq(1)").removeClass('active');
        $(".bs-wizard-step:eq(1)").addClass('complete');
        $(".bs-wizard-step:eq(2)").removeClass('disabled');
        $(".bs-wizard-step:eq(2)").addClass('active');

        var options = {};

        t.businessHoursManager = $("#businessHoursContainer").businessHours(options);
            // $('[name=startTime]').mask("00:00",{ "placeholder": "hh:mm" });
            // $('[name=endTime]').mask("00:00",{ "placeholder": "hh:mm" });
    },
    'click .to4'(e, t) {
        e.preventDefault();

        let restaurant = t.restaurant.get();
        // restaurant.facebook = $("[name=facebook]").val();
        // restaurant.instagram = $("[name=instagram]").val();

        let cartoes = [];

        $("input:checkbox[name=cartoes]:checked").each(function(i){
            cartoes.push($(this).data("id"));
        });
        restaurant.cartoes = cartoes;

        restaurant.hours = t.businessHoursManager.serialize();


        if(!restaurant.hours ) {
            return toastr.error('Preencha todos os campos');
        }

        t.restaurant.set(restaurant);

        $('.step3').hide();
        $('.step4').show();

        $(".bs-wizard-step:eq(2)").removeClass('active');
        $(".bs-wizard-step:eq(2)").addClass('complete');
        $(".bs-wizard-step:eq(3)").removeClass('disabled');
        $(".bs-wizard-step:eq(3)").addClass('active');

        // $('.cel-wrap').imagedrag();

    },
    'click .confirm'(e, t) {
        e.preventDefault();

        let restaurant = t.restaurant.get();

        restaurant.capa = t.capa;
        restaurant.logo = t.logo;

        if(!restaurant.capa || !restaurant.logo) {
            return toastr.error('Preencha todos os campos');
        }

        if (t.crop) {
            restaurant.crop = t.crop;
        }

        restaurant.userId = Meteor.userId();

        Meteor.call('newRestaurant', restaurant, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res);
                toastr.success('Restaurante adicionado com sucesso');
                Router.go('dashboard');
            }
        });
    }
});

Template.registerRestaurant.onCreated(()=> {
    const self = Template.instance();

    self.restaurant = new ReactiveVar({});
    self.firstTime = true;

});
