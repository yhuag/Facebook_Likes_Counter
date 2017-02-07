var FB = require('fb');

ACCESS_TOKEN = "YOUR TOKEN!";

// Get My info

FB.api('/me', function (res) {
  if(!res || res.error) {
   console.log(!res ? 'error occurred' : res.error);
   return;
  }
  //console.log(res.id);
  console.log("User Name: "+ res.name);
}, {access_token: ACCESS_TOKEN});


/*
function printLikes(post){
	console.log(JSON.stringify(post.likes.data.length));
}
*/

// Get my friends
/*
FB.api('/me/posts?limit=2', function (res) {
  if(!res || res.error) {
   console.log(!res ? 'error occurred' : res.error);
   return;
  }

  var posts = res.data;

  posts.forEach(function(post){
  	printLikes(post);
  });

}, {access_token: ACCESS_TOKEN});
*/

// Set up the number of posts to be retrieved
var POSTS_NUM_LIMIT = "225";  // Should be string

var total_likes_count = 0;
var total_comments_count = 0;
var total_posts_count = 0;

var actual_posts_get_count = 0;

// count the number of likes & comments for a post
function postHandler(post){
	var likes = 0;
	var comments = 0;
	try {
		likes = post.likes.summary.total_count;
	} catch (err) {
		likes = 0;
	}

	try {
		comments = post.comments.summary.total_count;
	} catch (err) {
		comments = 0;
	}
	//console.log(likes);
	total_likes_count = total_likes_count + likes;
	total_comments_count = total_comments_count + comments;


	total_posts_count = total_posts_count + 1;

	if(total_posts_count == actual_posts_get_count){
		resultComputation(total_likes_count, total_comments_count, total_posts_count);
	}
}


// Retrieve likes & comments for a post given its post_id
function postIdHandler(postId){
	FB.api(postId + '?fields=likes.summary(true),comments.summary(true)', function(res) {

		postHandler(res);

	}, {access_token: ACCESS_TOKEN});
}

// Print out the results
function resultComputation(likes, comments, numOfPosts){
	console.log("There are "+ numOfPosts +" posts processed.");
	console.log("Total Likes: "+ likes);
	var averageLikes = likes/numOfPosts;
	console.log("Average Likes per Post: "+ averageLikes.toFixed(2));
	console.log("Total Comments: "+ comments);
	var averageComments = comments/numOfPosts;
	console.log("Average Comments per Post: "+ averageComments.toFixed(2));
}





// Get all posts, and get their post_id
FB.api('/me/posts?limit=' + POSTS_NUM_LIMIT, function(res) {

	// The POSTS_NUM_LIMIT will always larger than actual_posts_get_count
	actual_posts_get_count = res.data.length;
  	
	res.data.forEach(function(post){
		postIdHandler(post.id)
	});
	
}, {access_token: ACCESS_TOKEN});
