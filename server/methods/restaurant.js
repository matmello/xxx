Meteor.methods({
    newRestaurant(restaurant) {
        let insercaoLogo = Logos.insert(restaurant.logo);
        let imagemLogo = Logos.findOne(insercaoLogo._id);

        let insercaoCapa = Capas.insert(restaurant.capa);
        let imagemCapa = Capas.findOne(insercaoCapa._id);

        restaurant.capa = '';
        restaurant.logo = '';

          let url = imagemCapa.url({brokenIsFine: true}).slice(1);

        console.log(url);
        console.log(restaurant);

        return Restaurants.insert({
            userId: restaurant.userId,
            nome: restaurant.nome,
            id: restaurant.cnpj,
            nomeFantasia: restaurant.razao,
            telefone: restaurant.telefone,
            descricao: restaurant.descricao,
            categoria: restaurant.categoria,
            especialidade: restaurant.especialidade,
            endereco: restaurant.endereco,
            bairro: restaurant.bairro,
            estado: restaurant.estado,
            cidade: restaurant.cidade,
            cartoes: restaurant.cartoes,
            reembolso: 90,
            location: restaurant.location,
            hours: restaurant.hours,
            facebook: restaurant.facebook,
            instagram: restaurant.instagram,
            imgId: imagemLogo._id,
            imgCapaId: imagemCapa._id,
            cep: restaurant.cep,
            status: false,
        });
    }
});
