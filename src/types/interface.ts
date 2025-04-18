const VITE_API_MATCH_LOGO_URL: string = import.meta.env.VITE_API_MATCH_LOGO_URL;
export const VITE_API_MATCH_HOW_MANY_WERE_FOUND: number = import.meta.env.VITE_API_MATCH_HOW_MANY_WERE_FOUND;


export interface PeoplesDataMatch {
    id: number;
    name: string;
    area: string;
    location: string;
    description: string;
}

export interface PeopleDataMatchResponse {
    peopledatas: PeoplesDataMatch[];
}

export interface PeoplesAffinityMatch extends PeoplesDataMatch {
    affinity: number;
}

export interface FormDataMatch {
    name: string;
    area: string;
    location: string;
}

export interface AreasDataMatch {
    id: number;
    area: string;
}

export interface AreaDataMatchResponse {
    areadatas: AreasDataMatch[];
}

export interface FeatureCardPropsLandingPage {
    title: string;
    description: string;
}

export interface Logo {
    nome: string;
    logoUrl: string;
}

export const logo: Logo = {
    nome: 'Logo Legal',
    logoUrl: VITE_API_MATCH_LOGO_URL
};
