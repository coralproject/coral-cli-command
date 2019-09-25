import { Command as Base } from "@oclif/command";

import { APIClient } from "./api-client";

export abstract class Command extends Base {
  private clients = new Map<string, APIClient>();

  protected coral(domain: string, token?: string) {
    // Return the initialized client if it already exists.
    let client = this.clients.get(domain);
    if (client) {
      return client;
    }

    // Create the client otherwise.
    client = new APIClient(this.config, domain, token);

    // Set the client in the cache.
    this.clients.set(domain, client);

    return client;
  }
}
