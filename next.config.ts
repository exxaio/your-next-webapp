import createNextIntlPlugin from "next-intl/plugin"
import type { NextConfig } from "next"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:locale(en|zh-CN)",
        destination: "/:locale/login",
        permanent: false,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
