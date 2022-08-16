import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const RouteGuardAuthUser = ({ component: Component, ...rest }) => {

    function JWTEmpty() {
        let flag = false;
        localStorage.getItem("token") ? flag = false : flag = true

        return flag;
    }

    return (
        <Route {...rest}
            render={props => (
                JWTEmpty() ?
                    <Component {...props} />
                    :
                    <Redirect to={{ pathname: '/admin' }} />
            )}
        />
    );
};

export default RouteGuardAuthUser;