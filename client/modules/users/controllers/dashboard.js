import 'bootstrap-switch' ;

// dashboardPortions
currentTab = 0;

function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class to the current step:
    x[n].className += " active";
  }

  function validateForm() {
    // This function deals with validation of the form fields
    console.log(currentTab);
    if (currentTab == 0) {
        var portions = Session.get('portions')||[];

        $('[name=porcoes]:checked').each( function() {
            // portions.push(this.value);
            var hasFilled = false;
            portions.forEach((item, index)=>{
                if (item.qnt == this.value) {
                    hasFilled = true;
                    portions[index] = {
                        qnt: this.value,
                        price: item.price
                    }
                }
            });
            if (!hasFilled) {
                portions.push({
                    qnt: this.value,
                    price: ''
                });
            }
        })

        if (portions.length == 0) return false;


        Session.set('portions', portions.sort((a, b)=> a.qnt - b.qnt));

        // Session.set('portions', portions.map((peso) => {
        //     return {
        //         qnt: peso
        //     }
        // }));

        setTimeout(function() {
            $('.money').mask('000.000.000.000.000,00', {reverse: true});
        }, 1000);

        return true;
    } else if (currentTab == 1) {

        var portions = [];

        var valid = true;

        $('[name=disablePorcoes]:checked').each( function() {
            portions.push({
                qnt: this.value,
                price: $('#'+this.value).val()
            });

            if ($('#'+this.value).val().length == 0) {
                valid = false;
            }

        })


        Session.set('portions', portions);




        return valid;

    } else if (currentTab == 2){


        let descs = [];

        $( ".descricao" ).each(function( index ) {
            // console.log( index + ": " + $( this ).text() );
            descs.push({
                dia: $(this).attr('id'),
                desc: $(this).val()
            });
          });

        Session.set('descs', descs);

        return true;
    } else {
        return true;
    }

  }

function showTab(n) {
    // This function will display the specified tab of the form ...
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    // ... and fix the Previous/Next buttons:
    if (n == 0) {
      document.getElementById("prevBtn").style.display = "none";
    } else {
      document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
      document.getElementById("nextBtn").innerHTML = "Enviar";
    } else {
      document.getElementById("nextBtn").innerHTML = "Avançar";
    }
    // ... and run a function that displays the correct step indicator:
    fixStepIndicator(n)
  }

  function nextPrev(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && !validateForm()) {
        return toastr.error('Existem erros no formulário. Por favor preencha os campos');
    }
    // Hide the current tab:
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;

    if(currentTab == 2) {
        console.log(Restaurants.findOne());
        var restaurant = Restaurants.findOne(Session.get('restaurantId'));

        if(restaurant) {
            console.log('filling..');
            let portion = Portions.findOne({restaurantId: restaurant._id});
            if(!portion) {
                setTimeout(function() {
                    $('.descricao').html('');
                    $('.descricao').append(`O ${restaurant.nome} está unido ao IS2EAT na luta contra o desperdício de alimentos! E você? &#xA; No ${restaurant.nome} você contará com um delicioso buffet todos os dias, repleto de comidas saudáveis e frescas. Nosso principais pratos/especialidades são: &#xA; - &#xA; - &#xA; - &#xA; - E muito mais! &#xA; Faça seu pedido aqui no IS2EAT e fique atento ao horário de retirada, indicado abaixo. IS2EAT: alimento para o planeta!`);
                }, 1000);
            } else {
                setTimeout(function() {
                    portion.descs.forEach((desc)=> {
                        $(`#${desc.dia}`).html('');
                        $(`#${desc.dia}`).append(desc.desc);
                    });
                }, 1000);
            }
        }
    }
    // if you have reached the end of the form... :
    if (currentTab >= x.length) {
      //...the form gets submitted:
    //   document.getElementById("regForm").submit();
        let currentPortion = Portions.findOne({restaurantId: Session.get('restaurantId')});

        if (currentPortion) {
            Portions.update({_id: currentPortion._id}, {
                $set: {
                    descs: Session.get('descs'),
                    portions: Session.get('portions')
                }
            });
        } else {
            Portions.insert({
                restaurantId: Session.get('restaurantId'),
                descs: Session.get('descs'),
                portions: Session.get('portions')
            });
        }


        Session.set('tab', 'bankInfo');

      return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
  }

Template.dashboardPortions.onRendered(()=> {
    currentTab = 0;
});

Template.dashboardPortions.helpers({
    portions() {
        return Portions.find({restaurantId: Session.get('restaurantId')}).fetch();
    }
});

Template.dashboardPortions.events({
    'click .recadastrar'(e, t) {
        e.preventDefault();
        // let portionId = Portions.findOne({restaurantId: Session.get('restaurantId')})._id;
        // if (portionId) {
        //     Portions.remove(portionId);
        // }
        Session.set('tab', 'portionForm');
    },
    'click .rebanco'(e, t) {
        e.preventDefault();
        Session.set('tab', 'bankInfo');
    },
    'click .toPortionForm'(e, t) {
        e.preventDefault();
        Session.set('tab','portionForm');
    }
});

