import React from 'react';

function Select(props) {
    const { isMulti, label, options, onChange } = props;
    const [selected, setSelected] = React.useState(isMulti ? {} : null);
    const [displayValue, setDisplayValue] = React.useState("");

    const selectRef = React.useRef();

    React.useEffect(() => {
        onChange(selected);
    }, [selected])

    const handleChange = (e) => {
        if (isMulti) {
            let opts = selectRef.current.options;
            for (let i = 0, len =opts.length; i < len; i++) {
                if(selected[opts[i]]) {
                    selected[opts[i]] = false
                } else {
                    selected[opts[i]] = true;
                }
            }
            let values = [];
            Object.keys(selected).map(key => {
                if (selected[key]) {
                    values.push(key);
                }
            })
            setSelected(values);
        } else {
            
        }
    }

    return (
        <div>
            <label className={"w-full"}>{label}</label>
            <select ref={selectRef} className={"w-full"} onChange={handleChange}>
                {options.map((opt, i) => (
                    <option className={"bg-gray-100"} key={i} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    )
}

export default Select;