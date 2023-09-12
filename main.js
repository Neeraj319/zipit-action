const { exec } = require('child_process');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const inputs = require('./inputs');

const githubWorkspace = process.env.GITHUB_WORKSPACE;


const args = inputs;

function runCommand(command) {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error('Error executing command:', error);
				reject(error);
			} else {
				resolve(stdout);
			}
		});
	});
}

async function main() {
	try {
		const zipCommand = `zip ${args.zipFileName} -r ${githubWorkspace}/`;
		await runCommand(zipCommand);

		const formData = new FormData();
		formData.append(args.uploadFileName, fs.createReadStream(args.zipFileName));

		const response = await axios.post(args.url, formData, {
			auth: {
				username: args.username,
				password: args.password,
			},
			timeout: 60000,
			headers: {
				...formData.getHeaders(),
			},
		});

		if (!response.data.ok) {
			console.error(`Failed with status code ${response.status}`);
			console.error(response.data);
		} else {
			console.log('Done');
		}
	} catch (error) {
		if (error.code === 'ETIMEDOUT') {
			console.log('Request timed out');
		} else {
			console.error('Unhandled request exception');
			console.error(error);
		}
	}
}

main();
