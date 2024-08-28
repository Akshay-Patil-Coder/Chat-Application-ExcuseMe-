import { Link } from "react-router-dom";

export default function Navbar(){
    return(
        <div>
            <Link to='/home'>Home</Link><br></br>
            <Link to='/chat'>About</Link>
        </div>
    )

}