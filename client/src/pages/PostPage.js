import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import { Link } from 'react-router-dom';
import { url } from "../App";

export default function PostPage() {
    const [postInfo, setPostInfo] = useState(null);
    const { userInfo } = useContext(UserContext);
    const { id } = useParams();
    useEffect(() => {
        fetch(`${url}/post/${id}`)
            .then(response => {
                response.json().then(postInfo => {
                    setPostInfo(postInfo);
                });
            });
    }, []);

    if (!postInfo) return '';

    return (
        <div style={{backgroundColor:'white',padding:'1rem',borderRadius:'1.5rem'}}className="post-page">

            <h1 style={{color:'#c73866'}}>{postInfo.title}</h1>
            <time>{formatISO9075(new Date(postInfo.createdAt))}</time>

            <div style={{color:'grey'}} className="author">by {postInfo.author.username}</div>

            {userInfo.id === postInfo.author._id && (
                <div className="edit-row">
                    <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                        Edit 
                    </Link>
                </div>
            )}
            <div style={{width:'90%',margin:'auto',background:'cover'}} className="image">
                <img src={`${url}/${postInfo.cover}`} alt="" />
            </div>
            <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
        </div>
    );
}