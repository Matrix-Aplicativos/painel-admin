// Converte Arquivo (File) para Hex String (para salvar no Banco)
export const fileToHex = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const byteArray = new Uint8Array(buffer);
  let hexString = "\\x"; // Prefixo obrigatório do Postgres
  for (let i = 0; i < byteArray.length; i++) {
    hexString += byteArray[i].toString(16).padStart(2, "0");
  }
  return hexString;
};

// Converte Hex String (do Banco) para Blob (para download)
export const hexToBlob = (
  hex: string,
  mimeType: string = "application/octet-stream"
): Blob => {
  // Remove o prefixo \x se existir
  const cleanHex = hex.startsWith("\\x") ? hex.slice(2) : hex;

  const byteCharacters = cleanHex.match(/.{1,2}/g);
  if (!byteCharacters) return new Blob([], { type: mimeType });

  const byteNumbers = new Uint8Array(
    byteCharacters.map((byte) => parseInt(byte, 16))
  );
  return new Blob([byteNumbers], { type: mimeType });
};
