export async function getUserBooks(userId: string) {
  const response = await fetch(
    `https://www.skoob.com.br//v1/bookcase/books/${userId}/shelf_id:0/page:1/limit:10000/`
  );

    if (!response.ok) {
      throw new Error("Erro ao buscar livros do usuário");
    }

    return response.json();
}
