// Stands in for `node:zlib` in just-bash's browser build, which imports only
// these three names. gzip/gunzip/zcat fail in the docs shell; nothing else
// touches them.
const unsupported = () => {
  throw new Error("zlib is not available in the browser shell");
};

module.exports = {
  constants: {},
  gzipSync: unsupported,
  gunzipSync: unsupported,
};
