import { AreasDataMatch, AreaDataMatchResponse, PeoplesDataMatch, PeopleDataMatchResponse } from "../types/interface.ts";

const VITE_API_MATCH_PEOPLES_DATA: string = import.meta.env.VITE_API_MATCH_PEOPLES_DATA;
const VITE_API_MATCH_AREAS_DATA: string = import.meta.env.VITE_API_MATCH_AREAS_DATA;

export function getPeopleDatas(
    setPotentialPeopleResults: (data: PeoplesDataMatch[]) => void,
): void {
    fetch(VITE_API_MATCH_PEOPLES_DATA)
        .then(response => {
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            return response.json();
        })
        .then((data: PeopleDataMatchResponse) => {
            if (data && data.peopledatas) {
                setPotentialPeopleResults(data.peopledatas);
            }
        })
        .catch((error) => {
            console.error('Erro ao buscar os dados:', error);
        });
}

export function getAreaDatas(
    setPotentialAreaDataResults: (data: AreasDataMatch[]) => void,
): void {
    fetch(VITE_API_MATCH_AREAS_DATA)
        .then(response => {
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            return response.json();
        })
        .then((data: AreaDataMatchResponse) => {
            if (data && data.areadatas) {
                setPotentialAreaDataResults(data.areadatas);
            }
        })
        .catch((error) => {
            console.error('Erro ao buscar os dados:', error);
        });
}
