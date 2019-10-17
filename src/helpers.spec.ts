import { prefixScheme, stripSchemePort } from "./helpers";

it("prefixes missing schemes", () => {
  expect(prefixScheme("localhost:3000")).toEqual("https://localhost:3000");
  expect(prefixScheme("coralproject.net")).toEqual("https://coralproject.net");
});

it("does not prefix schemes when they already exist", () => {
  const urls = [
    "http://localhost:3000",
    "https://localhost:3000",
    "https://coralproject.net",
    "http://coralproject.net"
  ];

  for (const url of urls) {
    expect(prefixScheme(url)).toEqual(url);
  }
});

it("strips the scheme from urls", () => {
  expect(stripSchemePort("http://localhost")).toEqual("localhost");
  expect(stripSchemePort("http://coralproject.net")).toEqual(
    "coralproject.net"
  );
  expect(stripSchemePort("https://localhost")).toEqual("localhost");
  expect(stripSchemePort("https://coralproject.net")).toEqual(
    "coralproject.net"
  );
});

it("strips the port from urls", () => {
  expect(stripSchemePort("http://localhost:8080")).toEqual("localhost");
  expect(stripSchemePort("http://coralproject.net:80")).toEqual(
    "coralproject.net"
  );
  expect(stripSchemePort("https://localhost:8080")).toEqual("localhost");
  expect(stripSchemePort("https://coralproject.net:443")).toEqual(
    "coralproject.net"
  );
});
