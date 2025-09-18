let geocodeAbort: AbortController | null = null;
let geocodeTimer: any = null;

export function geocode(query: string): Promise<any[]> {
	if (geocodeAbort) { try { geocodeAbort.abort(); } catch {} }
	if (geocodeTimer) { clearTimeout(geocodeTimer); geocodeTimer = null; }
	return new Promise((resolve, reject) => {
		geocodeTimer = setTimeout(async () => {
			geocodeAbort = new AbortController();
			try {
				const url = new URL("https://nominatim.openstreetmap.org/search");
				url.searchParams.set("q", query);
				url.searchParams.set("format", "json");
				url.searchParams.set("limit", "5");
				const res = await fetch(url.toString(), { headers: { "User-Agent": "uber-clone-demo" }, signal: geocodeAbort.signal as any });
				const json = await res.json();
				resolve(json);
			} catch (e: any) {
				if (e?.name === "AbortError") return;
				reject(e);
			} finally {
				geocodeAbort = null;
			}
		}, 250);
	});
}

export async function reverseGeocode(lat: number, lon: number) {
	const url = new URL("https://nominatim.openstreetmap.org/reverse");
	url.searchParams.set("lat", String(lat));
	url.searchParams.set("lon", String(lon));
	url.searchParams.set("format", "json");
	const res = await fetch(url.toString(), { headers: { "User-Agent": "uber-clone-demo" } });
	return res.json();
}

