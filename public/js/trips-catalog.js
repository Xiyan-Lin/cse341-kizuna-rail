const filterTrips = (trips, region = 'all', season = 'all') => trips.filter(
    (trip) => (region === 'all' || trip.region === region) && (season === 'all' || trip.bestSeason === season)
);
const fetchTrips = async (fetcher = fetch) => {
    const response = await fetcher('/api/trips');
    if (!response.ok) throw new Error(`Trips request failed (${response.status})`);
    const payload = await response.json();
    if (!Array.isArray(payload.trips)) throw new Error('Invalid trips response');
    return payload.trips;
};
const renderTrips = (trips, list, template) => {
    const fragment = document.createDocumentFragment();
    for (const trip of trips) {
        const card = template.content.cloneNode(true);
        const field = (name) => card.querySelector(`[data-field="${name}"]`);
        for (const name of ['name', 'region', 'startStation', 'endStation', 'duration', 'description']) {
            field(name).textContent = trip[name] || '';
        }
        field('distance').textContent = `${trip.distance} km`;
        const season = field('bestSeason');
        season.textContent = `Best in ${trip.bestSeason}`;
        if (/^[a-z-]+$/i.test(trip.bestSeason)) season.classList.add(`season-${trip.bestSeason}`);
        if (/^[a-z-]+$/i.test(trip.region)) card.querySelector('.route-card').classList.add(trip.region);
        for (const highlight of trip.highlights || []) {
            const tag = document.createElement('span');
            tag.className = 'highlight-tag';
            tag.textContent = highlight;
            field('highlights').appendChild(tag);
        }
        field('details').href = `/trips/${encodeURIComponent(trip.id)}`;
        fragment.appendChild(card);
    }
    list.replaceChildren(fragment);
};
const fillFilter = (select, values, requested) => {
    for (const value of [...new Set(values)].filter(Boolean).sort()) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value.charAt(0).toUpperCase() + value.slice(1);
        select.appendChild(option);
    }
    if (Array.from(select.options).some((option) => option.value === requested)) select.value = requested;
};
const initTripsCatalog = async () => {
    const list = document.getElementById('trips-list');
    const template = document.getElementById('trip-card-template');
    if (!list || !template) return;
    const loading = document.getElementById('trips-loading');
    const errorMessage = document.getElementById('trips-error');
    const empty = document.getElementById('trips-empty');
    const region = document.getElementById('trip-region-filter');
    const season = document.getElementById('trip-season-filter');
    try {
        const trips = await fetchTrips();
        const query = new URLSearchParams(window.location.search);
        fillFilter(region, trips.map((trip) => trip.region), query.get('region'));
        fillFilter(season, trips.map((trip) => trip.bestSeason), query.get('season'));
        const update = () => {
            const visible = filterTrips(trips, region.value, season.value);
            renderTrips(visible, list, template);
            empty.hidden = visible.length !== 0;
            const url = new URL(window.location.href);
            for (const [key, value] of [['region', region.value], ['season', season.value]]) {
                if (value === 'all') url.searchParams.delete(key);
                else url.searchParams.set(key, value);
            }
            window.history.replaceState(null, '', url);
        };
        region.addEventListener('change', update);
        season.addEventListener('change', update);
        update();
    } catch (error) {
        errorMessage.hidden = false;
        errorMessage.textContent = 'Unable to load trips. Please refresh and try again.';
    } finally {
        loading.hidden = true;
    }
};
if (typeof document !== 'undefined') initTripsCatalog();
export { filterTrips, fetchTrips };
