import React from 'react'

export function SelectBranch({name, data = [{name: 'master'}], onChange, value = 'master'}) {
    return (
        <div className="form-group">
            <label htmlFor={name}>Branch</label>
            <select name={name} id={name} className="form-control" onChange={(e) => onChange(e.target.value)} value={value}>
                {data.map((item, index) => (
                    <option key={index} value={item.name}>{item.name}</option>
                ))}
            </select>
        </div>
    )
}