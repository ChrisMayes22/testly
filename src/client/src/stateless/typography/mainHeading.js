import React from 'react';
import classes from './mainHeading.css';

const mainHeading = props => {
    return(
        <h1 className={classes.mainHeader}>
            <span className={classes.mainHeader_main}>{props.main}</span>
            <span className={classes.mainHeader_sub}>{props.sub}</span>
        </h1>
    )
}

export default mainHeading;

