
/**
 * Created by slashhuang on 16/5/10.
 */
import React, { Component ,PropTypes} from 'react';
import {render} from 'react/lib/ReactDOM';
require('./public.less');
import {DropDownMenu, DropDownSelect,DropDownSuggestion} from "../../src/index.js";//联想功能组件
export default class IndexModule extends Component {
    constructor(props,context){
        super(props,context);
    }
    render(){
        var bu = [
            {id: 1,name: "交易后台"},
            {id: 2,name: "结婚1"}];
        let menuData=[
            { data:'近一个周的问题',callback:()=>{alert('clicked')}},
            { data:'近一个月的问题',callback:()=>{alert('clicked')}},
            { data:'一个月之前的问题',callback:()=>{alert('clicked')}}];

        return (
            <div className="paddingSpace">

                <div style={{fontSize:'12px',display:'inline-block',width:'200px'}}>
                    <DropDownMenu  dropDownData={menuData} title='单层下拉列表'/>
                </div>
                <div style={{fontSize:'12px',display:'inline-block',width:'200px'}}>
                    <DropDownSelect  dropDownData={bu} title='下拉选择框' ref="DropDownSelect"/>
                </div>
                <div style={{fontSize:'12px',display:'inline-block',width:'200px',verticalAlign:'top'}}>
                    <DropDownSuggestion url={'/package.json'} placeHolder='下拉联想框' ref="DropDownSuggestion"/>
                </div>
                <div className='demo-button-container'>
                    <div className='demo-button' style={{background:'yellow'}} onClick={()=>{this.getDropDownData("DropDownSelect")}}>点击获得下拉选择框的选择数据</div>
                    <div className='demo-button' style={{background:'blue'}} onClick={()=>{this.getDropDownData('DropDownSuggestion')}}>点击获取下拉联想框的选择数据</div>
                </div>
            </div>
        );
    }
    getDropDownData(type){
        alert(JSON.stringify(this.refs[type].formData));
    }
}
render(<IndexModule/>,document.getElementById('root'));

