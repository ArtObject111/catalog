import React from      "react";

import                 "./filter-bar.scss"
import { reduxForm }   from "redux-form";
import { 
    FormControl, 
    createField }      from "../../common/FormControls/FormControls";

const Input = FormControl("input")

let FilterForm = (props) => {
    return(
        <form onSubmit={props.handleSubmit}>
            <div className="wrapper">
                <div className="filter__inner"><label>Название товара: </label>{createField("Поиск по названию", "product", null, Input, props.onClick)}</div>
                <div className="filter__inner"><label>Бренд товара: </label>{createField("Поиск по бренду", "brand", null, Input, props.onClick)}</div>
                <div className="filter__inner"><label>Цена товара: </label>{createField("Поиск по цене", "price", null, Input,props.onClick)}</div>
            </div>
            <button>Применить</button>
        </form>
    )
}

FilterForm = reduxForm({
    form: "filter"
})(FilterForm)


export const FilterBar = ({
    findGoods,
    resetForm,
    clearFilter
}) => {

    const onAcceptFilter = (formData) => {
        let field = Object.keys(formData)[0]
        findGoods(formData[field])
    }

    const onResetForm = (e) => {
        e.target.value ==="" && resetForm()
    }

    const onClearFilter = () => {
        clearFilter()
    }

    return (
        <div className="filter">
            <FilterForm onSubmit={onAcceptFilter} onClick={onResetForm}/>
            <div className="reset">
                <button onClick={onClearFilter}>Сбросить фильтр</button>
            </div>
        </div>
    )
}
