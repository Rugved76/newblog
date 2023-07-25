import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import { url } from "../App";

export default function Post({ _id, title, summary, cover, content, createdAt, author }) {

    return (
        <div>
            <div className="post">
                {/* <div className="image">
                <Link to={`/post/${_id}`}>
                    <img className='thumbnail' src={`${url}/` + cover} alt="" />
                </Link>
            </div> */}
                <div className="texts">
                    <Link to={`/post/${_id}`}>
                        <h2 style={{ color: '#d5504d' }}>{title}</h2>
                    </Link>
                    <p style={{ color: '#d5504d' }} className="info">
                        <a className="author">By {author.username}</a> posted on
                        <time>{formatISO9075(new Date(createdAt))}</time>
                    </p>
                    <p className="summary" style={{ color: '#d5504d' }}>{summary}</p>
                </div>
            </div>
            {/* <div style={{marginBottom:'1rem',color:'#c73866'}}>_____________________________________________________________________</div> */}
        </div>
    );
}