Template.portionForm.events({
    // 'input .descricao'(e, t) {
    //     // e.preventDefault();
    //     let val = e.currentTarget.value;

    //     if ($('[name=todos]').is(':checked')) {
    //         $('.descricao').html('').not($(e.currentTarget));
    //         $('.descricao').not($(e.currentTarget)).append(val);
    //     }
    // },
    'click .dia-btn'(e, t) {
        e.preventDefault();

        if ($('[name=todos]').is(':checked')) {
            let val = $('.descricao:visible').val();
            console.log(val);
            $('.descricao').html('');
            $('.descricao').append(val);
        }


        $('.dia-input').hide();
        $('.dia-btn').removeClass('active');
        $(e.currentTarget).addClass('active');
        var selector = '#' + $(e.currentTarget).text() + 'Input';
        console.log(selector);
        $(selector).show();
        $(selector).addClass('active');


    },
    'click #nextBtn'(e, t) {
        e.preventDefault();
        nextPrev(1);
    },
    'click #prevBtn'(e, t) {
        e.preventDefault();
        nextPrev(-1);
    },
});

Template.portionForm.helpers({
    price() {
        return this.price;
    },
    restaurantCapa() {
        let restaurant = Restaurants.findOne(Session.get('restaurantId'));
        if (restaurant.imgCapaId) {
            return Capas.findOne(restaurant.imgCapaId).url()
        } else {
            return '';
        }
    },
    restaurantLogo() {
        let restaurant = Restaurants.findOne(Session.get('restaurantId'));
        if (restaurant.imgId) {
            return Logos.findOne(restaurant.imgId).url()
        } else {
            return '';
        }
    },
    portionItem() {
        return Session.get('portions');
    },
    portion() {
        return Session.get('portions');
    },
    firstDesc() {
        return Session.get('descs')[0].desc.replace(/\r\n|\r|\n/g,"<br />");
    }
});

Template.portionForm.onCreated(()=> {
    const self = Template.instance();


});

Template.portionForm.onRendered(()=> {
    const self = Template.instance();

    showTab(currentTab);
});


// end dashboardPortions

Template.dashboard.helpers({
    tab() {
        return Session.get('tab');
    },
    restaurantLogo() {
        let restaurant = Restaurants.findOne(Session.get('restaurantId'));
        if (restaurant && restaurant.imgId) {
            let logo = Logos.findOne(restaurant.imgId);
            if (logo) {
                return logo.url();
            }
        }
        return '';
    },
    restaurantName() {
        let restaurant = Restaurants.findOne(Session.get('restaurantId'));
        return restaurant ? restaurant.nome : '';
    }
});


Template.dashboard.events({
    'click .cadastrarEstoque'(e, t) {
        e.preventDefault();
        Session.set('tab', 'dashboardStock');
    },
    'click .toPortions'(e, t) {
        e.preventDefault();
        Session.set('tab', 'dashboardPortions');
    },
    'click .toFatura'(e, t) {
        e.preventDefault();
        Session.set('tab', 'dashboardFatura');
    },
    'click .toVendas'(e, t) {
        e.preventDefault();
        Session.set('tab', 'dashboardVendas');
    },
    'click .toHome'(e, t) {
        e.preventDefault();
        console.log('foi');
        Session.set('tab', 'dashboardHome');
    },
    'click .logout-link'(e, t) {
        e.preventDefault();

        Meteor.logout(function(error){
            Router.go('home');
            if (error) {
              console.log(error);
            } else {
            }
          });
    }
});

Template.dashboardHome.events({
    'click .toPortionForm'(e, t) {
        e.preventDefault();
        Session.set('tab','portionForm');
    }
});

Template.dashboard.onCreated(()=> {
    const self = Template.instance();

    // self.tab = new ReactiveVar('dashboardHome');
    Session.set('tab', 'dashboardHome');

    Meteor.Loader.loadCss("/light/light.css");
    Meteor.Loader.loadCss("/light/demo.css");

    Tracker.autorun(function() {
        if (!Session.get('restaurantId')) {
            let restaurant = Restaurants.findOne({userId: Meteor.userId()});
            if (restaurant) {
                Session.set('restaurantId', restaurant._id);
            }
        }
    });

});

