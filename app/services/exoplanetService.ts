

export interface Star {
    designation: string;
    ra: number;
    dec: number;
    parallax: number;
    pmra: number;
    pmdec: number;
    phot_g_mean_mag: number;
    bp_rp: number;
}

export interface StarsResponse {
    number_of_stars: number;
    stars: Star[];
}
export interface Exoplanet {
    pl_name: string;
    hostname: string;
    tran_flag: string;
    pl_massj: string;
    pl_orbper: string;
    ra: string;
    dec: string;
}

export interface ExoplanetsResponse {
    exoplanets: Exoplanet[];
}

export class ExoplanetService {
    apiUrlhttps = 'https://nasaapi-sigma.vercel.app/';
    apiurlhttp = 'http://127.0.0.1:8000/';
    async getExoplanets(limit = -1, pl_name = '') {
        const response = await fetch(`${this.apiurlhttp}exoplanets?pl_name=${pl_name}&limit=${limit}`);
        return response.json() as Promise<ExoplanetsResponse>;
    }
    async getstars(ra: number, dec: number, radius: number) {
        const response = await fetch(`${this.apiurlhttp}cone_search/?ra=${ra}&dec=${dec}&radius=${radius}`);
        // map the response to the StarsResponse interface
        return response.json() as Promise<StarsResponse>;
    }
}