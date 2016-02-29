export interface Activity {
  name:string;
  date:Date;
  github?:Github.Repository;
  gist?:Github.Gist;
  jsfiddle?:Jsfiddle;
}

export interface Items<T> {
  items: T[];
  updatedAt: number;
}

export interface Action<T> {
  type: string;
  items: T[];
}

export module Github {
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

    // custom data
    branches:string[];
  }
}

export interface Jsfiddle {
  framework:string;
  title:string;
  url:string;
  created:string;
}