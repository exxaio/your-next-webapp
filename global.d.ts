declare module "use-intl" {
  interface AppConfig {
    Messages: typeof import("./messages/en.json")
    Locale: "en" | "zh-CN"
  }
}
