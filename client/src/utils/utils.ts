// utility file that contains helper functions for the client

export function demo_sum(a: number, b: number) {
    return a + b
}

interface table_entry {
    id: number,
    firstname: string,
    lastname: number,
    phone: string,
    street_address: string,
    othersHousehold: string
}

interface response_data {
    results: table_entry[],
}

export function parseSearchResponseData(response: response_data) {
    let len: number = response.results.length;

    let newClients: any = [];
    for (let i = 0; i < len; i++) {
        newClients = [
            ...newClients,
            {
                id: response.results[i].id,
                firstname: response.results[i].firstname,
                lastname: response.results[i].lastname,
                street_address: response.results[i].street_address,
                phone: response.results[i].phone,
                othersHousehold: response.results[i].othersHousehold
            }
        ]
    }

    return newClients;
}