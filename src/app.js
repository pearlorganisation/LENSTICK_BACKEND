import express from  "express";
import morgan from "morgan";
import notFound from "./common/middleware/notFound.js";
import errorHandler from "./common/middleware/errorHandler.js";
import successResponse from "./common/utils/sucessResponse.js";
import cookieParser from "cookie-parser"
import corsConfig from "./config/corsConfig.js";
import routes from "./routes.js"


const app = express();


app.use(morgan("dev"));
app.use(corsConfig)
app.use(express.json());
app.use(cookieParser());


app.use("/api/v1",routes);

app.get("/",(req,res) => {
    successResponse(res,{},"API IS WOKING")
})



app.use(notFound);
app.use(errorHandler)


export default app;

