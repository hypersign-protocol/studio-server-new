import * as readlineSync from 'readline-sync';
import * as fs from 'fs';

interface EnvironmentData {
  name: string;
  values: { key: string; value: string; type: string }[];
}

const baseUrl: string = readlineSync.question('Enter Studio Server Base URL: ');
const auth: string = readlineSync.question('Enter Studio Server AuthToken: ');

const environmentData: EnvironmentData = {
  name: 'environment',
  values: [
    { key: 'studio-server-base-url', value: baseUrl, type: 'text' },
    { key: 'studio-server-auth', value: auth, type: 'text' },
  ],
};

const environmentJson: string = JSON.stringify(environmentData, null, 2);

// Save the environment data to environment.json
fs.writeFileSync('environment.json', environmentJson);
