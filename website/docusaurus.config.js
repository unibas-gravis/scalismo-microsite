// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Scalismo',
  tagline: 'Scalable Image Analysis and Shape Modelling',
  url: 'https://scalismo.org',
  baseUrl: '/',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'unibas-gravis', // Usually your GitHub org/user name.
  projectName: 'scalismo-microsite', // Usually your repo name.
  staticDirectories: ['static'],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
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
          {
            to: 'onlinecourse',
            activeBasePath: 'onlinecourse',
            label: 'Online courses',
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
          {
            type: 'docsVersionDropdown',
            position: 'right',
  
            // Add additional dropdown items at the beginning/end of the dropdown.
            //dropdownItemsBefore: [],
            //dropdownItemsAfter: [{to: '/versions', label: 'All versions'}],
  
            // Do not add the link active class when browsing docs.
            dropdownActiveClassDisabled: true,
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
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
