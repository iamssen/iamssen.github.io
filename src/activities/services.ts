const jsonp = require('jsonp');
import {Github, Jsfiddle} from './types';

const GITHUB_HEADERS:RequestInit = {
  headers: {
    Authorization: 'token cd4981226b72e9bffd3f8796026aa6865c81cb73'
  }
}

export function getGithubRepositories():Promise<Github.Repository[]> {
  let repos:Github.Repository[];

  return fetch('https://api.github.com/users/iamssen/repos', GITHUB_HEADERS)
    .then(response => response.json())
    .then((repositories:Github.Repository[]) => {
      repos = repositories;
      return Promise.all(repositories.map(repository => {
        return fetch(`https://api.github.com/repos/${repository.full_name}/branches`, GITHUB_HEADERS)
      }))
    })
    .then((responses:Response[]) => Promise.all(responses.map(response => response.json())))
    .then((branchesList:any[][]) => branchesList.map(branches => branches.map(branch => branch.name)))
    .then((branchesList:string[][]) => {
      repos.forEach((repository:Github.Repository, i) => repository.branches = branchesList[i])
      return repos;
    })
}

export function getGithubGists():Promise<Github.Gist[]> {
  return fetch('https://api.github.com/users/iamssen/gists', GITHUB_HEADERS)
    .then(response => response.json())
}

export function getJsfiddles():Promise<Jsfiddle[]> {
  return new Promise((resolve, reject) => {
    jsonp(
      `http://jsfiddle.net/api/user/iamssen/demo/list.json`, null,
      (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res.list);
      }
    )
  })
}