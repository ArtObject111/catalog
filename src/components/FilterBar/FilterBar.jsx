import React from      "react";

import                 "./filter-bar.scss"
import { Field, reduxForm }   from "redux-form";
import { 
    FormControl, 
    createField }      from "../../common/FormControls/FormControls";

const Input = FormControl("input")
const optionElements = (goodsBrands) => goodsBrands.map(brand => {
    return <option
        className = {"brand"}
        // disabled  = {hideOptions(currencies.id)}
        value     = {brand}
        key       = {brand}>{brand}</option>
})


let FilterForm = (props) => {
    return(
        <form onSubmit={props.handleSubmit}>
            <div className="wrapper">
                <div className="filter__inner"><label>Название товара: </label>{createField("Поиск по названию", "product", null, Input, props.onClick)}</div>
                {/* <div className="filter__inner"><label>Бренд товара: </label>{createField("Поиск по бренду", "brand", null, "select", props.onClick)}</div> */}
                <div className="filter__inner">
                    <label>Бренд товара: </label>
                    <Field component="select" name="brand" onClick={props.onClick}>
                        {props.goodsBrands && optionElements(props.goodsBrands)}
                        <option className="select__header" value={""} hidden={true}>Выбрать бренд</option>
                    </Field>
                </div>
                <div className="filter__inner"><label>Цена товара: </label>{createField("Поиск по цене", "price", null, Input,props.onClick)}</div>
            </div>
            <button>Применить</button>
        </form>
    )
}

FilterForm = reduxForm({
    form: "filter"
})(FilterForm)


export const FilterBar = React.memo(({
    findGoods,
    resetForm,
    clearFilter,
    goodsBrands,
    isFiltered
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
            <FilterForm
                onSubmit    = {onAcceptFilter}
                onClick     = {onResetForm}
                goodsBrands = {goodsBrands}/>
            <div className="reset">
                <button disabled={!isFiltered} onClick={onClearFilter}>Сбросить фильтр</button>
            </div>
        </div>
    )
})
