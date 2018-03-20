Template.type.helpers({
  type() {
    console.log(this.value);
    switch (this.value) {
      case 'PF': return 'Usuário'
      break;
      case 'PJ': return 'Restaurante'
      break;
      case 'ADMIN': return 'Administrador'
      break;
      default: return 'Sem perfil'
    }
  }
});
