import React from 'react';
import Select from './Select';

function Input(props) {
    const { isMultiple, values, handleChange } = props;

    let options = [];
    if (values) {
        options = values.map(v => {
            return {
                label: v.Label,
                value: v.Value
            }
        })
    }

    const onChange = (val) => {
        if (isMultiple) {
            setSelected(v => [...v, val]);
        } else {
            setSelected(val);
        }
    }

    React.useEffect(() => {
        handleChange(selected);
    }, [selected]);


    if (values && values.length > 0) {
        return (
            <Select options={options} onChange={onChange} />
        )
    }
    return (
        <input onChange={(e) => handleChange(e.target.value)} className={"w-full focus:outline-none p-1 dark:bg-gray-700 text-gray-900 dark:text-gray-100"} type="text"></input>
    )
}

function Section(props) {
    const { label, isMultiple, values, field, handleChange } = props;

    const onChange = (val) => {
        if (val) {
            handleChange(field, val);
        }
    }

    return (
        <div className={"w-full"}>
            <label>{label}</label>
            <div className={"w-full bg-gray-200 dark:bg-gray-700 rounded p-1"}>
                <Input handleChange={onChange} isMultiple={isMultiple} values={values} />
            </div>
        </div>
    )
}

function Filter(props) {
    const { filters, onFilter } = props;
    const [toFilter, setToFilter] = React.useState({})

    const handleChange = (key, val) => {
        let obj = Object.assign({}, toFilter);
        obj[key] = val;
        setToFilter(obj);
        console.log(obj)
    }

    return (
        <div className={"p-2"}>
            <div className={"shadow w-full p-4 rounded-t lg:rounded mb-0 lg:mb-2 mx-auto inset-x-0 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-50 mx-2"}>
                <div className={"w-full flex flex-col justify-between border-b border-gray-10 dark:border-gray-900 mb-2"}>
                    <div className={"w-full flex justify-between border-b border-gray-10 dark:border-gray-900 mb-2"}>
                        <h1>Filters</h1>
                    </div>
                    {filters && filters.map(f => (
                        <Section handleChange={handleChange} label={f.Label} isMultiple={f.IsMultiple} values={f.Values} field={f.Field} />
                    ))}
                    <button onClick={(e) => onFilter(toFilter)}>Search</button>
                </div>
            </div>
        </div>
    )
}

export default Filter;