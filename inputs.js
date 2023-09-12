const { snakeToCamel } = require('./helpers');

const inputNames = [
	'USERNAME', 'PASSWORD', 'URL',
	'ZIP_FILE_NAME', 'UPLOAD_FILE_NAME',
];

const githubWorkspace = process.env.GITHUB_WORKSPACE;

const defaultInputs = {
	"username": "",
	"source": `${githubWorkspace}/`,
	"password": "",
	"zipFileName": "",
	"uploadFileName": ""
};

const inputs = {
	githubWorkspace
};

inputNames.forEach((input) => {
	const inputName = snakeToCamel(input.toLowerCase());
	const inputVal = process.env[input] || process.env[`INPUT_${input}`] || defaultInputs[inputName];
	const validVal = inputVal === undefined ? defaultInputs[inputName] : inputVal;

	inputs[inputName] = validVal;
});

module.exports = inputs;
