import React, {Component} from 'react';

import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {Calendar} from 'primereact/calendar'
import {Button} from 'primereact/button';
import {SimpleUpload} from '../component/simpleupload';

export class ContactForm extends Component{

    constructor(props){
        super(props);
        this.state = this.props.data;
        this.state.editable = this.props.editable;
        this.state.visible = false;
        this.profile = null;
        this.img = React.createRef();
        this.form = React.createRef();
    }

    parseSubmit(e){
        e.preventDefault();
        let fd = new FormData(this.form.current);
        fd.set('birthdate', fd.get('birthdate').replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1") );
        if(this.profile) fd.append('picture', this.profile);
        if(this.props.submitHandler) this.props.submitHandler(fd);
        this.hide();
    }

    getBDate(dateStr){
        //Return date with from yyyyy-mm-dd string
        let bdate = String(dateStr).split("-");
        let date = new Date(parseInt(bdate[0]), parseInt(bdate[1]) - 1, parseInt(bdate[2]));
        return date;
    }

    show(){
        let state = this.props.data;
        state.visible = true;
        this.setState(state);
    }

    hide(){
        this.setState({visible:false});
        this.profile = null;
    }

    setImg(files){
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            this.img.current.setAttribute("src", reader.result);
            this.profile = files[0];
          }, false);
        reader.readAsDataURL(files[0]);;
    }

    render(){
        const inputStyle = {width:"25vw"};
        const mandatoryMark = <span style={{color:'red'}}>*</span>
        if(!(this.state.birthdate instanceof Date)) this.setState({birthdate:this.getBDate(this.state.birthdate)});
        return (
            <React.Fragment>
                <Button icon={this.props.buttonIcon} label={this.props.buttonLabel} onClick={()=> this.show()}/>
                <Dialog visible={this.state.visible} header={<h5>{this.props.header}</h5>} onHide={this.hide.bind(this)}>
                    <form ref={this.form} style={{padding:'1vw'}} onSubmit={e=>this.parseSubmit(e)}>
                        <div className='p-d-flex p-flex-column  p-ai-center input-spacing' style={{width:'30vw'}}>
                            <div className='input-spacing p-d-flex p-flex-column p-ai-center' style={{width:"100%"}}>
                                <img ref={this.img} src={this.profile ? this.setImg([this.profile]) : this.state.picture} style={{width:'15vw', height:'15vw', objectFit:'cover'}}/>
                                {this.state.editable ? 
                                    <SimpleUpload icon='pi pi-image'
                                                    label='Set profile'
                                                    media='image/*'
                                                    onChange={this.setImg.bind(this)}/> : null}
                            </div>
                            <div>
                                <h4>First Name {this.state.editable ? mandatoryMark : null}</h4>
                                <InputText name='first_name'
                                            value={this.state.first_name}
                                            onChange={(e)=>{ this.setState({first_name:e.value}) }}
                                            style={inputStyle}
                                            required
                                            disabled={!this.state.editable}/>
                            </div>
                            <div>
                                <h4>Last Name</h4>
                                <InputText name='last_name' 
                                            value={this.state.last_name}
                                            onChange={(e)=>{ this.setState({last_name:e.value}) }}
                                            style={inputStyle}
                                            disabled={!this.state.editable}/>
                            </div>
                            <div>
                                <h4>Birthday {this.state.editable ? mandatoryMark : null}</h4>
                                <Calendar name="birthdate"
                                            dateFormat="dd-mm-yy"
                                            value={this.state.birthdate}
                                            onChange={(e) => this.setState({bithdate:e.value})}
                                            monthNavigator 
                                            yearNavigator yearRange="1970:2020" showIcon
                                            style={inputStyle}
                                            touchUI
                                            autoZIndex={Boolean(0)}
                                            required
                                            disabled={!this.state.editable}/>
                            </div>
                            <div>
                                <h4>Email {this.state.editable ? mandatoryMark : null}</h4>
                                <InputText name='email'
                                            value={this.state.email}
                                            onChange={(e)=>{ this.setState({email:e.value}) }}
                                            style={inputStyle}
                                            required
                                            disabled={!this.state.editable}/>
                            </div>
                            <div>
                                <h4>Phone Number {this.state.editable ? mandatoryMark : null}</h4>
                                <InputText name='phone_number'
                                            value={this.state.phone_number}
                                            onChange={(e)=>{ this.setState({phone_number:e.value}) }}
                                            keyfilter={/[\d\+]/}
                                            style={inputStyle}
                                            required
                                            disabled={!this.state.editable}/>
                            </div>
                            <Button type="submit" label="Save" style={{width:"15vw"}}/>
                        </div>
                    </form>
                </Dialog>
            </React.Fragment>
        )
    }

}