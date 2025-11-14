import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiCall from "../utils/axios";
import { checkEmailFormat } from "../utils/helpers";

const SignUpPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [user_name, setUserName] = useState<string | null>("");
    const [email, setEmail] = useState<string | null>("");
    const [password, setPassword] = useState<string | null>("");
    const [first_name, setFirstName] = useState<string | null>("");
    const [last_name, setLastName] = useState<string | null>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const apiPayload: any = {};
            if(user_name) apiPayload.user_name = user_name;
            if(email) apiPayload.email = email;
            if(password) apiPayload.password = password;
            if(first_name) apiPayload.first_name = first_name;
            if(last_name) apiPayload.last_name = last_name;

            if(email && !checkEmailFormat(email)) {
                toast.error("Please enter valid email address.");
                return;
            }
            if(Object.keys(apiPayload).length === 0) {
                toast.error("Please fill in at least one field to sign up.");
                return;
            }
            setIsLoading(true);
            const response = await apiCall.post("/auth/sign-up", apiPayload);
            const { message, status } = response.data;
            if ( status !== true ) {
                toast.error(message || "Sign up failed. Please try again.");
                return;
            }
            setUserName("");
            setEmail("");
            setPassword("");
            setFirstName("");
            setLastName("");
            toast.success(message ||"Sign up successful! You can now sign in");
            navigate("/signin");
        } catch (error) {
            toast.error("An error occurred during sign up. Please try again.");
            console.error("[Sign up] error:", error);
            return;
        }finally{
            setIsLoading(false);
        }
    }
    return(
        <section className="signin-page my-5">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <h2 className="mb-4">Sign Up</h2>
                        <div className="card">
                            <form onSubmit={handleSubmit} className="card-body">
                                <div className="d-flex justify-content-between align-items-center gap-3">
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">Username*</label>
                                        <input type="text" className="form-control" id="username" placeholder="Enter your username" value={user_name || ""} onChange={(e) => setUserName(e.target.value)} required disabled={isLoading}  />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email address*</label>
                                        <input type="email" className="form-control" id="email" placeholder="Enter your email" value={email || ""} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading}  />
                                    </div>
                                </div>
                                    <div className="d-flex justify-content-between align-items-center gap-3">
                                        <div className="mb-3">
                                            <label htmlFor="first_name" className="form-label">First Name*</label>
                                            <input type="text" className="form-control" id="first_name" placeholder="Enter your first name" value={first_name || ""} onChange={(e) => setFirstName(e.target.value)} required disabled={isLoading}  />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="last_name" className="form-label">Last Name*</label>
                                            <input type="text" className="form-control" id="last_name" placeholder="Enter your last name" value={last_name || ""} onChange={(e) => setLastName(e.target.value)} required disabled={isLoading}  />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password*</label>
                                        <input type="password" className="form-control" id="password" placeholder="Enter your password" value={password || ""} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading}  />
                                    </div>
                                    <div className="mb-3">
                                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                            {isLoading ? "Signing up..." : "Sign Up"}
                                        </button>
                                        <Link to ="/signin" className={`btn btn-link text-decoration-none ${isLoading ? "disabled" : ""}`}>Already have an account?</Link>
                                    </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

};

export default SignUpPage;