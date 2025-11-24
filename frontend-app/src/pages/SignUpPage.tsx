import { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiCall from "../utils/axios";
import { checkEmailFormat } from "../utils/helpers";
import { UserContext } from "../context/UserContext";

const SignUpPage = () => {
    const navigate = useNavigate();
    const userContext = useContext(UserContext);
    const { user } = userContext!;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [user_name, setUser_name] = useState<string | null>("");
    const [email, setEmail] = useState<string | null>("");
    const [password, setPassword] = useState<string | null>("");
    const [first_name, setFirst_name] = useState<string | null>("");
    const [last_name, setLast_name] = useState<string | null>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const apiPayload: any = {};
            if (user_name) apiPayload.user_name = user_name;
            if (email) apiPayload.email = email;
            if (password) apiPayload.password = password;
            if (first_name) apiPayload.first_name = first_name;
            if (last_name) apiPayload.last_name = last_name;

            if (email && !checkEmailFormat(email)) {
                toast.error("Please enter a valid email address.");
                return;
            }

            if (Object.keys(apiPayload).length === 0) {
                toast.error("Please fill in at least one field to sign up.");
                return;
            }

            setIsLoading(true);
            const response = await apiCall.post(`/auth/sign-up`, apiPayload);
            const { message, status } = response.data;
            if (status !== true) {
                toast.error(message || "Sign up failed. Please try again.");
                return;
            }
            setUser_name("");
            setEmail("");
            setPassword("");
            setFirst_name("");
            setLast_name("");
            toast.success(message || "Sign up successful! You can now sign in.");
            navigate("/signin");
            return;
        } catch (error) {
            toast.error("An error occurred during sign up. Please try again.");
            console.error("[Sign up] error:", error);
            return;
        } finally {
            setIsLoading(false);
        }
    }

    if (user) {
        const roleBasedPath = user.role === 'admin' ? '/admin' : '/user';
        return <Navigate to={roleBasedPath} />;
    }

    return (
        <section className="signin-page my-5">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 mx-auto">
                        <h2 className="mb-4">Sign Up</h2>
                        <div className="card">
                            <form onSubmit={handleSubmit} className="card-body">
                                <div className="d-flex justify-content-between align-items-center gap-3">
                                    <div className="mb-3">
                                        <label htmlFor="user_name" className="form-label">Username*</label>
                                        <input type="text" className="form-control" id="user_name" placeholder="Enter your username" value={user_name || ""} onChange={(e) => setUser_name(e.target.value)} required disabled={isLoading} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email address*</label>
                                        <input type="email" className="form-control" id="email" placeholder="Enter your email" value={email || ""} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center gap-3">
                                    <div className="mb-3">
                                        <label htmlFor="first_name" className="form-label">First Name</label>
                                        <input type="text" className="form-control" id="first_name" placeholder="Enter your first name" value={first_name || ""} onChange={(e) => setFirst_name(e.target.value)} disabled={isLoading} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="last_name" className="form-label">Last Name</label>
                                        <input type="text" className="form-control" id="last_name" placeholder="Enter your last name" value={last_name || ""} onChange={(e) => setLast_name(e.target.value)} disabled={isLoading} />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" className="form-control" id="password" placeholder="Enter your password" value={password || ""} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
                                </div>
                                <div className="mb-0 d-flex justify-content-between align-items-center">
                                    <button type="submit" className="btn btn-dark" disabled={isLoading}>
                                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                                    </button>
                                    <Link to="/signin" className={`btn btn-link text-decoration-none ${isLoading ? "disabled" : ""}`}>Already have an account?</Link>
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