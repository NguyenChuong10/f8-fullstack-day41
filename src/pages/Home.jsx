import { Link } from "react-router";


function Home() {
    return(
        <div className="w-15 h-10 bg-amber-200 flex gap-10 items-center">
            <button><Link className="text-" to="/productmodal">product</Link></button>
        </div>
    );
}

export default Home;