import React, { Component } from 'react';
import classes from './Header.css';
import Btn from '../stateless/components/btn';
import TextBox from '../stateless/layout/textBox';
import MainHeading from '../stateless/typography/mainHeading';
import { connect } from 'react-redux';

class Header extends Component {

    renderLoginBtn = () => {
        switch(this.props.auth){
            case null:
                return;
            case false:
                return(
                    <Btn href="/auth/google" btnProps={`btn--white`}>
                        Login with Google
                    </Btn>
                );
            default: 
                return(
                    <Btn href="/api/logout" btnProps={`btn--white`}>
                        Logout
                    </Btn>
                )
        }
    }
 
    render(){
        console.log('PROPS', this.props)
        return(
            <header className={classes.homeHeader}>
                <TextBox>
                    <MainHeading 
                        main="Triangle Academic Coach"
                        sub="Individualized Test Prep for Students of All Skill Levels"
                    />
                    {this.renderLoginBtn()}
                </TextBox>
            </header>
        ) 
    }
}

function mapStateToProps({ auth }){
    return { auth }
}

export default connect(mapStateToProps)(Header);