import * as React from 'react';
import {Link, IndexLink} from 'react-router';

import * as types from './types';
import {indexRoute, childRoutes} from "./routeConfig";

export const Menu = () => {
  const indexLink:JSX.Element = (
    <li key={indexRoute.title} className="nav-item">
      <IndexLink className="nav-link" to="/" activeClassName="active">{indexRoute.title}</IndexLink>
    </li>
  )

  const childLinks:JSX.Element[] = childRoutes.map(route => (
    <li key={route.title} className="nav-item">
      <Link className="nav-link" to={route.path} activeClassName="active">{route.title}</Link>
    </li>
  ))

  return (
    <div className="main-menu">
      <nav className="navbar navbar-fixed-top navbar-light bg-faded">
        <button className="navbar-toggler hidden-sm-up" type="button" data-toggle="collapse" data-target="#navbar">
          &#9776;
        </button>
        <div className="collapse navbar-toggleable-xs" id="navbar">
          <a className="navbar-brand" href="#">SSEN</a>
          <ul className="nav navbar-nav">
            {indexLink}
            {childLinks}
          </ul>
        </div>
      </nav>
    </div>
  )



}

export const App = ({children}) => (
  <div>
    <Menu/>
    {/* container  */}
    <div className="main-content">
      {children}
    </div>
  </div>
)


