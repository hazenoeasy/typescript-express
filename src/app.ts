import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import errorHandler from './middleware/error.middleware';
class App {
	public app: express.Application;

	constructor(controllers: Controller[]) {
		this.app = express();
		this.connectToTheDatabase();
		this.intializeMiddlewares();
		this.intializeControllers(controllers);
		this.intializeErrorhandling();
	}
	private intializeMiddlewares = () => {
		this.app.use(bodyParser.json());
		this.app.use(cookieParser());
	};
	private intializeControllers = (controllers: Controller[]) => {
		controllers.forEach((controller) => {
			this.app.use('/', controller.router);
		});
	};
	private intializeErrorhandling = () => {
		this.app.use(errorHandler);
	};
	public listen() {
		this.app.listen(process.env.PORT, () => {
			console.log(`app listening on the posts ${process.env.PORT}`);
		});
	}
	private connectToTheDatabase() {
		const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
		mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	}
}

export default App;
