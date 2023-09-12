const { exec } = require('child_process');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const githubWorkspace = process.env.GITHUB_WORKSPACE;

const args = require('yargs')
	.option('zip-file-name', {
		alias: 'z',
		describe: 'Name of the zip file',
		demandOption: true,
		type: 'string',
	})
	.option('url', {
		alias: 'u',
		describe: 'URL to upload the file',
		demandOption: true,
		type: 'string',
	})
	.option('username', {
		alias: 'n',
		describe: 'Username for HTTP Basic Auth',
		demandOption: true,
		type: 'string',
	})
	.option('password', {
		alias: 'p',
		describe: 'Password for HTTP Basic Auth',
		demandOption: true,
		type: 'string',
	})
	.option('upload-file-name', {
		alias: 'f',
		describe: 'Name of the file to upload',
		demandOption: true,
		type: 'string',
	}).argv;

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
