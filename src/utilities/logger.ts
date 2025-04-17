import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { type DefaultBodyType } from 'msw';

type LogData = {
    data: DefaultBodyType;
    type?: string;
    pathName: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Logs API requests to a file into the logs folder
 * @param {DefaultBodyType} LogData.data - data sent with the request as an object E.g {id: 101, userId: 1, title: 'title', body: 'body'}
 * @param {string} [LogData.type] - type of request (GET, POST, PUT, DELETE)
 * @param {string} [LogData.pathName] - path of the request
 */
function logger({
    data = { error: 'no data provided' },
    type = 'GET',
    pathName = 'no path provided',
}: LogData) {
    const logFolder = `${__dirname}/../logs`;
    const logPath = path.join(logFolder, 'api_request_log.log');

    if (process.env?.LOG_REQUESTS?.toUpperCase() !== 'ON') return;
    console.log(
        `New API Request:${new Date().toLocaleString()}. Request data viewable in browser 'localhost:${process.env?.SERVER_PORT ?? '8000'}/logs' or in the 'logs/ folder'`,
    );

    // Convert the object to a string
    let logEntry = `{"request_information":{"path": "${pathName}","request_type":"${type}", "request_time":"${new Date().toLocaleString()}"},"sent_data":${JSON.stringify(
        data,
    )
        .trim()
        .replaceAll('\\n', '')
        .replaceAll(/\s{2,}/g, ' ')}}`;

    if (fs.existsSync(logPath)) {
        // Add separating comma if NOT the first entry to make valid JSON
        logEntry = `,${logEntry}`;
    }

    // Create the logs folder if it doesn't exist otherwise append to the log file
    fs.writeFileSync(logPath, logEntry, { flag: 'a+' });
}

// Use node fs to delete the log file
export function deleteLogs() {
    const logFolder = `${__dirname}/../logs`;
    const logPath = path.join(logFolder, 'api_request_log.log');
    if (!fs.existsSync(logPath)) return;
    fs.unlinkSync(logPath);
}

export default logger;
