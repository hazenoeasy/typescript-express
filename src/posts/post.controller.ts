import * as express from 'express';
import Post from './post.interfaces';
import postModel from './post.model';
import PostException from '../exceptions/PostException';
class PostsController {
	public path: string = '/posts';
	public router = express.Router();
	private post = postModel;
	constructor() {
		this.intializeRoutes();
	}
	public intializeRoutes() {
		this.router.get(this.path, this.getAllPosts);
		this.router.get(`${this.path}/:id`, this.getPostById);
		this.router.patch(`${this.path}/:id`, this.modifyPost);
		this.router.delete(`${this.path}/:id`, this.deletePost);
		this.router.post(this.path, this.createPost);
	}
	private getAllPosts = (request: express.Request, response: express.Response) => {
		this.post.find().then((posts) => {
			response.send(posts);
		});
	};

	private getPostById = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const id = request.params.id;
		this.post
			.findById(id)
			.then((post) => response.send(post))
			.catch((err) => next(new PostException(id)));
	};

	private modifyPost = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const id = request.params.id;
		const postData: Post = request.body;
		this.post
			.findByIdAndUpdate(id, postData, { new: true })
			.then(function (post) {
				response.send(post);
			})
			.catch(function (err) {
				next(new PostException(id)); // 带参数的 根据函数重载  处理为err
			});
	};

	private createPost = (request: express.Request, response: express.Response) => {
		const postData: Post = request.body;
		console.log(postData);
		const createdPost = new this.post(postData);
		createdPost.save().then((savedPost) => {
			response.send(savedPost);
			console.log(savedPost);
		});
	};

	private deletePost = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const id = request.params.id;
		this.post
			.findByIdAndDelete(id)
			.then((successResponse) => {
				response.send(200);
			})
			.catch(function (err) {
				next(new PostException(id));
			});
	};
}
export default PostsController;
