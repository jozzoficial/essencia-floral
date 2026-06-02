const LARGURA_MAX = 1200;
const QUALIDADE_JPEG = 0.82;

export async function comprimirImagem(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const escala = Math.min(1, LARGURA_MAX / bitmap.width);
  const largura = Math.round(bitmap.width * escala);
  const altura = Math.round(bitmap.height * escala);

  const canvas = document.createElement('canvas');
  canvas.width = largura;
  canvas.height = altura;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, largura, altura);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', QUALIDADE_JPEG);
  });

  if (!blob) {
    return file;
  }

  const nomeBase = file.name.replace(/\.[^.]+$/, '') || 'imagem';
  return new File([blob], `${nomeBase}.jpg`, { type: 'image/jpeg' });
}
