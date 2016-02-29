import * as React from 'react';
import * as moment from 'moment';

import {requestGithubRepositories, requestGithubGists, requestJsfiddles} from './actions';
import {Activity, Github, Jsfiddle, Items} from './types';

const ActivitiesLink = ({title, url, key}):JSX.Element => (
  <a href={url} key={key} className="btn btn-info btn-sm" target="_blank">{title}</a>
)

interface ActivitiesProps {
  dispatch?: Function;
  activities?: Items<Activity>;
}

export class Activities extends React.Component<ActivitiesProps, any> {
  render() {
    const items:JSX.Element[] = this.props.activities.items.map((item:Activity, i) => {
      let name:string = item.name;
      let date:string = moment(item.date).format('MMM D, YYYY');
      let preview:string;
      let links:JSX.Element[] = [];

      if (item.github) {
        preview = 'assets/github.svg';
        links.push(<ActivitiesLink title="github" key={0} url={item.github.html_url}/>);
        if (item.github.branches.indexOf('gh-pages') > -1) {
          const ghPages:string = `http://${item.github.owner.login}.github.io/${item.github.name}`;
          links.push(<ActivitiesLink title="pages" key={1} url={ghPages}/>);
        }
      } else if (item.gist) {
        preview = 'assets/gist.svg';
        links.push(<ActivitiesLink title="gist" key={0} url={item.gist.html_url}/>);
      } else if (item.jsfiddle) {
        preview = 'assets/jsfiddle.svg';
        links.push(<ActivitiesLink title="jsfiddle" key={0} url={item.jsfiddle.url}/>);
      }

      return (
        <div className="card" key={i}>
          <img className="card-img-top" src={preview} alt={name} width="100%"/>
          <div className="card-block">
            <h4 className="card-title">{date}</h4>
            <p className="card-text">
              {name}
            </p>
            <p className="card-text">
              {links}
            </p>
          </div>
        </div>
      )
    })

    return (
      <div>
        <h1 className="content-activity">Activities</h1>
        <div className="content-activity card-columns">
          {items}
        </div>
      </div>
    )
  }

  componentDidMount():void {
    const {dispatch} = this.props;
    dispatch(requestGithubRepositories());
    dispatch(requestGithubGists());
    dispatch(requestJsfiddles());
  }

  shouldComponentUpdate(nextProps:ActivitiesProps, nextState:any, nextContext:any):boolean {
    return this.props.activities !== nextProps.activities;
  }
}