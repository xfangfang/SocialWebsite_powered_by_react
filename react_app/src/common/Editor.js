import {Component} from "react";
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { Input } from 'antd';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { Popover ,notification} from 'antd';
import IconButton from '@material-ui/core/IconButton';
import FaceIcon from '@material-ui/icons/Face';
import SendIcon from '@material-ui/icons/Send'


import './editor.css';
import baseUrl from "./baseUrl";

const { TextArea } = Input;

const styles = theme => ({
    paper: {
        height:"48px",
        margin:0,
        padding:0,
        backgroundColor:"#484B52",
        radius:8,
        display:"flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent:"center",
        alignItems:"center",
    },
    textArea:{
        backgroundColor:"#484B52",
        flexGrow : 1,
        border:0,
        resize:"none",
        outline:"none",
        color:"#C3C4C5",
        ":focus":{
            outline: "none"
        },
        ':hover':{
            backgroundColor:"#FFFFFF",
        }
    },
});


class QuestionEditor extends Component {
    constructor(props){
        super(props);
        this.state = {
           editorContent:"",
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange  = () =>{
        this.props.onSendData();
    }

    send =()=>{
        let content = this.state.editorContent.replace(new RegExp("\n","g"),"<br/>");
        if(content.length < 5) {
            //todo 发送消息字符大于 5 提示
            notification.open({
                message: '注意',
                description: '动态长度要大于5！',
            });
            return;
        }
        let title = this.props.username;
        let user_id = this.props.user_id;
        let forum = this.props.channel.id;

        let data = 'title='+title+'&content='+content+'&user_id='+user_id+'&forum='+forum;
        fetch(baseUrl+'/publish_article', {
            method: "POST",
            credentials: 'include',
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data}
        ).
        then((response) =>{
            if(response.status !== 200){
                return null;
            }
            return response.json();

        },function(error){
            console.log(error);
        }).
        then((json)=>{
            if(json){
                if(json.success){
                    //刷新
                    this.setState({
                        editorContent:"",
                    })
                    this.handleChange();
                }else{
                    notification.open({
                        message: '注意',
                        description: '动态发表失败',
                    });
                    //todo 提示发文章错误
                }
            }
        },function (e) {
            console.log(e);
        })
    }

    onEdit = (e) => {
        this.setState({
            editorContent:e.target.value,
        })
    }

    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.paper} >
                <div style={{width : 64}}>
                    <Popover placement="topLeft"
                             padding={0}
                             content={
                                 <Picker
                                     autoFocus={true}
                                     set={'emojione'}
                                     showPreview={false}
                                     i18n={{ search: '搜索', categories: { search: '搜索', recent: '最近' ,Activity:'运动'} }}
                                 />
                             }>
                        <IconButton >
                            <FaceIcon  style={{color:"#7F8186",position:'relative',top:-10}}/>
                        </IconButton>
                    </Popover>
                </div>
                <TextArea className={"text-area"}
                          placeholder={"在 #"+this.props.channel.name+" 发消息"}
                          onChange={this.onEdit}
                          value={this.state.editorContent}
                          autosize={{ minRows: 1, maxRows: 6 }} />
                <div style={{width : 64 ,height:48}}>
                    <IconButton onClick={this.send}>
                        <SendIcon style={{color:"#7F8186",position:'relative',top:-10}} />
                    </IconButton>
                </div>
            </Card>
        );
    }
}

QuestionEditor.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QuestionEditor);