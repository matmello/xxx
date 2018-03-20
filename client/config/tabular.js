	$.extend(true, $.fn.dataTable.defaults, {
		language: {
    //   "lengthMenu": i18n("tableDef.lengthMenu"),
    //   "zeroRecords": i18n("tableDef.zeroRecords"),
    //   "info": i18n("tableDef.info"),
      "emptyTable": " ",
      "search": "Pesquisar",
      "lengthMenu": "_MENU_ resultados por página",
      "paginate": {
        "first":      "Primeira",
        "last":       "Última",
        "next":       "Próxima",
        "previous":   "Anterior"
    },
    "info":           "Mostrando _START_ a _END_ de _TOTAL_ resultados",
    "infoEmpty":      "Não foram encontrados registros",
    //   "infoFiltered": i18n("tableDef.infoFiltered")
    }
	});
