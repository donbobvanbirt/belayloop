import React, { PropTypes } from 'react';

import PostModal from './PostModal';
import PostList from './PostList';

const Posts = (props) => {
  const {
    id,
    name,
    city,
    state,
    createNewPost,
    posts,
    submitMessage,
    user,
    joinPost,
  } = props;

  return (
    <div>
      <h2>Climbing requests:</h2>
      <PostModal
        id={id}
        name={name}
        city={city}
        state={state}
        submit={createNewPost}
      />
      <PostList posts={posts} submitMessage={submitMessage} user={user} joinPost={joinPost} />
    </div>
  );
};

Posts.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
  createNewPost: PropTypes.func,
  posts: PropTypes.object,
  user: PropTypes.object,
  submitMessage: PropTypes.func,
  joinPost: PropTypes.func,
};

export default Posts;
