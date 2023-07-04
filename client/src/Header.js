import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import './blog.png' 

export default function Header() {
    const { setUserInfo, userInfo } = useContext(UserContext);
    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, []);

    function logout() {
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST',
        });
        setUserInfo(null);
    }

    const username = userInfo?.username;

    return (
        <header>
            <Link to="/" className="logo">Blog</Link>
            <nav>
                {username && (
                    <>
                        <a> Welcome <span>{username}</span></a>
                        <Link  className="navitem" to="/create">Create</Link>
                        <a className='navitem' onClick={logout}>Logout</a>
                    </>
                )}
                {!username && (
                    <>
                        <Link className="navitem" to="/login">Login</Link> |
                        <Link className="navitem" to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}