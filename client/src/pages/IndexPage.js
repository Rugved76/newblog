import Post from "../components/Post";
import { useEffect, useState } from "react";
import { url } from "../App";
import axios from 'axios'

export default function IndexPage() {

    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${url}/post`)
            setPosts(response.data);
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="ind">
            {posts.length > 0 && posts.map(post => (<Post {...post} />))}
        </div>
    );
}