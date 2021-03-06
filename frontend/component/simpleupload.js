
import React, {useRef} from 'react';
import {Button} from 'primereact/button';


export function SimpleUpload(props){

    const input = useRef();

    return (
        <React.Fragment>
            <Button icon={props.icon}
                    label={props.label}
                    onClick={e=>{e.preventDefault(); input.current.click()}}
                    disabled={props.disabled ? true : false}/>
            <input ref={input}
                    style={{display:"none"}}
                    type='file'
                    multiple={props.multiple ? true : false}
                    required={props.required ? true : false}
                    accept={props.media}
                    onChange={e=>{
                        const files = e.target.files;
                        if(props.onChange)
                            props.onChange(files);
                    }}/>
        </React.Fragment>
    )
}