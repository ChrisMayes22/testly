import React from 'react';

const header = (props) => {
    return( 
        <header class="home-header--user">
            <div class="home-header__text-box">
                <h1 class="home-header__h1">
                    <span class="home-header__h1--main">You Are A User</span>
                </h1>
                <a href="/api/logout" class="btn btn--white btn--animated">Logout</a>
            </div>
        </header>
    )
}

export default header;