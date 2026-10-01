declare module "use-intl" {
  interface AppConfig {
    Messages: typeof import("./messages/en").default
    Locale: "en" | "zh-CN"
  }
}
