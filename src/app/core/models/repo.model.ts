export interface RepoSearchResponse {
    total_count: number;
    incomplete_results: boolean;
    items: Repo[];
  }
  
  export interface Repo {
    name: string;
    full_name: string; 
    owner: {
      avatar_url: string;
      login: string; 
    };
    created_at: string;
    
  }