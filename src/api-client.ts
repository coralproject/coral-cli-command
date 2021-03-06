import * as Config from "@oclif/config";

import Auth from "./auth";
import { prefixScheme } from "./helpers";

export class APIClient {
  private config: Config.IConfig;

  public readonly domain: string;
  public readonly auth: Auth;

  constructor(config: Config.IConfig, domain: string, token?: string) {
    this.config = config;
    this.domain = domain;
    this.auth = new Auth(config, domain, token);
  }

  public async request(url: string, options: RequestInit) {
    options.headers = {
      ...(options.headers || {}),
      "User-Agent": `coral-cli/${this.config.version} ${this.config.platform}`,
    };

    const res = await fetch(prefixScheme(this.domain) + url, options);

    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const { error } = await res.json();
        throw new Error(error.message);
      } else {
        throw new Error(await res.text());
      }
    }

    if (res.status === 204) {
      return res.text();
    }

    return res.json();
  }

  public async graphql(query: string, variables = {}, retries = 3) {
    retries--;
    if (retries <= 0) {
      throw new Error("maximum retries reached");
    }

    if (!this.auth.token) {
      await this.auth.login();
    }

    const headers: HeadersInit = {
      "content-type": "application/json",
      authorization: `Bearer ${this.auth.token}`,
    };

    const { data, errors } = await this.request("/api/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    return { data };
  }
}
