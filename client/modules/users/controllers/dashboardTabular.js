Template.checkSale.events({
    'click .seeSaleReport'(e, t) {
        e.preventDefault();
        $(t.find('.modal')).modal('show');
    },
    'click .btn-info'(e, t) {
        e.preventDefault();
        Sales.update(this._id, {
            $set: {
                status: 'Recebido'
            }
        });
        $(t.find('.modal')).modal('hide');
        toastr.success('Recebimento registrado com sucesso');
    },
    'click .btn-warning'(e, t) {
        e.preventDefault();
        Sales.update(this._id, {
            $set: {
                status: 'Estorno solicitado'
            }
        });
        $(t.find('.modal')).modal('hide');
        toastr.success('Pedido de estorno registrado com sucesso');
    }
});


Template.checkSale.helpers({
    podeEstornar() {
        return this.status !== 'Estorno solicitado';
    },
    conf() {
        return this.status == 'Confirmado';
    },
    id() {
        return this._id.substring(0,6).toUpperCase();
    },
    qnt() {
        let qnt = Sales.findOne(this._id).quantity;
        if (qnt == 1) {
            return qnt + ". porção de ";
        } else {
            return qnt + ". porções de ";
        }
    },
    portion() {
        return Sales.findOne(this._id).portion;
    },
    date() {
        return moment(this.date).format('DD/MM/YYYY');
    }

});
