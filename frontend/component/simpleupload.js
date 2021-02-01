
import React, {Component} from 'react';
import {Button} from 'primereact/button';


export class SimpleUpload extends Component{

    constructor(props){
        super(props);
        this.input = React.createRef();
    }

    render(){
        return (
            <React.Fragment>
                <Button icon={this.props.icon} 
                        label={this.props.label}
                        onClick={(e)=>{e.preventDefault();this.input.current.click()}}
                        disabled={this.props.disabled ? true : false}/>
                <input style={{display:"none"}} ref={this.input}
                        type='file'
                        multiple={this.props.multiple ? true : false}
                        accept={this.props.media}
                        onChange={(e)=>{
                            const files = e.target.files
                            this.props.onChange(files);
                        }}/>
            </React.Fragment>
        )
    }
}