/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: {
    Setup: [
      `Setup/ide`,
      `Setup/vscode`
    ],
    Tutorials: [
      `Tutorials/tutorial01`,
      `Tutorials/tutorial02`,
      `Tutorials/tutorial03`,
      `Tutorials/tutorial04`,
      `Tutorials/tutorial05`,
      `Tutorials/tutorial06`,
      `Tutorials/tutorial07`,
      `Tutorials/tutorial08`,
      `Tutorials/tutorial09`,
      `Tutorials/tutorial10`,
      `Tutorials/tutorial11`,
      `Tutorials/tutorial12`,
      `Tutorials/tutorial13`,
      `Tutorials/tutorial14`,
      `Tutorials/tutorial15`
    ],

    Others: ['scalismo-ui-introduction'],
  },
};

module.exports = sidebars;
