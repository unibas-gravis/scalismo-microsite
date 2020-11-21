const math = require('remark-math')
const katex = require('rehype-katex');

module.exports = {
  title: 'Scalismo',
  tagline: 'Scalable Image Analysis and Shape Modelling',
  url: 'https://scalismo.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',
  organizationName: 'unibas-gravis', // Usually your GitHub org/user name.
  projectName: 'Scalismo', // Usually your repo name.
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X',
      crossorigin: 'anonymous',
    },
  ],
  themeConfig: {

    colorMode: {
      // "light" | "dark"
      defaultMode: 'light',

      // Hides the switch in the navbar
      // Useful if you want to support a single color mode
      disableSwitch: true
    },
    navbar: {
      title: 'Scalismo',
      logo: {
        alt: 'Scalismo',
        src: 'img/logo.png',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/unibas-gravis/scalismo',
          label: 'GitHub',
          position: 'right',
        },
        {
          to: 'support',
          label: 'Support',
          position: 'left',
        },
        {
          to: 'about',
          activeBasePath: 'about',
          label: 'About',
          position: 'left',
        },

      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [

            {
              label: 'Tutorial',
              to: 'docs/',
            },
            {
              label: 'API-Doc',
              to: 'http://unibas-gravis.github.io/scalismo/latest/api/index.html',
            }
            /*
            {
              label: 'Second Doc',
              to: 'docs/doc2/',
            },*/
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Forum',
              href: 'https://groups.google.com/g/scalismo',
            },
            {
              label: 'Gitter-Chat',
              href:  'https://gitter.im/unibas-gravis/scalismo'
            }
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/unibas-gravis/scalismo',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} University of Basel. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          remarkPlugins: [math],
          rehypePlugins: [katex],
          editUrl:
            'https://github.com/unibas-gravis/scalismo-microsite/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/unibas-gravis/scalismo-microsite/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