Template.dashboard.onRendered(()=> {
    const self = Template.instance();

    console.log('123123');
    $.getScript('/vendor/light.js');

    $sidebar = $('.sidebar');
    image_src = $sidebar.data('image');

    if (image_src !== undefined) {
        sidebar_container = '<div class="sidebar-background" style="background-image: url(' + image_src + ') "/>'
        $sidebar.append(sidebar_container);
    }

    window_width = $(window).width();

    fixed_plugin_open = $('.sidebar .sidebar-wrapper .nav li.active a p').html();

    if (window_width > 767 && fixed_plugin_open == 'Dashboard') {
        if ($('.fixed-plugin .dropdown').hasClass('show-dropdown')) {
            $('.fixed-plugin .dropdown').addClass('show');
        }

    }


    // $.getScript('/vendor/demo.js');
    // $.getScript('./vendor/light.js', function() {
    //     // $.getScript('/vendor/demo.js');
    //     $sidebar = $('.sidebar');
    //     image_src = $sidebar.data('image');
    //     console.log('123123');
    //     if (image_src !== undefined) {
    //         sidebar_container = '<div class="sidebar-background" style="background-image: url(' + image_src + ') "/>'
    //         $sidebar.append(sidebar_container);
    //     }
    // });



});

Template.bankInfo.helpers({
    restaurantCnpj() {
        return Restaurants.findOne(Session.get('restaurantId')).id;
    },
    restaurantLegalName() {
        return Restaurants.findOne(Session.get('restaurantId')).nomeFantasia;
    },
    hasBankInfo() {
        let bankInfo = BankInfo.findOne({restaurantId: Session.get('restaurantId')});
        return bankInfo;
    },
    bankInfo() {
        let bankInfo = BankInfo.findOne({restaurantId: Session.get('restaurantId')});
        if (bankInfo) {
            return bankInfo;
        } else {
            return {
                ag: "",
                agdv: "",
                acc: "",
                accdv: ""
            };
        }
    }
});

Template.bankInfo.onRendered(()=> {
    const self = Template.instance();

    Tracker.autorun(function() {
        let bankInfo = BankInfo.findOne({restaurantId: Session.get('restaurantId')});

        console.log(bankInfo.bank);

        if (bankInfo) {
            $(`[value=${bankInfo.bank}]`).attr('selected','selected');
        }

    });


});

Template.bankInfo.events({
    'click #saveBank'(e, t) {
        e.preventDefault();

        let bankInfo = {
            restaurantId: Session.get('restaurantId'),
            bank: $('#bankName').val(),
            nome: $('[name=legalName]').val(),
            documentNumber: $('[name=documentNumber]').val(),
            ag: $('[name=ag]').val(),
            agdv: $('[name=agdv]').val(),
            acc: $('[name=acc]').val(),
            accdv: $('[name=accdv]').val(),
        }

        console.log(bankInfo);
        if (!bankInfo.restaurantId || !bankInfo.bank || !bankInfo.nome || !bankInfo.documentNumber || !bankInfo.ag || !bankInfo.acc) {
            return toastr.error('Existem erros no formulário. Por favor preencha todos os campos');
        } else {
            let current = BankInfo.findOne({restaurantId: Session.get('restaurantId')});
            if (current) {
                BankInfo.remove(current._id);
            }
            BankInfo.insert(bankInfo);
            // toastr.success('Parabéns, você já pode iniciar suas vendas no app!');
            swal({
                type: 'success',
                title: 'Parabéns',
                text: 'Você já pode iniciar suas vendas no app!',
                showCancelButton: false,
            });
            Session.set('tab', 'dashboardHome');
        }
    }
});

Template.portionForm.onRendered(()=> {
    const self = Template.instance();


    Tracker.autorun(function() {
        let restaurant = Restaurants.findOne(Session.get('restaurantId'));

        let portion = Portions.findOne({restaurantId: restaurant._id});

        if (portion) {

            Session.set('portions', portion.portions);

            portion.portions.forEach((item) => {
                $(`:checkbox[value=${item.qnt}]`).prop("checked","true");
                // console.log(item.qnt);
                // setTimeout(()=>{
                //     $(`#${item.qnt}`).val(item.price);
                // }, 1000)
            });
        }
    });

});

Template.dashboard.onDestroyed(()=>{
    const self = Template.instance();

    // $('head').find('link[href="/light/light.css"]').remove();
    // $('head').find('link[href="/light/demo.css"]').remove();
    // $("link[href*=/light/light.css]").attr("disabled", "disabled");
    // $("link[href*=/light/demo.css]").attr("disabled", "disabled");
    // document.querySelector('link[href*="/light/demo.css"]').attr("disabled", "disabled");
    // document.querySelector('link[href*="/light/light.css"]').attr("disabled", "disabled");
    // $("link[href='/light/demo.css']").remove();
    // $("link[href='/light/light.css']").remove();

});
// let restaurant = Restaurants.findOne(Session.get('restaurantId'));

        // let portion = Portions.findOne({restaurantId: restaurant._id});

        // if (portion) {

        //     portion.portions.forEach((item) => {
        //         $(`#${item.qnt}`).val(item.price);
        //     });

        //     portion.descs.forEach((item) => {
        //         $(`#${item.dia}`).val(item.desc);
        //     });
        // }
