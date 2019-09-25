import { flags } from "@oclif/command";

export const domain = flags.build({
  char: "d",
  description: "domain for tenant to run command against",
  default: () => {
    const env = process.env.CORAL_DOMAIN;
    if (env) {
      return env;
    }
  }
});
