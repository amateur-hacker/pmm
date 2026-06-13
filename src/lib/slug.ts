export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function uniqueSlug(text: string, existingSlugs?: Set<string>): string {
  let slug = slugify(text);
  if (!slug) slug = "untitled";

  if (!existingSlugs?.has(slug)) return slug;

  let counter = 1;
  while (existingSlugs.has(`${slug}-${counter}`)) counter++;
  return `${slug}-${counter}`;
}
