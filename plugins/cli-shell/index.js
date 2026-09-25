// Bundler settings for @tigrisdata/cli-shell (src/components/CliShell).
module.exports = function cliShellPlugin() {
  return {
    name: "cli-shell",
    configureWebpack(config, isServer, { currentBundler }) {
      if (isServer) {
        // The shell only runs in the browser: the component imports it in an
        // effect. The server bundle resolves under `require`, which the
        // package's `import`-only exports map rejects, so give it nothing.
        return { resolve: { alias: { "@tigrisdata/cli-shell$": false } } };
      }
      // just-bash's browser build imports `node:zlib` for gzip/gunzip/zcat.
      // Webpack cannot read `node:` URIs and an alias does not catch them, so
      // swap the import for a browser version before resolution.
      return {
        plugins: [
          new currentBundler.instance.NormalModuleReplacementPlugin(
            /^node:zlib$/,
            require.resolve("./zlib-shim.mjs"),
          ),
        ],
      };
    },
  };
};
