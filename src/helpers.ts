export function prefixScheme(domain: string) {
  return domain.startsWith("http") ? domain : "https://" + domain;
}

export function stripSchemePort(domain: string) {
  let text = domain;
  text = text.startsWith("http") ? text.split("://")[1] : text;
  text = text.includes(":") ? text.split(":")[0] : text;
  return text;
}
