import { Link } from "react-router-dom";
export default function Login(){
    return(
        <div className="text-white">
            <div className="container-fluid">
                <div className="row">
                    <div className="bg-object bg-object1"></div>
                    <div className="bg-object bg-object2"></div>
                    <div className="bg-object bg-object3"></div>
                    <p className="text-dark-orange col-lg-12 text-center pt-5">
                        <span className="display-1 text-white">
                            React
                        </span>
                        <span className="display-3 px-5 align-middle text-white">
                            •
                        </span>
                        <span className="display-1">
                            Daily
                        </span>
                    </p>
                    <p className="col-lg-12 text-center text-secondary h3">
                        Enter your Username & Password to sign in.
                    </p>
                   <form className="col-lg-6 mx-auto mt-4 p-0">
                        <input type="text" placeholder="Username" className="login-form-input" /> <br/>
                        <input type="password" placeholder="Password" className="login-form-input" />
                   </form>
                    <div className="col-lg-12 text-center mt-5">
                        <Link to="/todos" className="btn btn-outline-dark-orange px-5 btn-lg">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}