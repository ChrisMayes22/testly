import React, { Component } from 'react';
import classes from './Header.css';
import Btn from '../stateless/components/btn';
import TextBox from '../stateless/layout/textBox';
import MainHeading from '../stateless/typography/mainHeading';

class Header extends Component {
    render(){
        return(
            <header className={classes.homeHeader}>
                <TextBox>
                    <MainHeading 
                        main="Triangle Academic Coach"
                        sub="Individualized Test Prep for Students of All Skill Levels"
                    />
                    <Btn href="/auth/google" btnProps={'btn--white'}>
                        Login with Google
                    </Btn>
                </TextBox>
            </header>
        ) 
    }
}

export default Header;