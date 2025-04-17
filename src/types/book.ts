export interface Book {
    edicao: {
      id: number;
      nome_portugues: string;
      autor: string;
      paginas: number;
      capa_grande: string;
    };
    ranking: number;  
    favorito: number;
}
  