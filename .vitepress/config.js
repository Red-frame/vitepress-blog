import { SitemapStream } from 'sitemap'
import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'

// This links array is used to temporarily store all page link information, in order to generate sitemap.
const links = []
const siteHostName = 'https://lazy-assedninja.com/'

export default {
    title: 'Henry Huang',
    description: 'This is desc.',
    head: [
        ['meta', {
            name: "msapplication-TileColor",
            content: "#000000"
        }],
        ['meta', {
            name: "msapplication-config",
            content: "/favicons/browserconfig.xml"
        }],
        ['meta', {
            name: "theme-color",
            content: "#000000"
        }],
        ['link', {
            rel: "apple-touch-icon",
            sizes: "180x180",
            href: "/favicons/apple-touch-icon.png"
        }],
        ['link', {
            rel: "icon",
            type: "image/png",
            sizes: "32x32",
            href: "/favicons/favicon-32x32.png"
        }],
        ['link', {
            rel: "icon",
            type: "image/png",
            sizes: "16x16",
            href: "/favicons/favicon-16x16.png"
        }],
        ['link', {
            rel: "manifest",
            href: "/favicons/site.webmanifest"
        }],
        ['link', {
            rel: "mask-icon",
            href: "/favicons/safari-pinned-tab.svg", color: "#000000"
        }],
        ['link', {
            rel: "shortcut icon",
            href: "/favicons/favicon.ico"
        }],
        ['script', {
            async: true,
            src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + process.env.GOOGLE_ADSENSE_CLIENT_ID,
            crossorigin: "anonymous"
        }],
        ['script', {
            async: true,
            src: "https://www.googletagmanager.com/gtag/js?id=" + process.env.GOOGLE_ANALYTICS_ID,
        }],
        ['script', {},
            "window.dataLayer = window.dataLayer || [];\n" +
            "function gtag(){dataLayer.push(arguments);}\n" +
            "gtag('js', new Date());\n" +
            "gtag('config', '" + process.env.GOOGLE_ANALYTICS_ID + "');",
        ]
    ],
    appearance: true,
    cleanUrls: true,
    lastUpdated: true, // https://vitepress.vuejs.org/guide/theme-last-updated
    markdown: {
        lineNumbers: true,
    },
    themeConfig: {
        // logo: '/logo.png',
        // siteTitle: false, // Hide the site title text
        nav: [ // https://vitepress.vuejs.org/guide/theme-nav
            {
                text: 'Blog',
                link: '/blog'
            },
            {
                text: 'Docs',
                link: '/docs/what-to-eat-demand-analysis'
            },
        ],
        outline: [2, 3],
        socialLinks: [
            {
                icon: {
                    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">' +
                        '<path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 ' +
                        '2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5l-8-5V6l8 5l8-5v2z"/>' +
                        '</svg>'
                },
                link: "mailto:henryhuang861219@gmail.com"
            },
            {
                icon: "github",
                link: "https://github.com/henryhuang1219"
            },
            {
                icon: "linkedin",
                link: "https://www.linkedin.com/in/henryhuang1219/"
            },
        ],
        sidebar: { // https://vitepress.vuejs.org/guide/theme-sidebar
            '/docs/': [
                {
                    text: 'WhatToEat',
                    items: [
                        {
                            text: 'Demand Analysis',
                            link: '/docs/what-to-eat-demand-analysis'
                        },
                        {
                            text: 'Requirement Specification',
                            link: '/docs/what-to-eat-requirement-specification'
                        },
                        {
                            text: 'DB',
                            link: '/docs/what-to-eat-db'
                        },
                        {
                            text: 'API',
                            link: '/docs/what-to-eat-api'
                        }
                    ]
                }
            ]
        },
        editLink: { // https://vitepress.vuejs.org/guide/theme-edit-link
            pattern: 'https://github.com/henryhuang1219/VitePress-Blog/edit/main/docs/:path',
            text: 'Edit this page on GitHub'
        },
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2022-Present Henry Huang'
        },
        algolia: {
            appId: process.env.ALGOLIA_APP_ID,
            apiKey: process.env.ALGOLIA_API_KEY,
            indexName: process.env.ALGOLIA_INDEX_NAME
        }
    },
    srcExclude: ["**/README.md"],
    transformHtml: (_, id, {pageData}) => {
        if (!/[\\/]404\.html$/.test(id)) links.push({
            url: pageData.relativePath.replace(/\.md$/, ''),
            lastmod: pageData.lastUpdated
        })
    },
    buildEnd: async ({ outDir }) => {
        const sitemap = new SitemapStream({
            hostname: siteHostName
        })
        const writeStream = createWriteStream(resolve(outDir, 'sitemap.xml'))
        sitemap.pipe(writeStream)
        links.forEach((link) => sitemap.write(link))
        sitemap.end()
        await new Promise((r) => writeStream.on('finish', r))
    },
}