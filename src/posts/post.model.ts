import * as mongoose from 'mongoose';
import Post from './post.interfaces';
const postSchema = new mongoose.Schema({
	author: String,
	content: String,
	title: String,
});
const PostModel = mongoose.model<Post & mongoose.Document>('Post', postSchema);
export default PostModel;
// the model is responsible for managing the date of the application and represents its structure.
// An instance of a model is called a document.
