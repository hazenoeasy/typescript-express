import App from './app';
import PostsController from './posts/post.controller';
import AuthenticationController from './authentication/authentication.controller';
import validateEnv from './utils/validateEnv';
import 'dotenv/config';
const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
validateEnv();
const app = new App([new PostsController(), new AuthenticationController()]);
app.listen();
