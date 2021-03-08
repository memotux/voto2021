import React from 'react'

const Selector: React.FC<
  React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > & {
    options: { value: any; text: string }[] | string[]
  }
> = ({ options, ...selectProps }) => {
  return (
    <select {...selectProps}>
      {options.map((option: any) => {
        if (typeof option === 'string') {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          )
        }
        const { value, text } = option
        return (
          <option key={value} value={value}>
            {text}
          </option>
        )
      })}
    </select>
  )
}

export default Selector
