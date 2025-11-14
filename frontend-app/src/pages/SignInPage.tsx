    import { useContext, useState } from "react";
    import { Link, useNavigate } from "react-router-dom";
    import { checkEmailFormat } from "../utils/helpers";
    import { toast } from "react-toastify";
    import apiCall from "../utils/axios";
    import { UserContext } from "../context/UserContext";

    const SignInPage = () => {
        const navigate = useNavigate();
        const userContext = useContext(UserContext);
        const {setToken, setUser} = userContext!;
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [email, setEmail] = useState<string | null>(null);
        const [password, setPassword] = useState<string | null>(null);

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            try {
                if(email && !checkEmailFormat(email)){
                    toast.error("Please enter valid email address.");
                    return;
                }
            const apiPayload: any = {};
            if (email) apiPayload.email = email;
            if (password) apiPayload.password = password;

            if(Object.keys(apiPayload).length === 0) {
                toast.error("Please fill in at least one field to sign in.");
                return;
            }
            setIsLoading(true);
            const response = await apiCall.post("/auth/sign-in", apiPayload);
            const { message, status } = response.data;
            if(status !== true) {
                toast.error(message || "Sign in failed. Please try again.");
                return;
            }
            setEmail("");
            setPassword("");
            toast.success(message || "Sign In Successfully!");
            const navigateTo = response.data.userData.role === "admin" ? "/admin" : "/user";
            navigate(navigateTo);
            setToken(response.data.token);
            setUser(response.data.userData);
            return;

            } catch (error:any) {
                if(error.response.data){
                    const { message } = error.response.data;
                    toast.error(message || "Sign in failed. Please try again.");
                } else {
                    toast.error("An error occurred during sign in. Please try again.");
                }
                console.error("[Sign in] error:",error);
                return;
            } finally {
                setIsLoading(false);
            }
    };

    return (
        <section className="signin-page my-5">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 mx-auto">
                        <h2 className="mb-4">Sign In</h2>
                        <div className="card">
                            <form onSubmit={handleSubmit} className="card-body">
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address*</label>
                                    <input type="email" className="form-control" id="email" placeholder="Enter your email" value={email || ""} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password*</label>
                                    <input type="password" className="form-control" id="password" placeholder="Enter your password" value={password || ""} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
                                </div>
                                <div className="mb-0 d-flex justify-content-between align-items-center">
                                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                        {isLoading ? "Signing in..." : "Sign In"}
                                    </button>
                                    <Link to="/signup" className={`btn btn-link text-decoration-none ${isLoading ? "disabled" : ""}`}>Create New Account</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    };

    export default SignInPage;
