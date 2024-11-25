function stringToSlug(str) {
	// Convert to lowercase
	str = str.toLowerCase();

	// Remove accents
	str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

	// Replace spaces and special characters with hyphens
	str = str.replace(/[^a-z0-9]+/g, '-');

	// Remove leading and trailing hyphens
	str = str.replace(/^-+|-+$/g, '');

	return str;
}

export { stringToSlug };
