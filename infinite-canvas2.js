/* ════════════════════════════════════════════════════════════════════
   infinite-canvas2.js
   Infinite-scroll storytelling grid — FLIP engine + 50 stories
   ════════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── 1. Story Dataset (50 entries) ─────────────────────────────── */
const STORIES = [
  { id:  1, title: "The Endless Highway",       subtitle: "Infrastructure & Memory",       type: "image", src: "https://upload.wikimedia.org/wikipedia/commons/8/88/Urbex-ppc-030_%28Unsplash%29.jpg", aspect: "16:9", colorClass: "cell--ink",    tag: "Visual Essay · 001",
    content: "<p>The highway stretches into an infinite horizon — a snapshot of structural isolation where concrete architectures serve as conduits for collective memory. As we travel down these lines, localized frequencies begin to fade.</p><p>Infrastructure, we forget, is autobiography. The interstate was drawn not just over geography but over communities — it encoded desire, erasure, and ambition simultaneously.</p>" },

  { id:  2, title: "Portraits of Light",         subtitle: "Shadow Studies",                type: "image", src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",  aspect: "4:5",  colorClass: "cell--blue",   tag: "Photography · 002",
    content: "<p>Chiaroscuro is not merely a lighting technique — it is a philosophical stance. The decision about where shadow begins is the decision about what shall remain unknown.</p><p>These portraits were made without flash, without fill, without apology. A single 60-watt bulb suspended 2.3 metres above the subject. The rest was silence and waiting.</p>" },

  { id:  3, title: "Mondrian Revisited",         subtitle: "Grid as Argument",              type: "text",  src: "",                                                                                               aspect: "1:1",  colorClass: "cell--chalk",  tag: "Theory · 003",
    content: "<p>The grid is not neutral. Every axis is a claim about how the world should be divided: this much space for blue, this much for red, this much for the silence between them.</p><p>Mondrian believed that if you stripped away representation entirely, you would find something universal beneath — an abstract structure shared by all perceiving minds. He may have been right.</p>" },

  { id:  4, title: "Camel Route",                subtitle: "Silk Road Archive",             type: "image", src: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=800&q=80",  aspect: "4:5",  colorClass: "cell--red",    tag: "History · 004",
    content: "<p>The route was never a single road. It was a braided river of paths — shifting seasonally, geopolitically, tactically. The name 'Silk Road' was invented in 1877, long after it had ceased to function as a unified system.</p><p>What traveled along it was not primarily silk. It was language, disease, theology, metallurgy, cuisine, and the persistent human need to know what lies beyond the next ridge.</p>" },

  { id:  5, title: "[ 44°N / 12°E ]",            subtitle: "",                              type: "empty", src: "",                                                                                               aspect: "1:1",  colorClass: "cell--empty",  tag: "§ 005" },

  { id:  6, title: "Kinetic Noise",              subtitle: "Found Frequencies",             type: "image", src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80", aspect: "16:9", colorClass: "cell--yellow",  tag: "Audio Study · 006",
    content: "<p>Every city has a frequency — not a metaphorical one, but an actual measurable hum produced by its power grid, its ventilation systems, its collective mechanical respiration. London hums at 50Hz. New York at 60Hz.</p><p>Forensic audio analysts can use this contamination to date recordings. The exact frequency drifts slightly over time — by comparing a recording's hum to historical logs, they can determine precisely when it was made.</p>" },

  { id:  7, title: "Concrete Form",              subtitle: "Brutalism Observed",            type: "image", src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80",  aspect: "4:5",  colorClass: "cell--ink",    tag: "Architecture · 007",
    content: "<p>Brutalism was never meant to be brutal. The term derives from béton brut — raw concrete — the material itself, not a judgment about its effect. The buildings that bear this label were utopian in intent, collective in address.</p><p>What went wrong is complicated. Some of it was maintenance. Some was policy. Some was the fundamental mismatch between architectural idealism and the texture of actual lives.</p>" },

  { id:  8, title: "The Blue Hour",              subtitle: "Strait of Magellan",            type: "image", src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80",  aspect: "1:1",  colorClass: "cell--blue",   tag: "Logbook · 008",
    content: "<p>The blue hour is not an hour. It lasts between 20 and 40 minutes depending on latitude and season — the civil twilight between sunset and full dark when the sky becomes a uniform, saturated indigo.</p><p>Photographers chase it obsessively. Its quality of light is both directional and diffuse simultaneously, which should be a contradiction but isn't.</p>" },

  { id:  9, title: "Glyph Systems",              subtitle: "Typography After Dark",         type: "text",  src: "",                                                                                               aspect: "2:1",  colorClass: "cell--chalk",  tag: "Research · 009",
    content: "<p>The letterform is a technology. Like all technologies it encodes the assumptions of its inventors — assumptions about directionality, about breath, about what constitutes a minimal unit of meaning.</p><p>Arabic reads right to left not because of some cultural preference for rightward orientation but because of the angle of a reed pen on papyrus. The medium shaped the alphabet. The alphabet shaped the thought.</p>" },

  { id: 10, title: "Subterranean",               subtitle: "Geothermal Networks",           type: "image", src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",  aspect: "4:5",  colorClass: "cell--red",    tag: "Data Study · 010",
    content: "<p>Beneath the city, a different city. The infrastructure required to keep a metropolis alive — water, power, data, heat — occupies a volume comparable to the built environment above ground, but remains almost entirely invisible to its users.</p><p>These images were taken during maintenance shutdowns, in tunnels and chambers not normally accessible. The light is artificial. The scale is disorienting.</p>" },

  { id: 11, title: "[ Edge Node ]",              subtitle: "",                              type: "empty", src: "",                                                                                               aspect: "1:1",  colorClass: "cell--empty",  tag: "§ 011" },

  { id: 12, title: "Neon Horizon",               subtitle: "Dispersed Urbanism",            type: "image", src: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80", aspect: "16:9", colorClass: "cell--yellow",  tag: "Visual Essay · 012",
    content: "<p>The sprawl is not a failure of planning. It is a success of individual preference aggregated across millions of decisions, each locally rational, collectively catastrophic.</p><p>From altitude at night, it is undeniably beautiful — a diffuse galaxy of private illumination stretching to every horizon. The problem with beauty is that it naturalizes what it describes.</p>" },

  { id: 13, title: "Static Shift",               subtitle: "Magnetic Interference",         type: "text",  src: "",                                                                                               aspect: "1:1",  colorClass: "cell--ink",    tag: "Frequencies · 013",
    content: "<p>Before digital, radio static was the sound of the universe. Cosmic background radiation — the afterglow of the Big Bang — was detectable as noise on an untuned set. Every television showing snow was displaying a portion of the oldest light in existence.</p><p>We have cleaned that up now. The screens are sharp. The background is gone.</p>" },

  { id: 14, title: "Thermal Vent",               subtitle: "Deep Sea Topography",           type: "image", src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",  aspect: "4:5",  colorClass: "cell--blue",   tag: "Cartography · 014",
    content: "<p>The deep ocean floor is better mapped than the surface of Mars — but only barely, and only recently. For most of human history, the 70% of the Earth's surface that lies beneath water was less known than the moon.</p><p>The hydrothermal vents found in 1977 changed biology more than astronomy ever had. Life existed without sunlight. The assumption that photosynthesis was foundational turned out to be provincial.</p>" },

  { id: 15, title: "Monolith",                   subtitle: "Unmarked Boundaries",           type: "image", src: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",  aspect: "1:1",  colorClass: "cell--red",    tag: "Monograph · 015",
    content: "<p>The standing stone predates writing by millennia. We do not know what it meant to the people who erected it. We project: calendar, boundary marker, ancestor site, astronomical instrument. The projections tell us more about ourselves than about the stone.</p><p>It stands regardless. Four thousand years of weather have done very little to it. Patient in a way that nothing we build now will be.</p>" },

  { id: 16, title: "Salt Flat Mirror",            subtitle: "Bolivian Altiplano",            type: "image", src: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80", aspect: "16:9", colorClass: "cell--chalk",  tag: "Geography · 016",
    content: "<p>After rain, the Salar de Uyuni becomes the largest mirror on Earth — 10,582 square kilometres of sky reflected with sub-centimetre accuracy. Satellites use it to calibrate their altimeters.</p><p>Standing at the centre, the horizon disappears entirely. Sky above, sky below, the boundary between them dissolved. This is the visual experience of being inside a cloud, but outside, but at altitude, but flat.</p>" },

  { id: 17, title: "Archive Fever",              subtitle: "Memory as Infrastructure",      type: "text",  src: "",                                                                                               aspect: "4:5",  colorClass: "cell--ink",    tag: "Essay · 017",
    content: "<p>An archive is not a storage facility. It is a set of decisions about what deserves to persist — and therefore, by implication, what deserves to disappear. Every archive is also a counter-archive of everything excluded.</p><p>The digital archive has made this problem visible in new ways. Because storage is cheap, we now save everything, which means curation happens at the retrieval end. The algorithm decides what you remember.</p>" },

  { id: 18, title: "Glass Modernism",            subtitle: "Transparency as Ideology",      type: "image", src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80",  aspect: "1:1",  colorClass: "cell--blue",   tag: "Architecture · 018",
    content: "<p>The glass curtain wall was a utopian statement: nothing to hide, light for everyone, the boundary between inside and outside dissolved. The office workers who spent their days in these buildings experienced them differently.</p><p>Glare. Heat. The sensation of being watched. The inability to determine time of day or weather without standing at the glass. Transparency had costs that the drawings hadn't shown.</p>" },

  { id: 19, title: "[ 48°N / 2°E ]",             subtitle: "",                              type: "empty", src: "",                                                                                               aspect: "1:1",  colorClass: "cell--empty",  tag: "§ 019" },

  { id: 20, title: "Desert Optics",              subtitle: "Mirage Mechanics",              type: "image", src: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1200&q=80", aspect: "16:9", colorClass: "cell--yellow",  tag: "Physics · 020",
    content: "<p>A mirage is not a hallucination. It is a real optical phenomenon — light bent by temperature gradients in the air, producing an image of a source that is not where it appears. The traveller dying of thirst sees real water. It is just somewhere else.</p><p>This distinction matters philosophically. The mirage contains genuine information about the world; it just requires correct interpretation.</p>" },

  { id: 21, title: "Rust Belt",                  subtitle: "Industrial Afterlife",          type: "image", src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80",  aspect: "4:5",  colorClass: "cell--red",    tag: "Documentary · 021",
    content: "<p>The factory is empty now. The machines were sold for scrap or moved to places with lower wages. What remains is architecture — the building that outlasted its purpose, the infrastructure too expensive to demolish and too decayed to repurpose.</p><p>These sites become something else over time. Urban explorers photograph them. Artists colonize them. Nature, always patient, begins to reclaim.</p>" },

  { id: 22, title: "Cartographic Error",         subtitle: "Maps That Lied",                type: "text",  src: "",                                                                                               aspect: "2:1",  colorClass: "cell--chalk",  tag: "History · 022",
    content: "<p>For three centuries, California appeared on European maps as an island. Explorers knew better — they had walked the land bridge — but the island persisted in print because it had appeared in a novel, and the novel was widely read, and the map was copied from other maps.</p>" },

  { id: 23, title: "Fog Architecture",           subtitle: "Conditional Structures",        type: "image", src: "https://images.unsplash.com/photo-1478827217976-7214a0556393?auto=format&fit=crop&w=800&q=80",  aspect: "4:5",  colorClass: "cell--ink",    tag: "Atmospheres · 023",
    content: "<p>Fog is an architecture of subtraction. It does not add anything to the landscape; it removes the far distance, compresses the visual field, makes the nearby suddenly strange by removing context.</p><p>San Francisco's fog has a name — Karl — and a social media presence. This anthropomorphization is not merely whimsical. It reflects a genuine sense that the fog has agency, a schedule, intentions.</p>" },

  { id: 24, title: "Tidal Grammar",              subtitle: "Rhythms of the Coast",          type: "image", src: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80",  aspect: "1:1",  colorClass: "cell--blue",   tag: "Natural Systems · 024",
    content: "<p>The tide is not a simple in-and-out. It is a complex interference pattern produced by the gravitational interactions of Earth, Moon, and Sun, modulated by the shape of every coastline, the depth of every harbour, the resonant frequencies of every bay.</p><p>Some places have one tide per day. Some have two of unequal height. The Bay of Fundy has a tidal range of 16 metres.</p>" },

  { id: 25, title: "[ 1°N / 103°E ]",            subtitle: "",                              type: "empty", src: "",                                                                                               aspect: "1:1",  colorClass: "cell--empty",  tag: "§ 025" },

  { id: 26, title: "Northern Passage",           subtitle: "Arctic Documentation",          type: "image", src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80", aspect: "16:9", colorClass: "cell--ink",    tag: "Expedition · 026",
    content: "<p>The Northwest Passage was the obsession of European exploration for three centuries — a theoretical shortcut from Atlantic to Pacific through the Arctic archipelago that destroyed dozens of expeditions before it was first navigated.</p><p>It is navigable now, regularly, by commercial shipping. The ice has retreated enough. The route that killed Franklin and his 128 men has become routine. This is not a triumph.</p>" },

  { id: 27, title: "Phosphorescence",            subtitle: "Bioluminescent Coasts",         type: "image", src: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=800&q=80",  aspect: "4:5",  colorClass: "cell--blue",   tag: "Marine Biology · 027",
    content: "<p>On certain beaches, on certain nights, with certain weather, the breaking waves glow blue. Dinoflagellates — single-celled marine organisms — produce light when disturbed. They have been doing this for 400 million years.</p><p>The mechanism is well understood. The experience is not reducible to the mechanism. Standing at the waterline watching blue fire break across your feet is not a chemistry lesson.</p>" },

  { id: 28, title: "Signal Loss",                subtitle: "Transmission Archaeology",      type: "text",  src: "",                                                                                               aspect: "4:5",  colorClass: "cell--yellow",  tag: "Media Theory · 028",
    content: "<p>The first radio signals broadcast from Earth are now approximately 120 light years away, forming an expanding sphere of human communication travelling through the galaxy at the speed of light.</p><p>They are also attenuating — spreading thinner across the ever-increasing surface of that sphere, competing with stellar noise, becoming indistinguishable from background radiation long before they reach anything. We are broadcasting into silence, which may be fine.</p>" },

  { id: 29, title: "Liminal Markets",            subtitle: "Night Economy Atlas",           type: "image", src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",  aspect: "1:1",  colorClass: "cell--red",    tag: "Urban Studies · 029",
    content: "<p>The night market exists in a different regulatory space than the day. Permits are more fluid, enforcement less present, transactions more informal. This is not incidental — the night has always been where the official city gives way to other arrangements.</p><p>In cities across Southeast Asia, the night market is the real economic engine. The day is for offices. The night is for commerce.</p>" },

  { id: 30, title: "Gradient Forests",           subtitle: "Altitude Ecology",              type: "image", src: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80", aspect: "16:9", colorClass: "cell--ink",    tag: "Ecology · 030",
    content: "<p>Climb a mountain and you travel through climate zones equivalent to moving thousands of kilometres toward the poles. The vegetation changes in predictable bands: temperate forest, subalpine, krummholz, tundra, snow. Each zone is a complete ecosystem compressed into a few hundred metres of altitude.</p><p>These gradients are moving upward as temperatures rise. The zones are being compressed from below.</p>" },

  { id: 31, title: "[ 51°N / 0°W ]",             subtitle: "",                              type: "empty", src: "",                                                                                               aspect: "1:1",  colorClass: "cell--empty",  tag: "§ 031" },

  { id: 32, title: "Seismic Notation",           subtitle: "Reading the Ground",            type: "image", src: "https://captainfi.com/wp-content/uploads/2022/08/Unsplash-images-2-1024x683.jpg",  aspect: "4:5",  colorClass: "cell--chalk",  tag: "Geophysics · 032",
    content: "<p>The seismograph doesn't measure earthquakes. It measures the movement of the ground relative to a suspended mass — a pendulum that doesn't want to move, hung inside a frame that does. The earthquake is inferred from the difference.</p><p>Every recording contains noise — ocean waves, traffic, the footsteps of people in the building — and signal. Separating them is the work.</p>" },

  { id: 33, title: "Typeface Zero",              subtitle: "Before Gutenberg",              type: "text",  src: "",                                                                                               aspect: "2:1",  colorClass: "cell--red",    tag: "Type History · 033",
    content: "<p>The typeface predates the printing press by fifteen centuries. Coin dies, seals, and stamps all required the design of repeatable letterforms. The innovation of moveable type was mechanical, not typographic — the letters already existed.</p>" },

  { id: 34, title: "Cloud Taxonomy",             subtitle: "Meteorological Portraits",      type: "image", src: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80",  aspect: "1:1",  colorClass: "cell--blue",   tag: "Meteorology · 034",
    content: "<p>Luke Howard classified the clouds in 1802, and his system — cumulus, stratus, cirrus, nimbus — has endured with minor additions. It was the first systematic taxonomy of something that had always seemed too transient to classify.</p><p>Clouds are not transient. They are the visible portion of continuous atmospheric processes — the moment where water vapour becomes visible against a blue background. The cloud you see is always moving, always changing, always being replaced. It persists anyway.</p>" },

  { id: 35, title: "Meridian Lines",             subtitle: "The Politics of Zero",          type: "image", src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",  aspect: "4:5",  colorClass: "cell--ink",    tag: "Cartography · 035",
    content: "<p>The prime meridian runs through Greenwich not because of any geographic logic but because British sea power in 1884 was sufficient to convince an international conference. There is a brass line in the courtyard of the Royal Observatory that marks zero longitude for the world.</p><p>GPS systems now define a prime meridian 102 metres east of the Greenwich line, because satellite geometry is more precise than Victorian astronomy.</p>" },

  { id: 36, title: "[ 35°N / 139°E ]",           subtitle: "",                              type: "empty", src: "",                                                                                               aspect: "1:1",  colorClass: "cell--empty",  tag: "§ 036" },

  { id: 37, title: "Quarry Light",               subtitle: "Stone Memory",                  type: "image", src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80", aspect: "16:9", colorClass: "cell--yellow",  tag: "Industry · 037",
    content: "<p>The limestone in your city's older buildings was quarried from the same geological formation that produced the stone in the medieval walls. The city is built from its own substrate, lifted out of the ground and stacked.</p><p>The quarries that produced it are now lakes. The water table, no longer held back by extraction, rose to fill the voids left by the stone.</p>" },

  { id: 38, title: "Radio Silence",              subtitle: "Dead Air Archives",             type: "text",  src: "",                                                                                               aspect: "4:5",  colorClass: "cell--ink",    tag: "Broadcast · 038",
    content: "<p>Dead air — the silence that fills a broadcast gap when programming fails — was historically the most alarming sound in radio. It meant something had gone wrong. Engineers were trained to respond within seconds.</p><p>Silence meant equipment failure, meant the station had gone dark, meant the licensing authorities would notice. It was not aesthetic. It was emergency.</p><p>Contemporary silent radio — stations that broadcast nothing, legally, to hold a frequency — inverts this completely. The silence is the content.</p>" },

  { id: 39, title: "Inverse Seasons",            subtitle: "Southern Hemisphere Notes",     type: "image", src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",  aspect: "1:1",  colorClass: "cell--red",    tag: "Calendars · 039",
    content: "<p>Christmas in summer is not merely a novelty. It is a dislocation of the deep cognitive associations between season and occasion, associations so thoroughly naturalized in Northern European culture that they feel like physics.</p><p>The southern summer is genuinely hotter than the northern, due to Earth's orbital eccentricity. But it's the cultural disorientation that proves revealing — how much of what we call feeling is actually just weather.</p>" },

  { id: 40, title: "Vertical Farming",           subtitle: "Interior Agriculture",          type: "image", src: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80",  aspect: "4:5",  colorClass: "cell--blue",   tag: "Systems · 040",
    content: "<p>The vertical farm eliminates weather. No drought, no flood, no pest pressure, no seasonal constraint. Crops grow in precisely controlled light, at precisely controlled temperatures, in nutrient solutions calibrated to the gram.</p><p>What it also eliminates is everything that made farming a relationship between humans and environment. The farm becomes a factory. The question of whether this is an improvement depends entirely on what you think farming is for.</p>" },

  { id: 41, title: "[ 40°N / 74°W ]",            subtitle: "",                              type: "empty", src: "",                                                                                               aspect: "1:1",  colorClass: "cell--empty",  tag: "§ 041" },

  { id: 42, title: "Compression Study",          subtitle: "Data as Material",              type: "image", src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80", aspect: "16:9", colorClass: "cell--chalk",  tag: "Digital Theory · 042",
    content: "<p>JPEG compression works by discarding information that human visual perception is unlikely to notice — high-frequency details in areas of uniform colour, precise tonal transitions at spatial frequencies below the eye's resolution threshold.</p><p>Every JPEG is therefore a collaboration between the image and a model of human perception. The compression algorithm embeds a theory of vision into every file it produces.</p>" },

  { id: 43, title: "Dusk Protocols",             subtitle: "Evening Rituals Observed",      type: "image", src: "https://images.unsplash.com/photo-1494256997604-768d1f608cac?auto=format&fit=crop&w=800&q=80",  aspect: "4:5",  colorClass: "cell--red",    tag: "Anthropology · 043",
    content: "<p>Every culture has rituals for the transition between day and night — the lighting of lamps, the preparation of a specific meal, the gathering of people who were dispersed during daylight hours. These rituals predate electricity. They predate civilization.</p><p>The transition from light to dark was once genuinely dangerous. The rituals that surrounded it may have been designed to manage collective anxiety about that danger. They persist now as comfort even after the danger has been removed.</p>" },

  { id: 44, title: "Permafrost Records",         subtitle: "Ice Core Archives",             type: "text",  src: "",                                                                                               aspect: "2:1",  colorClass: "cell--blue",   tag: "Climatology · 044",
    content: "<p>Ice cores drilled from Greenland and Antarctica contain air bubbles trapped when the ice formed. Those bubbles contain the atmosphere as it was — precise concentrations of every gas, preserved for up to 800,000 years. We can read the CO₂ of the Roman Empire.</p>" },

  { id: 45, title: "Structural Colour",          subtitle: "Without Pigment",               type: "image", src: "https://images.unsplash.com/photo-1444927714506-8492d94b4e3d?auto=format&fit=crop&w=800&q=80",  aspect: "1:1",  colorClass: "cell--ink",    tag: "Biology · 045",
    content: "<p>The morpho butterfly's blue wings contain no blue pigment. The colour is produced by nano-scale structures that interfere with light — selectively reflecting wavelengths in the blue range through a process equivalent to thin-film interference.</p><p>The blue exists only in the interaction between the structure and the light. Change the angle and the colour shifts. The wings are not blue; they produce blueness.</p>" },

  { id: 46, title: "Sound Maps",                 subtitle: "Acoustic Cartography",          type: "image", src: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",  aspect: "4:5",  colorClass: "cell--yellow",  tag: "Soundscapes · 046",
    content: "<p>Acoustic ecologists record soundscapes to measure ecological health. A diverse soundscape — many frequencies, many call types, complex temporal patterns — indicates a healthy, complex ecosystem. A simplified soundscape indicates stress.</p><p>Urban soundscapes are complex but not diverse. High amplitude, narrow frequency range, dominated by mechanical sources. Loud but impoverished, in the same way a monoculture crop field is productive but not rich.</p>" },

  { id: 47, title: "[ 23°N / 45°E ]",            subtitle: "",                              type: "empty", src: "",                                                                                               aspect: "1:1",  colorClass: "cell--empty",  tag: "§ 047" },

  { id: 48, title: "Abandoned Futures",          subtitle: "Retrofuturism Survey",          type: "image", src: "https://images.unsplash.com/photo-1484950763426-56b5bf172dbb?auto=format&fit=crop&w=1200&q=80", aspect: "16:9", colorClass: "cell--ink",    tag: "History of Ideas · 048",
    content: "<p>The 1964 World's Fair promised a city of the future in which highways would flow through parkland, towers would be spaced generously, and every family would own a helicopter. None of it happened. The future it depicted was already being critiqued at the moment of its display.</p><p>What failed was not the technology but the social assumptions built into the design. The parkland highways required a different kind of city. The city already existed and was not going to change to accommodate the highways.</p>" },

  { id: 49, title: "Thermal Portrait",           subtitle: "Heat Signatures",               type: "image", src: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?auto=format&fit=crop&w=800&q=80",  aspect: "4:5",  colorClass: "cell--red",    tag: "Technology · 049",
    content: "<p>Thermographic cameras don't show you what things look like. They show you what things emit — infrared radiation proportional to temperature. The image reveals a different ontology of the scene: not surface colour but thermal state.</p><p>Buildings leak heat in characteristic patterns. Faces show stress as temperature change. Animals in cold environments are almost invisible. The thermal image is not a substitute for vision; it is a different sense entirely.</p>" },

  { id: 50, title: "The Last Analogue",          subtitle: "Before the Transition",         type: "text",  src: "",                                                                                               aspect: "1:1",  colorClass: "cell--chalk",  tag: "Essay · 050",
    content: "<p>There are still things that have not been digitised. Not because it's impossible but because no one has gotten around to it, or because the act of digitisation would destroy what makes them valuable, or because the people who hold them prefer it this way.</p><p>The handwritten letter. The darkroom print. The vinyl master. Not fetish objects but genuine carriers of information that has no digital equivalent — the pressure of a specific hand, the chemistry of a specific developer, the groove cut by a specific lathe at a specific moment.</p><p>When those objects are gone, what they carried is gone. The digital version is not a record of the same thing. It is a record of something related but different.</p>" }
];

