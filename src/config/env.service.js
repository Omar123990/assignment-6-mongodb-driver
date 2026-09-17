import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(`./.env.${process.env.NODE_ENV}`) });

const port = process.env.PORT;
const databaseUri = process.env.DATABASE_URI;

export const env ={
    port,
    databaseUri
}
