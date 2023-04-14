import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import '../App.css';
import 'bulma/css/bulma.css'
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helper/AuthContext";

function CreatePost() {
    const { authState } = useContext(AuthContext);

    let history = useNavigate();
    const initialValues = {
        title: "",
        postText: "",
        username: JSON.stringify(authState.username)
    };


    const validationSchema = Yup.object().shape({
        title: Yup.string().required("You must input a Title!"),
        postText: Yup.string().required(),
    });

    const onSubmit = (data) => {
        axios
            .post("https://connect-203.herokuapp.com/posts", data, {
                withCredentials: true,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                history("/");
            });
    };

    return (
        <div className="section flex-b">
            <div className="box width-cp">
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}
                >
                    <Form className="formContainer">
                        <div className="field mx-4">
                            <div className="control">

                                <label className="label">Title </label>

                                <ErrorMessage name="title" component="span" />
                                <Field className="input"
                                    autocomplete="off"
                                    id="inputCreatePost"
                                    name="title"
                                    placeholder="(Ex. Title...)"
                                />
                            </div>
                        </div>

                        <div className="my-6 field mx-4">

                            <label className="label">Post</label>

                            <div className="control" >
                                <ErrorMessage name="postText" component="span" />

                                <Field className="textarea tali p-0"
                                    autocomplete="off"
                                    id="inputCreatePost"
                                    name="postText"
                                    placeholder="(Ex. Post...)"
                                />
                            </div>

                        </div>
                        <div>
                            <button className=" mx-4 button is-link is-rounded" type="submit"> Create Post</button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
}

export default CreatePost;