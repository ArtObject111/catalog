import React     from "react";

import preloader from "../../assets/vector/puff.svg";

export const Preloader = () => {
    return <div className="preloader-warpper">
        <img alt = "Preloader svg" src={preloader}/>
    </div>
}
