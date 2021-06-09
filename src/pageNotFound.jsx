import { Link } from "react-router-dom"
export default function PageNotFound(){
    return(
        <div className="text-white">
            <div className="container-fluid">
                <div className="row mt-5 pt-5">
                    <div className="bg-object bg-object3"></div>
                    <div className="bg-object bg-object4"></div>
                    <div className="col-lg-12 text-center">
                        <p className="four-o-four">
                            404
                        </p>
                        <p className="pageNotFound mt-2 mb-5">
                            Page Not Found
                        </p>
                        <Link to="/todos" className="btn btn-lg btn-outline-dark-orange">
                            Todos Page
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}