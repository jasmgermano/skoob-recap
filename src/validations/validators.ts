export function validateSearch(query: string): { id: string | null; validationMessage: string | null } {  
  if (!query) {       
    return { id: null, validationMessage: "Cole o link do seu skoob para pesquisar ⋆✴︎˚｡⋆" };
  }

  if (!query.includes("/usuario/") && !query.includes("/share/user/")) {
    return { id: null, validationMessage: "O link não está no formato correto ⋆.˚✮" };
  }

  const regex = /(?:\/usuario\/|\/share\/user\/)(\d+)(?:-[^/?#]*)?(?:[/?#]|$)/;
  const match = regex.exec(query);

  if (!match?.[1]) {
    return { id: null, validationMessage: "ID não encontrado na URL ⋆✴︎˚｡⋆" };
  }

  return { id: match[1], validationMessage: null };
}
