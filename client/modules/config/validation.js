$.validator.setDefaults({
  rules: {
    email: {
      required: true,
      email: true,
    },
    senha: {
      required: true,
      minlength: 6,
    },
    confirmarSenha: {
      required: true,
      equalTo: '[name=senha]',
    },
  },
  messages: {

  },
});

jQuery.extend(jQuery.validator.messages, {
    digits: "Por favor insira apenas números.",
    required: "Esse campo é obrigatório.",
    remote: "Please fix this field.",
    email: "Por favor utilize um e-mail válido.",
    url: "Please enter a valid URL.",
    date: "Please enter a valid date.",
    dateISO: "Por favor utilize uma data válida.",
    number: "Please enter a valid number.",
    creditcard: "Please enter a valid credit card number.",
    equalTo: "Por favor insira o mesmo valor novamente.",
    accept: "Please enter a value with a valid extension.",
    maxlength: jQuery.validator.format("Por favor não insira mais de {0} caracteres."),
    minlength: jQuery.validator.format("Por favor insira pelo menos {0} caracteres."),
    rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
    range: jQuery.validator.format("Please enter a value between {0} and {1}."),
    max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
    min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
});
