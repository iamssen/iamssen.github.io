export interface Activity {
  name:string;
  date:Date;
  from:string;
  github?:github.Repository;
  gist?:github.Gist;
  behance?:behance.Project;
  jsfiddle?:jsfiddle.Fiddle;
}

export module github {
  export interface Gist {
    id: string;
    description: string;
    html_url: string;
    url:string;
    created_at:string;
    updated_at:string;
  }

  export interface Repository {
    id: number;
    name:string;
    owner:{login:string};
    full_name:string;
    html_url:string;
    description:string;
    created_at:string;
    updated_at:string;
    pushed_at:string;
    git_url: string;
    open_issues:number;
    default_branch:string;
    branches: Branch[];
  }

  export interface Branch {
    name: string;
    commit:{sha:string, url:string};
  }
}

export module jsfiddle {
  export interface Fiddle {
    framework:string;
    title:string;
    url:string;
    created:string;
  }
}

export module behance {
  export interface Cover {
    original:string;
    115:string;
    202:string;
    230:string;
    404:string;
  }

  export interface Project {
    id:number;
    name:string;
    published_on: number;
    created_on: number;
    modified_on:number;
    url:string;
    privacy:string;
    covers:Cover;
  }

  export interface Projects {
    projects:Project[];
    http_code:number;
  }
}