$.fn.bootstrapSwitch.defaults.size = 'large';
$.fn.bootstrapSwitch.defaults.onColor = 'success';

Template.dashboardHome.onRendered(()=> {
    const self = Template.instance();

    $("[name='status']").bootstrapSwitch({
        size: 'mini',
        onText: '',
        offText: '',
        onColor: 'success',
        offColor: 'danger',
        handleWidth: '200'
    });

    $("[name='status']").bootstrapSwitch('onColor', 'danger');
});

Template.dashboardHome.events({
    'click .cadastrarEstoque'(e, t) {
        e.preventDefault();
        Session.set('tab', 'dashboardStock');
    },
    'click .btn-info'(e, t) {
        e.preventDefault();
        Session.set('tab', 'dashboardStock');
    }
});

Template.dashboardHome.helpers({
    hasPortion() {
        return Portions.findOne({restaurantId: Session.get('restaurantId')});
    },
    hasEstoque() {
        return Stocks.findOne({restaurantId: Session.get('restaurantId')});
    },
    left() {
        let dateFrom = new Date();
        dateFrom.setHours(0);

        let dateTo = new Date();
        dateTo.setHours(23);
        dateTo.setMinutes(59);

        let count = 0;
        let sales =  Sales.find({
            date: {
                $lt: dateTo,
                $gte: dateFrom
            },
            restaurant: Session.get('restaurantId')
        }).fetch();

        sales.forEach((item)=> {
            count += item.quantity;
        });

        let qnt = Stocks.findOne({restaurantId: Session.get('restaurantId')}).qnt;
        return qnt - count;
    },
    qnt() {
        return Stocks.findOne({restaurantId: Session.get('restaurantId')}).qnt;
    },
    sold() {
        let dateFrom = new Date();
        dateFrom.setHours(0);

        let dateTo = new Date();
        dateTo.setHours(23);
        dateTo.setMinutes(59);

        let count = 0;
        let sales =  Sales.find({
            date: {
                $lt: dateTo,
                $gte: dateFrom
            },
            restaurant: Session.get('restaurantId')
        }).fetch();

        sales.forEach((item)=> {
            count += item.quantity;
        });

        return count;
    },
    registered() {
        // let dateFrom = new Date();
        // dateFrom.setHours(0);

        // let dateTo = new Date();
        // dateTo.setHours(23);
        // dateTo.setMinutes(59);

        // return Sales.find({
        //     date: {
        //         $lt: dateTo,
        //         $gte: dateFrom
        //     },
        //     restaurant: Session.get('restaurantId')
        // }).count();
    }
});

Template.dashboardStock.helpers({
    portionsCol() {
        return Portions.findOne({restaurantId: Session.get('restaurantId')});
    }
});

Template.dashboardStock.events({
    'click .btn-dash'(e, t) {
        e.preventDefault();

        let stockQnt = 0;

        $('.stock-qnt').each((index, elem)=> {
            stockQnt += parseInt($(elem).val());
        });

        let stock = Stocks.findOne({restaurantId: Session.get('restaurantId')})
        if (stock) {
            Stocks.update(stock._id, {
                $set: {
                    restaurantId: Session.get('restaurantId'),
                    qnt: stockQnt
                }});
        } else {
            Stocks.insert({
                restaurantId: Session.get('restaurantId'),
                qnt: stockQnt
            });
        }
        Session.set('tab', 'dashboardHome');
    }
});

Template.dashboardVendas.onCreated(()=> {
    const self = Template.instance();

    import dataTablesBootstrap from 'datatables.net-bs';
    import 'datatables.net-bs/css/dataTables.bootstrap.css';
    dataTablesBootstrap(window, $);
});

Template.dashboardVendas.helpers({
    selector() {
        return {restaurant: Session.get('restaurantId')};
    }
});

Template.dashboardFatura.helpers({
    currentMonth() {
        return Template.instance().month.get();
    },
    sales() {
        return Sales.find({restaurant: Session.get('restaurantId'), status: {$in: ['Confirmado', 'Recebido']}}).fetch().map((sale)=>{
            return sale;
        });
    },
    saleDate() {
        return new moment(this.date).format('DD/MM');
    },
    saleValue() {
        return 'R$'+ (this.value/100).toFixed(2).replace('.',',');
    }
});

Template.dashboardFatura.onCreated(()=>{
    const self = Template.instance();

    self.month = new ReactiveVar('Março');
});

Template.dashboardFatura.events({
    'click .chooseMonth'(e, t) {
        e.preventDefault();
        t.month.set($(e.currentTarget).data("month"));
        $('.chooseMonth').removeClass('active');
        $(e.currentTarget).addClass('active');
    }
});
