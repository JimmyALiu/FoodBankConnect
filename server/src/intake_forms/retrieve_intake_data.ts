import { getClients } from './client_intake.js';
import { Clients } from './custom_types.js';

async function retrieveClientData() {

    const data: Clients = await getClients();
    if (data) {
        console.log('Client data retrieved successfully:', data);
    } else {
        console.error('Failed to retrieve client data');
    }
}


try {
    await retrieveClientData();
} catch (error) {
    console.error('Error retrieving client data:', error);
}
