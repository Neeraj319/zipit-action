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
		try {
			const response = await fetch(args.url, {
				method: 'POST',
				headers: {
					...formData.getHeaders(),
					Authorization: `Basic ${Buffer.from(`${args.username}:${args.password}`).toString('base64')}`,
				},
				body: formData,
				timeout: 60000,
			});

			if (!response.ok) {
				console.error(`Failed with status code ${response.status}`);
				const errorData = await response.text();
				console.error(errorData);
			} else {
				console.log('Done');
			}
		} catch (error) {
			console.error('Error:', error.message);
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
