export function copyKey(
  e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>,
  setCopied: (arg: boolean[]) => void,
  type?: "public" | "private"
): void {
  e.target.select();
  e.target.setSelectionRange(0, 1e6);
  document.execCommand("copy");

  // wallet page, copying keys
  if (type) {
    const isPublic = type === "public";
    setCopied([isPublic, !isPublic && !e.target.value.includes("◦")]);
  } else {
    setCopied([true]);
  }
}
