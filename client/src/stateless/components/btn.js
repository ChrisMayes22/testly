import React from 'react';
import classes from './btn.css';

const btn = props => <a href={props.href} 
                        className={[classes.btn, classes[props.btnProps]].join(' ')} 
                        children={props.children}
                        onClick={props.clicked}/>

export default btn;