import { MiteClient } from "typed-mite-api";

// Initialize the mite client
const mite = new MiteClient("numero2", "95dfac35ff6921d");

// Example usage of the mite client
// The API will return a promise, so you have to await it
async function main() {
	const users = await mite.getProjects();
	console.log(users);
}

main();
