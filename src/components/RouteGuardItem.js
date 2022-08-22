import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getUserData } from '../variables/config';

export const RouteWriteGuardItem = ({ component: Component, ...rest }) => {
    const userData = getUserData();

    return (
        <Route {...rest}
            render={props => (
                userData.previlege[0]['Detail Akses Item'].Create === "True" ?
                    <Component {...props} />
                    :
                    <Redirect to={{ pathname: '/' }} />
            )}
        />
    );
};

export const RouteReadGuardItem = ({ component: Component, ...rest }) => {
    const userData = getUserData();

    return (
        <Route {...rest}
            render={props => (
                userData.previlege[0]['Detail Akses Item'].Read === "True" ?
                    <Component {...props} />
                    :
                    <Redirect to={{ pathname: '/' }} />
            )}
        />
    );
};

const RouteGuardItem = ({ component: Component, ...rest }) => {
    const userData = getUserData();

    return (
        <Route {...rest}
            render={props => (
                userData.previlege[0].Item === "True" ?
                    <Component {...props} />
                    :
                    <Redirect to={{ pathname: '/' }} />
            )}
        />
    );
};

export default RouteGuardItem;