export function copyKey(
  e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>,
  setCopied: (arg: boolean[]) => void,
  type?: "public" | "private"
): void {
  e.target.select();
  document.execCommand("copy");

  if (type) {
    // wallet page, copying keys (public / private)
    const isPublic = type === "public";
    setCopied([isPublic, !isPublic && !e.target.value.includes("◦")]);
  } else {
    // user items, copying public key
    setCopied([true]);
  }
}
