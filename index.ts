import RouterConfig from "./src/routes";
import Server from "./src/server";
let server  = new Server(4200)
server.useRoutes(RouterConfig)
server.start()
