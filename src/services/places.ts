
'use server';

/**
 * @fileOverview A mock service for finding local service providers.
 * In a real application, this would interact with the Google Places API.
 */

export interface Provider {
    name: string;
    rating: number;
    user_ratings_total: number;
    vicinity: string; // Address
}

// This is a mock function. A real implementation would use the Google Places API.
export async function findLocalProviders(
    query: string,
    location: string,
): Promise<Provider[]> {
    console.log(`Searching for '${query}' near '${location}'`);

    // Return a list of plausible but fake providers based on the query.
    // This simulates an API call.
    if (query.toLowerCase().includes('plumber')) {
        return [
            { name: "Pipe Masters Plumbing", rating: 4.8, user_ratings_total: 152, vicinity: "123 Main St, Anytown" },
            { name: "Reliable Rooter", rating: 4.6, user_ratings_total: 210, vicinity: "456 Oak Ave, Anytown" },
            { name: "The Tidy Toilet", rating: 4.9, user_ratings_total: 88, vicinity: "789 Pine Ln, Anytown" },
        ];
    } else if (query.toLowerCase().includes('painter')) {
        return [
            { name: "Precision Painting Co.", rating: 4.9, user_ratings_total: 301, vicinity: "321 Canvas Rd, Anytown" },
            { name: "Fresh Coat Painters", rating: 4.7, user_ratings_total: 189, vicinity: "654 Brush Blvd, Anytown" },
        ];
    } else if (query.toLowerCase().includes('electrician')) {
        return [
            { name: "Sparky & Sons Electric", rating: 4.8, user_ratings_total: 450, vicinity: "111 Volt Ct, Anytown" },
            { name: "Watt's Up Electricians", rating: 4.5, user_ratings_total: 123, vicinity: "222 Amp Way, Anytown" },
        ]
    }

    return []; // Return empty if no specific query matches
}
