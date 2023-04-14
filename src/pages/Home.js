import React from 'react'
import axios from "axios";
import '../App.css';
import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom'
import { AuthContext } from "../helper/AuthContext";
import { FiThumbsUp } from 'react-icons/fi';



function Home() {

    const [listOfPosts, setListOfPosts] = useState([]);
    const navigate = useNavigate();
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        axios
            .get("http://localhost:3001/posts")
            .then((response) => {
                setListOfPosts(response.data);
            });

    }, []);

    const likePost = (postId) => {

        axios.post("http://localhost:3001/likes",
            {
                PostId: postId

            },
            {
                withCredentials: true,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        )

            .then((response) => {
                setListOfPosts(
                    listOfPosts.map((post) => {

                        if (post.id === postId) {
                            if (response.data.liked) {
                                return { ...post, Likes: [...post.Likes, 0] };
                            } else {
                                if (!authState.username) {
                                    alert('user not logged in')
                                    navigate('/login')
                                } else {
                                    const likesArray = post.Likes;
                                    likesArray.pop();
                                    return { ...post, Likes: likesArray };
                                }
                            }
                        } else {
                            return post;
                        }

                    })
                );

            });

    }
    return (
        <div>
            {listOfPosts.map((value, key) => {
                return (
                    <>
                        <div className='section flex-c py-2'>

                            <div className='box box-w center' key={key}>
                                <div>
                                    <p className='subtitle is-4 pb-4'>
                                        <strong>
                                            {value.title}
                                        </strong>
                                    </p>
                                </div>
                                <div

                                    onClick={() => {
                                        navigate(`/posts/${value.id}`);
                                    }}
                                >
                                    <p className=' is-2 pb-6 hov'>
                                        {value.postText}
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        <label
                                            onClick={() => {
                                                navigate(`/profile/${value.UserId}`);
                                            }}
                                            className='float-l is-size-7 hov'>
                                            {value.username}
                                        </label>

                                        <label className='float-r pl-1'> {value.Likes.length}</label>



                                        <div className='float-r'>


                                            <FiThumbsUp
                                                onClick={() => {
                                                    likePost(value.id);
                                                }}

                                            />
                                        </div>

                                    </p>
                                </div>
                            </div>

                        </div>
                    </>
                );
            })}
        </div>
    )
}

export default Home