/* ─── 2. Configuration & Shared State ───────────────────────────── */
const GRID_COLS = 6;
const GAP = 5;

const state = {
  offsetX: 0, offsetY: 0,
  isDragging: false,
  lastX: 0, lastY: 0,
  velX: 0, velY: 0,
  startX: 0, startY: 0,
  gridW: 0, gridH: 0,
  rafId: null,
  layoutArray: []
};

const root = document.getElementById('canvas-root');

/* ─── 3. Vector Icon SVGs ───────────────────────────────────────── */
function imageIconSVG() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
}
function textIconSVG() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="14" y2="15"/><line x1="10" y1="21" x2="10" y2="3"/></svg>`;
}

/* ─── 4. Geometric Layout Packer (Skyline algorithm) ─────────────
   Finds the lowest available row for each cell by scanning every
   possible column position, rather than marching forward only.
   This is what makes the Mondrian grid pack tightly — a small 1×1
   cell that comes later in the dataset can still fill a gap left
   behind by a taller neighbour earlier in the row, instead of being
   forced to start a brand new row underneath everything.            */
function buildDynamicLayout(unitW) {
  const packed = [];
  // columnHeights[c] = the next free row index in column c
  const columnHeights = new Array(GRID_COLS).fill(0);

  function findBestSlot(colSpan, rowSpan) {
    let bestCol = 0;
    let bestRow = Infinity;

    // Scan every possible starting column, find the row at which
    // this span would actually sit (limited by its tallest blocking
    // column), then keep whichever option gives the LOWEST row —
    // i.e. the slot that lets this cell sit as high up as possible.
    for (let col = 0; col <= GRID_COLS - colSpan; col++) {
      let rowForThisCol = 0;
      for (let c = col; c < col + colSpan; c++) {
        rowForThisCol = Math.max(rowForThisCol, columnHeights[c]);
      }
      if (rowForThisCol < bestRow) {
        bestRow = rowForThisCol;
        bestCol = col;
      }
    }

    return { col: bestCol, row: bestRow };
  }

  STORIES.forEach((story) => {
    let colSpan = 1;
    let rowSpan = 1;

    if (story.aspect === "16:9") { colSpan = 3; rowSpan = 2; }
    else if (story.aspect === "4:5") { colSpan = 2; rowSpan = 3; }
    else if (story.aspect === "2:1") { colSpan = 2; rowSpan = 1; }
    else if (story.aspect === "1:1") { colSpan = 2; rowSpan = 2; }

    if (story.type === "empty") { colSpan = 1; rowSpan = 1; }

    const { col, row } = findBestSlot(colSpan, rowSpan);

    const posX = col * (unitW + GAP);
    const posY = row * (unitW + GAP);
    const cellW = colSpan * unitW + (colSpan - 1) * GAP;
    const cellH = rowSpan * unitW + (rowSpan - 1) * GAP;

    packed.push({ story, x: posX, y: posY, w: cellW, h: cellH });

    for (let c = col; c < col + colSpan; c++) {
      columnHeights[c] = row + rowSpan;
    }
  });

  const maxColumnRowHeight = Math.max(...columnHeights);
  const totalGridHeight = maxColumnRowHeight * (unitW + GAP);

  return { cells: packed, totalHeight: totalGridHeight };
}

/* ─── 5. DOM Cell Generator ─────────────────────────────────────── */
function createDOMCellNode(item) {
  const cell = document.createElement('div');
  cell.className = `cell ${item.story.colorClass}`;
  cell.style.left = `${item.x}px`;
  cell.style.top  = `${item.y}px`;
  cell.style.width  = `${item.w}px`;
  cell.style.height = `${item.h}px`;
  cell.setAttribute('data-story-id', item.story.id);


  if (item.story.type === 'empty') {
    const meta = document.createElement('div');
    meta.className = 'cell__meta';
    meta.innerHTML = `<div class="meta-coord" style="font-family:var(--font-mono); font-size:9px; opacity:0.4; color:#fff;">${item.story.tag}</div>`;
    cell.appendChild(meta);
    return cell;
  }

  const caption = document.createElement('div');
  caption.className = 'cell__caption';

  const header = document.createElement('div');
  header.innerHTML = `<div class="cell__tag">${item.story.tag}</div><div class="cell__title">${item.story.title}</div>`;
  caption.appendChild(header);

  const footer = document.createElement('div');
  footer.innerHTML = `<div class="cell__subtitle">${item.story.subtitle}</div><div class="cell__cta">Read Story</div>`;
  caption.appendChild(footer);

  cell.appendChild(caption);

  if (item.story.src) {
    const media = document.createElement('img');
    media.className = 'cell__media';
    media.src = item.story.src;
    media.alt = item.story.title;
    media.loading = 'lazy';
    media.draggable = false;
    media.setAttribute('ondragstart', 'return false');
    cell.appendChild(media);
  } else {
    const mock = document.createElement('div');
    mock.className = 'cell__img-mock';
    mock.innerHTML = item.story.type === 'image' ? imageIconSVG() : textIconSVG();
    cell.appendChild(mock);
  }

  return cell;
}

/* ─── 6. Matrix View Builder ────────────────────────────────────── */
function build() {
  const vw = window.innerWidth;
  
  // Apply layout expansion configuration to create a noticeably wider canvas view
  const scaleFactor = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--grid-scale-factor') || 1);
  const baseUnitW = Math.floor((vw - (GAP * (GRID_COLS - 1))) / GRID_COLS);
  const unitW = Math.floor(baseUnitW * scaleFactor);

  const layout = buildDynamicLayout(unitW);
  state.layoutArray = layout.cells;
  state.gridW = GRID_COLS * (unitW + GAP);
  state.gridH = layout.totalHeight;

  for (let i = 0; i < 9; i++) {
    const container = document.getElementById(`tile-${i}`);
    if (!container) continue;
    container.innerHTML = '';
    container.style.width  = `${state.gridW}px`;
    container.style.height = `${state.gridH}px`;
    state.layoutArray.forEach(item => container.appendChild(createDOMCellNode(item)));
  }

  if (state.offsetX === 0 && state.offsetY === 0) {
    state.offsetX = -Math.floor(state.gridW  - window.innerWidth  / 2);
    state.offsetY = -Math.floor(state.gridH - window.innerHeight / 2);
  }
}

/* ─── 7. Render / Tick Loop ─────────────────────────────────────── */
function tick() {
  if (isAnimatingModal) {
    state.rafId = requestAnimationFrame(tick);
    return;
  }

  if (!state.isDragging) {
    state.velX *= 0.92;
    state.velY *= 0.92;
    
    if (Math.abs(state.velX) < 0.005) state.velX = 0;
    if (Math.abs(state.velY) < 0.005) state.velY = 0;
    
    state.offsetX += state.velX;
    state.offsetY += state.velY;
  }

  const wrappedX = ((state.offsetX % state.gridW) + state.gridW) % state.gridW;
  const wrappedY = ((state.offsetY % state.gridH) + state.gridH) % state.gridH;

  for (let ty = 0; ty < 3; ty++) {
    for (let tx = 0; tx < 3; tx++) {
      const tileIndex = ty * 3 + tx;
      const tile = document.getElementById(`tile-${tileIndex}`);
      if (!tile) continue;

      let renderX = (tx - 1) * state.gridW + wrappedX;
      let renderY = (ty - 1) * state.gridH + wrappedY;

      if (renderX >= state.gridW)  renderX -= 3 * state.gridW;
      if (renderX < -state.gridW)  renderX += 3 * state.gridW;
      if (renderY >= state.gridH)  renderY -= 3 * state.gridH;
      if (renderY < -state.gridH)  renderY += 3 * state.gridH;

      tile.style.transform = `translate3d(${renderX}px, ${renderY}px, 0)`;
    }
  }

  const hudCoords = document.getElementById('hud-coords');
  if (hudCoords) {
    const lon = Math.floor(Math.abs(state.offsetX) % 180);
    const lat = Math.floor(Math.abs(state.offsetY) % 90);
    hudCoords.textContent = `${lat}°N / ${lon}°E`;
  }

  state.rafId = requestAnimationFrame(tick);
}

/* ─── 8. FLIP Animation Controller ─────────────────────────────── */
let activeStory    = null;
let activeCellEl   = null;
let isAnimatingModal = false;

function populateModalContent(story, mediaContainer) {
  document.getElementById('modal-story-tag').textContent      = story.tag      || '';
  document.getElementById('modal-story-title').textContent    = story.title    || '';
  document.getElementById('modal-story-subtitle').textContent = story.subtitle || '';

  const bodyEl = document.getElementById('modal-story-body');
  bodyEl.innerHTML = story.content || `<p>Expanded record for <strong>${story.title}</strong>.</p>`;

  mediaContainer.innerHTML = '';
  if (story.src) {
    const img = document.createElement('img');
    img.src = story.src;
    img.alt = story.title;
    img.draggable = false;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    mediaContainer.appendChild(img);
  } else {
    const mock = document.createElement('div');
    mock.className = 'cell__img-mock';
    mock.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0.15;color:#111;';
    mock.innerHTML = story.type === 'image' ? imageIconSVG() : textIconSVG();
    mediaContainer.appendChild(mock);
  }
}

function openStoryModal(story, cellEl) {
  if (isAnimatingModal) return;
  isAnimatingModal = true;
  activeStory  = story;
  activeCellEl = cellEl;

  state.velX = 0;
  state.velY = 0;

  const modalOverlay   = document.getElementById('modal-stage');
  const mediaContainer = document.getElementById('modal-media-frame');
  const card           = document.getElementById('modal-card');

  // §1 Measure cell FIRST before any DOM changes
  const cellRect = cellEl.getBoundingClientRect();

  // §2 Populate content silently — modal still invisible
  populateModalContent(story, mediaContainer);
  mediaContainer.style.opacity = '0';
  card.style.opacity = '0';

  // §3 Make modal layout-present but visually invisible
  modalOverlay.style.cssText = `
    visibility: visible;
    pointer-events: none;
    background: rgba(4,4,4,0);
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
    transition: none;
    display: flex;
  `;

  // CRITICAL FIX FOR MOBILE: Temporarily flatten the 3D transform 
  // so we measure the true, final resting dimensions of the media frame.
  card.style.setProperty('transform', 'none', 'important');
  card.style.setProperty('transition', 'none', 'important');
  modalOverlay.classList.add('is-open');

  // §4 Two rAF — guarantees full layout pass with the flattened state
  requestAnimationFrame(() => requestAnimationFrame(() => {
    // Measure the true final layout geometry
    const targetRect = mediaContainer.getBoundingClientRect();

    // Reset the card back to its initial tilted state immediately 
    // so it can transition normally alongside the clone
    modalOverlay.classList.remove('is-open');
    card.style.transform = '';
    card.style.transition = '';
    
    // Force a single synthetic reflow to lock the initial tilt state back in
    card.getBoundingClientRect();

    // §5 Build clone at cell position
    const existingClone = document.getElementById('flip-clone');
    if (existingClone) existingClone.remove();

    const cellBg = window.getComputedStyle(cellEl).backgroundColor;
    const clone  = document.createElement('div');
    clone.id = 'flip-clone';
    clone.style.cssText = `
      position: fixed;
      left: ${cellRect.left}px;
      top: ${cellRect.top}px;
      width: ${cellRect.width}px;
      height: ${cellRect.height}px;
      background: ${cellBg};
      overflow: hidden;
      z-index: 9999;
      pointer-events: none;
    `;

    if (story.src) {
      const img = document.createElement('img');
      img.src = story.src;
      img.draggable = false;
      img.style.cssText = `
        position: absolute; inset: 0;
        width: 100%; height: 100%;
        object-fit: cover;
        display: block;
      `;
      clone.appendChild(img);
    }

    document.body.appendChild(clone);

    // §6 Force reflow for clone positioning
    clone.getBoundingClientRect();

    // §7 & §8 Morph seamlessly to the true un-warped target layout coordinates
    clone.style.willChange = 'left, top, width, height';
    clone.style.transition = `
      left 0.9s cubic-bezier(0.16, 1, 0.3, 1),
      top 0.9s cubic-bezier(0.16, 1, 0.3, 1),
      width 0.9s cubic-bezier(0.16, 1, 0.3, 1),
      height 0.9s cubic-bezier(0.16, 1, 0.3, 1)
    `;
    
    clone.style.left   = `${targetRect.left}px`;
    clone.style.top    = `${targetRect.top}px`;
    clone.style.width  = `${targetRect.width}px`;
    clone.style.height = `${targetRect.height}px`;

    // Fire the CSS transforms entry animations now
    modalOverlay.classList.add('is-open');

    requestAnimationFrame(() => {
      modalOverlay.style.cssText = `
        visibility: visible;
        pointer-events: none;
        display: flex;
        transition: background 0.45s cubic-bezier(0.16, 1, 0.3, 1),
                    backdrop-filter 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        background: rgba(4,4,4,0.82);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      `;
    });

    // §10 Swap clone out for real structural card view components
    let settled = false;
    function onOpenDone() {
      if (settled) return;
      settled = true;

      clone.style.willChange = '';
      clone.remove();

      card.style.transition = 'opacity 0.2s ease';
      card.style.opacity    = '1';

      mediaContainer.style.transition = 'opacity 0.2s ease';
      mediaContainer.style.opacity    = '1';

      modalOverlay.classList.add('content-visible');
      modalOverlay.style.pointerEvents = 'auto';

      isAnimatingModal = false;
    }

    clone.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'width') onOpenDone();
    }, { once: true });

    setTimeout(onOpenDone, 680);
  }));
}

function closeStoryModal() {
  if (isAnimatingModal || !activeStory || !activeCellEl) return;
  isAnimatingModal = true;

  state.velX = 0;
  state.velY = 0;

  const modalOverlay   = document.getElementById('modal-stage');
  const mediaContainer = document.getElementById('modal-media-frame');
  const card           = document.getElementById('modal-card');

  // §1 Capture real-time dimensions of the active open media viewport and destination cell
  const targetRect = mediaContainer.getBoundingClientRect();
  const cellRect   = activeCellEl.getBoundingClientRect();

  // §2 Immediately hide the real card layout and clear state classes to initiate mobile CSS slide-down
  card.style.transition  = 'none';
  card.style.opacity     = '0';
  mediaContainer.style.opacity = '0';
  modalOverlay.classList.remove('content-visible');
  modalOverlay.classList.remove('is-open');
  modalOverlay.style.pointerEvents = 'none';

  // §3 Smoothly fade out the backdrop blurring overlay
  modalOverlay.style.transition = `
    background 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    backdrop-filter 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    visibility 0s linear 0.95s
  `;
  modalOverlay.style.background = 'rgba(4,4,4,0)';
  modalOverlay.style.backdropFilter = 'blur(0px)';
  modalOverlay.style.webkitBackdropFilter = 'blur(0px)';

  // §4 Build the canvas morphing clone starting at the open media container's bounds
  const existingClone = document.getElementById('flip-clone');
  if (existingClone) existingClone.remove();

  const cellBg = window.getComputedStyle(activeCellEl).backgroundColor;
  const clone  = document.createElement('div');
  clone.id = 'flip-clone';
  clone.style.cssText = `
    position: fixed;
    left: ${targetRect.left}px;
    top: ${targetRect.top}px;
    width: ${targetRect.width}px;
    height: ${targetRect.height}px;
    background: ${cellBg};
    overflow: hidden;
    z-index: 9999;
    pointer-events: none;
    will-change: left, top, width, height, opacity;
  `;

  if (activeStory.src) {
    const img = document.createElement('img');
    img.src = activeStory.src;
    img.draggable = false;
    img.style.cssText = `
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      display: block;
    `;
    clone.appendChild(img);
  }

  document.body.appendChild(clone);

  // Force layout engine recalculation pass
  clone.getBoundingClientRect();

  // §5 Transition dimensions and positions smoothly back into the native grid row/column matrix
  clone.style.transition = `
    left 0.9s cubic-bezier(0.16, 1, 0.3, 1),
    top 0.9s cubic-bezier(0.16, 1, 0.3, 1),
    width 0.9s cubic-bezier(0.16, 1, 0.3, 1),
    height 0.9s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.3s ease 0.18s
  `;
  clone.style.left    = `${cellRect.left}px`;
  clone.style.top     = `${cellRect.top}px`;
  clone.style.width   = `${cellRect.width}px`;
  clone.style.height  = `${cellRect.height}px`;
  clone.style.opacity = '0';

  const capturedCell = activeCellEl;
  let settled = false;

  function onCloseDone() {
    if (settled) return;
    settled = true;

    clone.remove();
    capturedCell.style.opacity = '';

    // Reset overlay layout back to standard hidden base state
    modalOverlay.style.cssText = `
      display: flex;
      visibility: hidden;
      pointer-events: none;
      background: rgba(4,4,4,0);
      backdrop-filter: blur(0px);
      transition: none;
    `;

    // Completely scrub custom inline style attributes to keep DOM pristine
    card.style.cssText = '';
    mediaContainer.style.cssText = '';
    mediaContainer.innerHTML = '';

    // Cleanly clear away the temporary !important properties we injected during measurement
    card.style.removeProperty('transform');
    card.style.removeProperty('transition');

    activeStory      = null;
    activeCellEl     = null;
    isAnimatingModal = false;
  }

  // Listen to 'opacity' or 'top' transitions (on mobile, width might be matching, which bypasses width events)
  clone.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'opacity' || e.propertyName === 'top') onCloseDone();
  }, { once: true });

  // Ultimate fallback execution boundary
  setTimeout(onCloseDone, 620);
}
/* ─── 9. Pointer Interaction Layer ─────────────────────────────── */
function onPointerDown(e) {

  state.isDragging = true;
  state.startX = e.clientX;
  state.startY = e.clientY;
  state.lastX  = e.clientX;
  state.lastY  = e.clientY;
  state.velX   = 0;
  state.velY   = 0;
  root.classList.add('dragging');
  if (root.setPointerCapture) root.setPointerCapture(e.pointerId);
}

function onPointerMove(e) {
  if (!state.isDragging) return;
  const dx = e.clientX - state.lastX;
  const dy = e.clientY - state.lastY;
  state.velX     = dx;
  state.velY     = dy;
  state.offsetX += dx;
  state.offsetY += dy;
  state.lastX    = e.clientX;
  state.lastY    = e.clientY;
}

function onPointerUp(e) {
  if (!state.isDragging) return;
  state.isDragging = false;
  root.classList.remove('dragging');
  if (root.releasePointerCapture) {
    try { root.releasePointerCapture(e.pointerId); } catch (_) {}
  }

  const dragDistance = Math.hypot(e.clientX - state.startX, e.clientY - state.startY);

  if (dragDistance < 6) {
    const target = document.elementFromPoint(e.clientX, e.clientY);
    const cell   = target ? target.closest('.cell') : null;
    if (cell) {
      const storyId = parseInt(cell.getAttribute('data-story-id'), 10);
      const story   = STORIES.find(s => s.id === storyId);
      if (story && story.type !== 'empty') {
        openStoryModal(story, cell);
      }
    }
  }
}

/* ─── 10. Initialization ────────────────────────────────────────── */
root.addEventListener('pointerdown',   onPointerDown);
root.addEventListener('pointermove',   onPointerMove);
root.addEventListener('pointerup',     onPointerUp);
root.addEventListener('pointercancel', onPointerUp);
root.addEventListener('pointerleave',  onPointerUp);
root.addEventListener('touchstart', e => {
  if (e.target.closest('#canvas-root')) e.preventDefault();
}, { passive: false });

/* Macro View Event State Transition Logic Trigger Configuration */
/* ─── Replay SAC Splash Animation ───────────────────────────────── */
const macroToggleBtn = document.getElementById('macro-toggle-btn');
if (macroToggleBtn) {
  macroToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (typeof window.replaySplash === 'function') {
      window.replaySplash();
    }
  });
}

document.getElementById('modal-close-trigger').addEventListener('click', e => {
  e.stopPropagation();
  closeStoryModal();
});

document.getElementById('modal-stage').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-stage')) closeStoryModal();
});

document.getElementById('modal-like-button').addEventListener('click', function () {
  this.classList.toggle('liked');
  document.getElementById('modal-likes-counter').textContent =
    this.classList.contains('liked') ? '1 Verified Signature' : '0 Signatures';
});

document.getElementById('modal-share-button').addEventListener('click', function () {
  navigator.clipboard.writeText(window.location.href).catch(() => {});
  const orig = this.innerHTML;
  this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#0077B6" stroke-width="1.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  setTimeout(() => { this.innerHTML = orig; }, 2000);
});

window.addEventListener('keydown', e => { if (e.key === 'Escape') closeStoryModal(); });

window.addEventListener('resize', () => {
  cancelAnimationFrame(state.rafId);
  build();
  state.rafId = requestAnimationFrame(tick);
});

/* Boot Setup Execution */
build();
state.rafId = requestAnimationFrame(tick);
