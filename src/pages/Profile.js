import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../helper/AuthContext";
import { FiThumbsUp } from 'react-icons/fi';
import axios from "axios";
import 'bulma/css/bulma.css'
import '../App.css';


function Profile() {


    let { id } = useParams();
    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [listOfPosts, setListOfPosts] = useState([]);
    const { authState } = useContext(AuthContext);


    useEffect(() => {
        axios.get(`https://connect-203.herokuapp.com/auth/profile/${id}`, { credentials: true }).then((response) => {
            setUsername(response.data.username);
        });

        axios.get(`https://connect-203.herokuapp.com/posts/byuserId/${id}`).then((response) => {
            setListOfPosts(response.data);
        });
    }, []);

    const likePost = (postId) => {

        axios.post("https://connect-203.herokuapp.com/likes",
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
            <div className="flex-c title">
                <h1 className="is-underlined">{`${username}'s profile`}</h1>
            </div>
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
                                    <p className=' is-2 pb-6'>
                                        {value.postText}
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        <label className='float-l is-size-7'>
                                            {`posted by ${value.username}`}{" "}
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
    );
}

export default Profile;