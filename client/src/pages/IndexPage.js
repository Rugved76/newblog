import Post from "../Post";
import { useEffect, useState } from "react";
import { url } from "../App";

export default function IndexPage() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${url}/post`).then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
  }, []);

  return (
    <div className="ind">
      {posts.length > 0 && posts.map(post => (<Post {...post} />))}
    </div>
  );
}
