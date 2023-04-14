import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";
import { RxCrossCircled } from 'react-icons/rx';

function Post() {
    let { id } = useParams();
    const navigate = useNavigate();
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const { authState } = useContext(AuthContext);


    useEffect(() => {
        axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
            setPostObject(response.data);
        });

        axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
            setComments(response.data);

        });
    }, []);

    const addComment = () => {
        axios
            .post(
                "http://localhost:3001/comments",
                {
                    commentBody: newComment,
                    PostId: id,
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
                if (response.data.error) {
                    alert(response.data.error);
                    navigate('/login')
                } else {
                    const commentToAdd = { commentBody: newComment, username: response.data.username };
                    setComments([...comments, commentToAdd]);
                    setNewComment("");
                }
            });


    };

    const deletePost = (id) => {
        axios
            .delete(`http://localhost:3001/posts/${id}`, {
                withCredentials: true,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            .then(() => {
                navigate("/");
            });
    };

    const deleteComment = (id) => {
        axios
            .delete(`http://localhost:3001/comments/${id}`,
                {
                    withCredentials: true,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            )
            .then(() => {
                setComments(
                    comments.filter((val) => {
                        return val.id != id;
                    })
                );
            });
    };

    return (
        <>
            <div className="vh">
                <div className='section flex-c py-2'>

                    <div className='box box-w center'>
                        <div>
                            <p className='subtitle is-4 pb-4'>
                                <strong>
                                    {postObject.title}
                                </strong>
                            </p>
                        </div>
                        <div
                        >
                            <p className=' is-2 pb-6'>
                                {postObject.postText}
                            </p>
                        </div>
                        <div>
                            <p>
                                <label className='float-l is-size-7 hov'
                                    onClick={() => {
                                        navigate(`/profile/${postObject.UserId}`);
                                    }}>
                                    {`posted by ${postObject.username}`}{" "}
                                </label>

                                <label className="float-r">
                                    {authState.username === postObject.username && (
                                        <button className="button is-small is-danger"

                                            onClick={() => {
                                                deletePost(postObject.id);
                                            }}
                                        >
                                            {" "}
                                            Delete Post
                                        </button>
                                    )}
                                </label>

                            </p>
                        </div>


                    </div>

                </div>

                <div className="flex-c section mt-0 pt-0">

                    <div className="comment">
                        <div className="comment-w mb-3">
                            <input
                                className="input is-rounded"
                                type="text"
                                placeholder='comment..:'
                                autoComplete="off"
                                value={newComment}
                                onChange={(event) => {
                                    setNewComment(event.target.value);
                                }}
                            />

                        </div>
                        <div>
                            <button onClick={addComment} className="mx-4 button is-link is-rounded" >Post</button>
                        </div>
                    </div>





                    <div className="box box-w center clear-bg pt-2">
                        <div className="">
                            {comments.map((comment, key) => {
                                return (
                                    <div key={key} className="my-1 box mt-3 mb-3"
                                    >
                                        {`${comment.commentBody} - ${comment.username}`}
                                        {authState.username === comment.username && (
                                            <label className="ml-1">
                                                <button className="button is-small is-danger p-1"
                                                    onClick={() => {
                                                        deleteComment(comment.id);
                                                    }}
                                                >
                                                    X
                                                </button>
                                            </label>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>

            </div>

        </>
    )
};

export default Post;






