import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({ _id, title, summary, cover, content, createdAt, author }) {

    return (
        <div className="post">
            <div className="image">
                <Link to={`/post/${_id}`}>
                    <img className='thumbnail' src={'http://localhost:4000/' + cover} alt="" />
                </Link>
            </div>
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
            <div style={{color:'#d5504d'}}>_________________________________________________________</div>
        </div>
    );
}