import {combineReducers} from 'redux';
import * as moment from 'moment';

import {RECEIVE_GITHUB_REPOSITORIES, RECEIVE_GITHUB_GISTS, RECEIVE_JSFIDDLE} from './actions';
import {Items, Github, Jsfiddle, Activity, Action} from './types';

type Repository = Github.Repository;
type Gist = Github.Gist;

const now = Date.now;
const freeze = Object.freeze;
const init = <T>():Items<T> => ({items: freeze([]), updatedAt: 0});

const githubRepositories = (state:Items<Repository> = init<Repository>(), action:Action<Repository>) => {
  if (action.type === RECEIVE_GITHUB_REPOSITORIES) {
    return freeze({
      items: freeze(action.items),
      updatedAt: now()
    })
  }
  return state;
}

const githubGists = (state:Items<Gist> = init<Gist>(), action:Action<Gist>) => {
  if (action.type === RECEIVE_GITHUB_GISTS) {
    return freeze({
      items: freeze(action.items),
      updatedAt: now()
    })
  }
  return state;
}

const jsfiddles = (state:Items<Jsfiddle> = init<Jsfiddle>(), action:Action<Jsfiddle>) => {
  if (action.type === RECEIVE_JSFIDDLE) {
    return freeze({
      items: freeze(action.items),
      updatedAt: now()
    })
  }
  return state;
}

const activities = (state:Items<Activity> = {items: [], updatedAt: 0}, action:Action<any>) => {
  if (action.type === RECEIVE_GITHUB_REPOSITORIES || action.type === RECEIVE_GITHUB_GISTS || action.type === RECEIVE_JSFIDDLE) {
    let oldItems:Activity[];
    let newItems:Activity[];

    switch (action.type) {
      case RECEIVE_GITHUB_REPOSITORIES:
        oldItems = state.items.filter(item => !item.github);
        newItems = action.items.map((item:Repository) => freeze({
          name: item.name,
          date: moment(item.updated_at).toDate(),
          github: item
        }));
        break;

      case RECEIVE_GITHUB_GISTS:
        oldItems = state.items.filter(item => !item.gist);
        newItems = action.items.map((item:Gist) => freeze({
          name: item.description,
          date: moment(item.updated_at).toDate(),
          gist: item
        }));
        break;

      case RECEIVE_JSFIDDLE:
        oldItems = state.items.filter(item => !item.jsfiddle);
        newItems = action.items.map((item:Jsfiddle) => freeze({
          name: item.title,
          date: moment(item.created).toDate(),
          jsfiddle: item
        }));
        break;
    }

    return freeze({
      items: freeze(newItems.concat(oldItems).sort((a, b) => a.date > b.date ? -1 : 1)),
      updatedAt: now()
    })
  }
  return state;
}

export {
  githubRepositories,
  githubGists,
  jsfiddles,
  activities
}