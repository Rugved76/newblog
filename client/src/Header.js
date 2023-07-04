import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { url } from "./App";

export default function Header() {
    const { setUserInfo, userInfo } = useContext(UserContext);
    useEffect(() => {
        fetch(`${url}/profile`, {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, []);

    function logout() {
        fetch(`${url}/logout`, {
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
                        <Link  className="navitem" to="/create">Create</Link> |
                        <a className='navitem' onClick={logout}>Logout</a>
                        <a style={{backgroundColor:'#c73866',padding:'0 0.5rem 0 0.5rem',borderRadius:'2px'}}> @{username}</a>
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