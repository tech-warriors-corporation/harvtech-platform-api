export enum AccountRegisterError {
    NAME_IS_REQUIRED = 'Nome é obrigatório',
    EMAIL_IS_REQUIRED = 'E-mail é obrigatório',
    PASSWORD_IS_REQUIRED = 'Senha é obrigatória',
    PASSWORD_CONFIRMATION_IS_REQUIRED = 'Confirmação de senha é obrigatória',
    PASSWORDS_ARE_NOT_EQUAL = 'As senhas não são iguais',
    PASSWORD_SHOULD_BE_STRONG = 'A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
    PLAN_IS_REQUIRED = 'Plano de mensalidade é obrigatório',
    INVALID_PLAN = 'Plano de mensalidade é inválido',
    SHOULD_ACCEPT_TERMS = 'É necessário aceitar os termos de uso',
    EMAIL_ALREADY_REGISTERED = 'E-mail já cadastrado no ecossistema HarvTech',
    GENERAL_ERROR = 'Ocorreu um problema ao criar a conta no ecossistema HarvTech',
}
