import shell from 'shelljs';
import { fileURLToPath } from 'node:url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Mode = 'start' | 'stop' | 'rebuild';

const isDockerProcessRunning = () => {
	return !!shell.exec(`docker ps -q --filter "name=mock-api-framework"`, {
		silent: true,
	}).stdout;
};
const manageServer = (command: string, mode: Mode, PORT: number) => {
	shell.exec(command, {
		async: false,
		silent: true,
	});

	if (shell.error()) {
		return `Error running ${command}. Failed to ${mode} the local mock API server. ${shell.error()}. Current working directory: ${process.cwd()}`;
	}

	if ((mode === 'start' || mode === 'rebuild') && !isDockerProcessRunning()) {
		return `Error: Local mock API server has not been started on port ${PORT}.`;
	}

	if (mode === 'stop' && isDockerProcessRunning()) {
		return `Error: Local mock API server has not been stopped on port ${PORT}.`;
	}

	return `Local mock API server has been ${mode}ed successfully on port ${PORT}`;
};

const startMockServer = async (PORT: number) => {
	return manageServer(
		`cd "${__dirname}" && docker-compose up -d`,
		'start',
		PORT,
	);
};

const stopMockServer = async (PORT: number) => {
	return manageServer(
		`cd "${__dirname}" && docker-compose down --remove-orphans --volumes --timeout 10`,
		'stop',
		PORT,
	);
};

const rebuildMockServer = async (PORT: number) => {
	return manageServer(
		`cd "${__dirname}" && docker-compose down --remove-orphans --volumes --timeout 10 &&docker-compose up -d --build --force-recreate`,
		'rebuild',
		PORT,
	);
};

export { startMockServer, stopMockServer, rebuildMockServer };
