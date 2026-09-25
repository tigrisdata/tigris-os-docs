// Stands in for `node:zlib` in just-bash's browser build, which imports
// gzipSync, gunzipSync and three level constants, for gzip, gunzip, zcat and
// `rg -z`. fflate does the work. This is an ES module so that webpack keeps
// only the parts of fflate it uses.
import { Gunzip, gzipSync as deflateGzip } from "fflate";

export const constants = {
  Z_BEST_SPEED: 1,
  Z_BEST_COMPRESSION: 9,
  Z_DEFAULT_COMPRESSION: -1,
};

// Node's message when the output passes `maxOutputLength`
function tooLarge(limit) {
  return new RangeError(`Cannot create a Buffer larger than ${limit} bytes`);
}

function concat(chunks, size) {
  const out = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

export function gzipSync(
  data,
  { level = -1, maxOutputLength = Infinity } = {},
) {
  // zlib's default level is 6; fflate takes only 0-9
  const out = deflateGzip(data, { level: level < 0 ? 6 : level });
  if (out.length > maxOutputLength) throw tooLarge(maxOutputLength);
  return out;
}

export function gunzipSync(data, { maxOutputLength = Infinity } = {}) {
  // Stream, so a small file that inflates past the limit stops early
  const chunks = [];
  let size = 0;
  const gunzip = new Gunzip((chunk) => {
    size += chunk.length;
    if (size > maxOutputLength) throw tooLarge(maxOutputLength);
    chunks.push(chunk);
  });
  gunzip.push(data, true);
  return concat(chunks, size);
}
