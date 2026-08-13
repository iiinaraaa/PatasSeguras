interface DogCeoResponse {
  message: string;
  status: string;
}

interface CatApiResponse {
  url: string;
}

export async function getRandomDogPhoto(): Promise<string> {
  const res = await fetch("https://dog.ceo/api/breeds/image/random");
  if (!res.ok) throw new Error("Falha ao buscar foto de cachorro");
  const data: DogCeoResponse = await res.json();
  if (!data.message) throw new Error("Resposta da Dog CEO API sem imagem");
  return data.message;
}

export async function getRandomCatPhoto(): Promise<string> {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  if (!res.ok) throw new Error("Falha ao buscar foto de gato");
  const data: CatApiResponse[] = await res.json();
  if (!data[0]?.url) throw new Error("Resposta da TheCatAPI sem imagem");
  return data[0].url;
}
