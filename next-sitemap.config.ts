import type { IConfig } from "next-sitemap";

const config: IConfig = {
  siteUrl:
    process.env.SITE_URL || "https://purvanchalmitramahasabha.vercel.app",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "weekly",
  priority: 0.7,
  exclude: [
    "/admin/*",
    "/admin/login",
    "/admin/members/*",
    "/admin/blogs/*",
    "/admin/blogs/*/edit",
    "/admin/blogs/new",
  ],

  transform: async (config, path) => {
    let priority = 0.7;
    let changefreq: IConfig["changefreq"] = "weekly";

    if (path === "/") {
      priority = 1.0;
      changefreq = "daily";
    } else if (["/about", "/contact", "/form", "/terms"].includes(path)) {
      priority = 0.9;
    } else if (path.startsWith("/blogs")) {
      priority = 0.8;
      changefreq = "daily";
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};

export default config;
