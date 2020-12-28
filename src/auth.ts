import * as Config from "@oclif/config";
import ux from "cli-ux";
import fetch from "isomorphic-fetch";
import Netrc from "netrc-parser";

import { prefixScheme, stripSchemePort } from "./helpers";

interface NetrcEntry {
  login: string;
  password: string;
}

export default class Auth {
  private config: Config.IConfig;
  private domain: string;
  private auth?: string;

  constructor(config: Config.IConfig, domain: string, auth?: string) {
    this.config = config;
    this.domain = domain;
    this.auth = auth;
  }

  private get host() {
    return stripSchemePort(this.domain);
  }

  private get base() {
    return prefixScheme(this.domain);
  }

  public async login() {
    return this.interactive();
  }

  public async logout() {
    await Netrc.load();
    delete Netrc.machines[this.host];
    await Netrc.save();
  }

  public get token() {
    if (!this.auth) {
      if (process.env.CORAL_API_TOKEN) {
        this.auth = process.env.CORAL_API_TOKEN;
      } else {
        Netrc.loadSync();
        if (Netrc.machines[this.host]) {
          this.auth = Netrc.machines[this.host].password;
        }
      }
    }
    return this.auth;
  }

  private async interactive(retries = 3): Promise<void> {
    retries--;

    await Netrc.load();

    process.stderr.write("coral: Enter your login credentials\n");
    const email = await ux.prompt("Email", {});
    const password = await ux.prompt("Password", { type: "hide" });

    const res = await fetch(this.base + "/api/auth/local", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": `coral-cli/${this.config.version} ${this.config.platform}`,
      },
      body: JSON.stringify({ email, password }),
    });

    const body = await res.json();

    if (res.status !== 200) {
      ux.error(body.error.message);
    }

    if (typeof body.token !== "string") {
      return this.interactive(retries);
    }

    const { token } = body;

    await this.saveToken({
      login: email,
      password: token,
    });
  }

  private async saveToken(entry: NetrcEntry) {
    if (!Netrc.machines[this.host]) {
      Netrc.machines[this.host] = {};
      Netrc.machines[this.host].login = entry.login;
      Netrc.machines[this.host].password = entry.password;
      delete Netrc.machines[this.host].method;
      delete Netrc.machines[this.host].org;
    }
    await Netrc.save();
  }
}
