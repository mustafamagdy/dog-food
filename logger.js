// Shared Pino logger for the Todos API.
//
// Each log call emits a single structured JSON line. We disable Pino's default
// `base` fields (pid/hostname) and the automatic timestamp so every request-log
// line carries only the fields we set (plus Pino's standard `level`), keeping
// the one-line-per-request output minimal and predictable.
//
// `createLogger(stream)` accepts a destination stream so tests can capture output
// synchronously in memory (Pino writes synchronously to a plain Writable, unlike
// its default async stdout destination). When omitted it writes to stdout.

const pino = require('pino');

const baseOptions = {
  level: process.env.LOG_LEVEL || 'info',
  base: null,
  timestamp: false,
};

function createLogger(stream) {
  return pino(baseOptions, stream || process.stdout);
}

// Default singleton used by the running server.
const logger = createLogger();

module.exports = { logger, createLogger };
