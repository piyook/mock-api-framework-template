// The Simpsons characters API endpoint
// Main Simpson family and characters data

import { http, HttpResponse } from 'msw';

// Mock data for The Simpsons characters
const simpsonsCharacters = [
	{
		id: 1,
		name: 'Homer Simpson',
		age: 39,
		occupation: 'Nuclear Safety Inspector',
		family: 'Simpson',
		catchphrase: "D'oh!",
		description:
			'The lovable, beer-drinking patriarch of the Simpson family',
	},
	{
		id: 2,
		name: 'Marge Simpson',
		age: 36,
		occupation: 'Homemaker',
		family: 'Simpson',
		catchphrase: 'Mmm-hmm',
		description:
			'The patient, blue-haired mother and moral center of the family',
	},
	{
		id: 3,
		name: 'Bart Simpson',
		age: 10,
		occupation: 'Student',
		family: 'Simpson',
		catchphrase: 'Eat my shorts!',
		description: 'The mischievous eldest Simpson child',
	},
	{
		id: 4,
		name: 'Lisa Simpson',
		age: 8,
		occupation: 'Student',
		family: 'Simpson',
		catchphrase: "If anyone wants me, I'll be in my room",
		description: 'The intelligent, saxophone-playing middle child',
	},
	{
		id: 5,
		name: 'Maggie Simpson',
		age: 1,
		occupation: 'Baby',
		family: 'Simpson',
		catchphrase: '*sucking sounds*',
		description: 'The youngest Simpson, always sucking on her pacifier',
	},
	{
		id: 6,
		name: 'Ned Flanders',
		age: 60,
		occupation: 'Pharmaceutical Sales',
		family: 'Flanders',
		catchphrase: 'Okily dokily!',
		description: "The Simpsons' overly cheerful Christian neighbor",
	},
	{
		id: 7,
		name: 'Moe Szyslak',
		age: 60,
		occupation: 'Bartender',
		family: 'Szyslak',
		catchphrase: "Moe's Tavern, Moe speaking",
		description: "Gruff bartender and owner of Moe's Tavern",
	},
	{
		id: 8,
		name: 'Chief Wiggum',
		age: 43,
		occupation: 'Police Chief',
		family: 'Wiggum',
		catchphrase: 'Bake him away, toys!',
		description: "Springfield's incompetent but well-meaning police chief",
	},
	{
		id: 9,
		name: 'Apu Nahasapeemapetilon',
		age: 35,
		occupation: 'Kwik-E-Mart Owner',
		family: 'Nahasapeemapetilon',
		catchphrase: 'Thank you, come again!',
		description: 'Hardworking owner of the Kwik-E-Mart convenience store',
	},
	{
		id: 10,
		name: 'Krusty the Clown',
		age: 52,
		occupation: 'TV Show Host/Comedian',
		family: 'Krustofsky',
		catchphrase: 'Hey hey kids!',
		description:
			"Springfield's beloved but troubled children's TV show host",
	},
];

function handler(pathName: string) {
	return [
		// GET - Retrieve all characters or filter by query parameters
		http.get(`/${pathName}`, ({ request }) => {
			console.log('GET request received:', request.url);
			const url = new URL(request.url);

			// Support filtering by family, occupation, or search by name
			const family = url.searchParams.get('family');
			const occupation = url.searchParams.get('occupation');
			const search = url.searchParams.get('search');
			const id = url.searchParams.get('id');

			let filteredCharacters = simpsonsCharacters;

			// Filter by ID if provided
			if (id) {
				const character = simpsonsCharacters.find(
					(char) => char.id === parseInt(id),
				);
				return HttpResponse.json(
					character || { error: 'Character not found' },
				);
			}

			// Filter by family
			if (family) {
				filteredCharacters = filteredCharacters.filter((char) =>
					char.family.toLowerCase().includes(family.toLowerCase()),
				);
			}

			// Filter by occupation
			if (occupation) {
				filteredCharacters = filteredCharacters.filter((char) =>
					char.occupation
						.toLowerCase()
						.includes(occupation.toLowerCase()),
				);
			}

			// Search by name
			if (search) {
				filteredCharacters = filteredCharacters.filter((char) =>
					char.name.toLowerCase().includes(search.toLowerCase()),
				);
			}

			return HttpResponse.json({
				characters: filteredCharacters,
				total: filteredCharacters.length,
				message: 'The Simpsons characters data',
			});
		}),

		// POST - Add a new character
		http.post(`/${pathName}`, async ({ request }) => {
			console.log('POST request received');
			const newCharacter = (await request.json()) as any;

			// Generate new ID
			const newId =
				Math.max(...simpsonsCharacters.map((char) => char.id)) + 1;

			const character = {
				id: newId,
				name: newCharacter.name || 'Unknown',
				age: newCharacter.age || 0,
				occupation: newCharacter.occupation || 'Unknown',
				family: newCharacter.family || 'Unknown',
				catchphrase: newCharacter.catchphrase || '',
				description: newCharacter.description || '',
			};

			simpsonsCharacters.push(character);

			return HttpResponse.json({
				message: 'Character added successfully',
				character: character,
			});
		}),

		// PUT - Update a character
		http.put(`/${pathName}`, async ({ request }) => {
			console.log('PUT request received');
			const url = new URL(request.url);
			const id = url.searchParams.get('id');
			const updatedData = (await request.json()) as any;

			if (!id) {
				return HttpResponse.json(
					{ error: 'Character ID is required' },
					{ status: 400 },
				);
			}

			const characterIndex = simpsonsCharacters.findIndex(
				(char) => char.id === parseInt(id),
			);

			if (characterIndex === -1) {
				return HttpResponse.json(
					{ error: 'Character not found' },
					{ status: 404 },
				);
			}

			// Update character data
			simpsonsCharacters[characterIndex] = {
				...simpsonsCharacters[characterIndex],
				...updatedData,
				id: parseInt(id), // Ensure ID doesn't change
			};

			return HttpResponse.json({
				message: 'Character updated successfully',
				character: simpsonsCharacters[characterIndex],
			});
		}),

		// DELETE - Remove a character
		http.delete(`/${pathName}`, ({ request }) => {
			console.log('DELETE request received');
			const url = new URL(request.url);
			const id = url.searchParams.get('id');

			if (!id) {
				return HttpResponse.json(
					{ error: 'Character ID is required' },
					{ status: 400 },
				);
			}

			const characterIndex = simpsonsCharacters.findIndex(
				(char) => char.id === parseInt(id),
			);

			if (characterIndex === -1) {
				return HttpResponse.json(
					{ error: 'Character not found' },
					{ status: 404 },
				);
			}

			const deletedCharacter = simpsonsCharacters.splice(
				characterIndex,
				1,
			)[0];

			return HttpResponse.json({
				message: 'Character deleted successfully',
				character: deletedCharacter,
			});
		}),
	];
}

export default handler;
