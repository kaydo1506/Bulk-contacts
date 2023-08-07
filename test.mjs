import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const BEARER_TOKEN = process.env.BEARER_TOKEN;
const contacts = process.env.CONTACTS.split(',');

async function retrieveContactProfile(contactNumber) {
  const response = await fetch(
    `https://whatsapp.turn.io/v1/contacts/${contactNumber}/profile`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        Accept: 'application/vnd.v1+json',
      },
    }
  );

  return response.json();
}

async function updateContactProfile(contactNumber) {
  const response = await fetch(
    `https://whatsapp.turn.io/v1/contacts/${contactNumber}/profile`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        Accept: 'application/vnd.v1+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ opted_in: true }),
    }
  );

  return response.json();
}

async function processContacts() {
  for (let contact of contacts) {
    console.log(`Processing contact: ${contact}`);

    const profile = await retrieveContactProfile(contact);
    if (profile && !profile.fields.opted_in) {
      console.log(`Updating contact: ${contact}`);
      await updateContactProfile(contact);
    }

    // Wait for 1 second (or longer if needed) between requests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

processContacts().then(() => console.log('All contacts processed.'));
