import axios from "axios";
import {AreasDataMatch, AreaDataMatchResponse, PeoplesDataMatch, PeopleDataMatchResponse} from "../types/interface.ts";

const VITE_API_MATCH_PEOPLES_DATA: string = import.meta.env.VITE_API_MATCH_PEOPLES_DATA;
const VITE_API_MATCH_AREAS_DATA: string = import.meta.env.VITE_API_MATCH_AREAS_DATA;

export function getPeopleDatas(
    setPotentialPeopleResults: (data: PeoplesDataMatch[]) => void,
): void {
    axios.get<PeopleDataMatchResponse>(VITE_API_MATCH_PEOPLES_DATA)
        .then((response) => {
            if (response.data && response.data.peopledatas) {
                setPotentialPeopleResults(response.data.peopledatas);
            }
            return;
        })
        .catch((error) => {
            console.error('Erro ao buscar os dados:', error);
        });
}

export function getAreaDatas(
    setPotentialAreaDataResults: (data: AreasDataMatch[]) => void,
): void {
    axios.get<AreaDataMatchResponse>(VITE_API_MATCH_AREAS_DATA)
        .then((response) => {
            if (response.data && response.data.areadatas) {
                setPotentialAreaDataResults(response.data.areadatas);
            }
            return;
        })
        .catch((error) => {
            console.error('Erro ao buscar os dados:', error);
        });
}


