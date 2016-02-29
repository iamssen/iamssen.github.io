import {Github, Jsfiddle, Items} from './types';
import * as services from './services';

export const RECEIVE_GITHUB_REPOSITORIES:string = 'RECEIVE_GITHUB_REPOSITORIES';
export const RECEIVE_GITHUB_GISTS:string = 'RECEIVE_GITHUB_GISTS';
export const RECEIVE_JSFIDDLE:string = 'RECEIVE_JSFIDDLE';

const UPDATE_TIME:number = 1000 * 60;
const needUpdate = (items:Items<any>) => !items || Date.now() - items.updatedAt > UPDATE_TIME;

const receiveGithubRepositories = items => ({
  type: RECEIVE_GITHUB_REPOSITORIES,
  items: items
})

const receiveGithubGists = items => ({
  type: RECEIVE_GITHUB_GISTS,
  items: items
})

const receiveJsfiddles = items => ({
  type: RECEIVE_JSFIDDLE,
  items: items
})

export const requestGithubRepositories = () => (dispatch, getState) => {
  if (needUpdate(getState().githubRepositories)) {
    services
      .getGithubRepositories()
      .then(repositories => {
        dispatch(receiveGithubRepositories(repositories))
      })
  }
}

export const requestGithubGists = () => (dispatch, getState) => {
  if (needUpdate(getState().githubGists)) {
    services
      .getGithubGists()
      .then(gists => dispatch(receiveGithubGists(gists)))
  }
}

export const requestJsfiddles = () => (dispatch, getState) => {
  if (needUpdate(getState().jsfiddles)) {
    services
      .getJsfiddles()
      .then(jsfiddles => dispatch(receiveJsfiddles(jsfiddles)))
  }
}
