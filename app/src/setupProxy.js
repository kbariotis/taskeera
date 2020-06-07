const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://api:3000",
      pathRewrite: {
        "^/api": "",
      },
    }),
  )
  app.use(
    createProxyMiddleware("/socket-io", {
      target: "http://api:3000",
      ws: true,
      logLevel: "debug",
    }),
  )
}
