import React from 'react'

export default Selector: React.FC<{options: {value: any, text: string}[] | string[]}> ({options, ...selectProps}) => {
    return (
        <select {...selectProps}>
            {options.map(
                ({value, text}) => {
                    return (
                        <option value={value}>{text}</option>
                    )
                }
            )}
        </select>
    )
}