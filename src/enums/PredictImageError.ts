export enum PredictImageError {
    MODEL_TYPE_REQUIRED = 'Tipo do modelo é obrigatório',
    FILE_REQUIRED = 'Arquivo é obrigatório',
    PREFIX_NOT_FOUND = 'Prefixo do modelo não encontrado',
    FILE_CONTENT_REQUIRED = 'A imagem deve conter um conteúdo',
    FILE_TYPE_REQUIRED = 'A imagem deve conter um tipo',
    INVALID_FILE_TYPE = 'Apenas JPG, JPEG e PNG são permitidos, o tipo da imagem é inválido: "type"',
    IMAGE_UPLOAD_FAILED = 'Não foi possível salvar a imagem',
    IMAGE_ANALYSIS_FAILED = 'Não foi possível obter a análise da imagem',
    GENERAL_ERROR = 'Ocorreu um problema ao obter a análise da imagem',
}
