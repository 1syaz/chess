import server from "./app";
import config from "./config/config";
import { connectDb } from "./config/connectDb";

connectDb()
  .then(() => {
    server.listen(config.PORT, () => {
      console.log(`Example app listening on port ${config.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Mongodb connection failure", error);
  });
