export interface Commit {
    sha: string;
    html_url: string; 
    commit: {
      author: {
        name: string; 
        email: string;
        date: string;
      };
      message: string; 
    };
    author?: {
      login: string; 
    } | null;
  }