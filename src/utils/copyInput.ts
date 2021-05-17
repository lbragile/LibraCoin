export function copyKey(
  e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>,
  setCopied: (arg: boolean[]) => void,
  type?: "public" | "private",
  index?: number,
  totalUsers?: number
): void {
  const visible = !e.target.value.includes("◦");
  if (visible) {
    e.target.select();
    document.execCommand("copy");
  } else {
    e.target.blur();
  }

  if (type) {
    // wallet page, copying keys (public / private)
    const isPublic = type === "public";
    setCopied([isPublic, !isPublic && visible]);
  } else {
    // user items, copying public key
    const newCopied = new Array(totalUsers).fill(false);
    newCopied[index as number] = true;
    setCopied(newCopied);
  }
}
