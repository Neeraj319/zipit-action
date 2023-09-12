const snakeToCamel = (str) => str.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());


module.exports = {
	snakeToCamel
}
