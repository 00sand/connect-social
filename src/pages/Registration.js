import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import '../App.css';
import 'bulma/css/bulma.css'
import * as Yup from "yup";
import axios from "axios"; import { json, useNavigate } from "react-router-dom";
import { AuthContext } from "../helper/AuthContext";

function Registration() {
    const initialValues = {
        username: "",
        email: "",
        password: "",
    };
    const { setAuthState } = useContext(AuthContext);
    let history = useNavigate();

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required(),
        email: Yup.string().min(3).max(15).required(),
        password: Yup.string().min(4).max(20).required(),
    });

    const onSubmit = (data) => {
        axios.post("https://connect-203.herokuapp.com/auth", data, { withCredentials: true }).then((response) => {
            if (response.data.error) {
                alert(response.data.error);
            } else {
                console.log(response.data)
                setAuthState({
                    username: response.data.username,
                    id: response.data.id,
                    status: true,
                });
                history('/')

            }


        });
    };

    return (
        <>
            <div>

                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}
                >
                    <div className="section flex-c">
                        <div className="box width-login">
                            <Form>
                                <div className="field mx-4">
                                    <label className="label">Username:</label>
                                    <div className="control">

                                        <ErrorMessage name="username" component="span" />
                                        <Field className="input is-rounded"
                                            autocomplete="off"
                                            id="inputCreatePost"
                                            name="username"
                                            placeholder="(Ex. John123...)"
                                        />
                                    </div>
                                </div>

                                <div className="field mx-4">

                                    <label className="label">Email:</label>
                                    <div className="control">

                                        <ErrorMessage name="email" component="span" />
                                        <Field className="input is-rounded"
                                            autocomplete="off"
                                            type="email"
                                            id="inputCreatePost"
                                            name="email"
                                            placeholder="Your email..."
                                        />


                                    </div>
                                </div>

                                <div className="field mx-4">

                                    <label className="label">Password:</label>
                                    <div className="control">

                                        <ErrorMessage name="password" component="span" />
                                        <Field className="input is-rounded"
                                            autocomplete="off"
                                            type="password"
                                            id="inputCreatePost"
                                            name="password"
                                            placeholder="Your Password..."
                                        />


                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button className="mx-4 button is-link is-rounded" type="submit"> Register</button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </Formik>

            </div>
        </>
    );
}

export default Registration;


