import React from      "react";

import                 "./filter-bar.scss"
import { reduxForm }   from "redux-form";
import { 
    FormControl, 
    createField }      from "../../common/FormControls/FormControls";

const Input = FormControl("input")

// let FindByFieldForm = ({field, label, placeholder}) => {
//     return(
//         <form onSubmit={props.handleSubmit} className={`${field}__inner`}>
//             {/* <div>Название товара: <input type="text" /></div> */}
//             <div><label>{label} </label>{createField(placeholder, field, null, Input)}</div>
//             <button>Применить</button>
//         </form>
//     )
// }

let FindByNameForm = (props) => {
    return(
        <form onSubmit={props.handleSubmit} className="filter__inner">
            {/* <div>Название товара: <input type="text" /></div> */}
            <div><label>Название товара: </label>{createField("Поиск по названию", "product", null, Input)}</div>
            <button>Применить</button>
        </form>
    )
}

FindByNameForm = reduxForm({
    form: "filter"
})(FindByNameForm)


export const FilterBar = ({
    findGoods
}) => {

    const onAcceptFilter = (formData) => {
        debugger
        findGoods(formData.product)
    }

    const findByBrandForm = () => {
        <form className="filter__inner">
                <div>Бренд товара: <input type="text" /></div>
                <button>Применить</button>
        </form>
    }

    const findByPriceForm = () => {
        <form className="filter__inner">
                <div>Цена товара: <input type="text" /></div>
                <button>Применить</button>
        </form>
    }

    return (
        <div className="filter">
            <FindByNameForm onSubmit={onAcceptFilter}/>
            {/* <FindByFieldForm
                onSubmit={onAcceptFilter}
                field={"name"}
                label={""}
            /> */}
        </div>
    )
}