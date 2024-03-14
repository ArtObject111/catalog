import React     from "react";

import           "./preloader.scss"
import preloader from "../../assets/vector/puff.svg";

export const Preloader = () => {
    return <div className="preloader-warpper">
        <img alt = "Preloader svg" src={preloader}/>
    </div>
}
