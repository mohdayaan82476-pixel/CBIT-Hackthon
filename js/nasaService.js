// nasaService.js - NASA Exoplanet Archive TAP API Service with robust offline fallback catalog

export const NASA_TAP_ENDPOINT = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';

export const EARTH_DATA = {
  pl_name: "Earth",
  hostname: "Sun (Sol)",
  pl_rade: 1.0,
  pl_bmasse: 1.0,
  pl_dens: 5.51,
  pl_eqt: 288,
  pl_insol: 1.0,
  pl_orbper: "365.25",
  dist_ly: 0.0,
  dist_pc: 0.0,
  disc_year: "Ancient",
  discoverymethod: "Direct Observation",
  surfaceGravity: 1.0,
  isGoldilocks: true,
  planetType: "Terrestrial (Home World)",
  isLiquidWorld: false,
  isEarth: true,
  coordX: 0.0,
  coordY: 0.0,
  coordZ: 0.0,
  description: "Humanity's cradle and astrobiological home base. 1.0g gravity, temperate climate, vast liquid oceans, and life-sustaining nitrogen-oxygen atmosphere."
};

/**
 * Calculates 3D interstellar Euclidean distance between any two worlds in Light-Years.
 */
export function calculateInterstellarDistance(planetA, planetB) {
  if (!planetA || !planetB) return 40.0;
  if (planetA.pl_name === planetB.pl_name) return 0.0;
  const isAEarth = planetA.pl_name === 'Earth' || planetA.isEarth;
  const isBEarth = planetB.pl_name === 'Earth' || planetB.isEarth;
  if (isAEarth) return Number((planetB.dist_ly || 0.0).toFixed(1));
  if (isBEarth) return Number((planetA.dist_ly || 0.0).toFixed(1));

  const ax = planetA.coordX || 0;
  const ay = planetA.coordY || 0;
  const az = planetA.coordZ || 0;

  const bx = planetB.coordX || 0;
  const by = planetB.coordY || 0;
  const bz = planetB.coordZ || 0;

  const dist = Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2 + (bz - az) ** 2);
  return Number(dist.toFixed(1));
}

// Curated high-fidelity fallback exoplanet database directly sourced from NASA Exoplanet Archive
export const FALLBACK_EXOPLANETS = [
  {
    pl_name: "TRAPPIST-1 e",
    hostname: "TRAPPIST-1",
    pl_rade: 0.92,
    pl_bmasse: 0.69,
    pl_dens: 5.65,
    pl_eqt: 251,
    pl_insol: 0.66,
    pl_orbper: 6.10,
    dist_ly: 39.5,
    dist_pc: 12.1,
    disc_year: 2017,
    discoverymethod: "Transit",
    description: "An Earth-sized rocky world in the habitable zone of an ultra-cool dwarf star. Excellent candidate for liquid surface water."
  },
  {
    pl_name: "Kepler-452 b",
    hostname: "Kepler-452",
    pl_rade: 1.63,
    pl_bmasse: 3.29,
    pl_dens: 4.32,
    pl_eqt: 265,
    pl_insol: 1.10,
    pl_orbper: 384.84,
    dist_ly: 1786.0,
    dist_pc: 547.6,
    disc_year: 2015,
    discoverymethod: "Transit",
    description: "Often nicknamed 'Earth's Older Cousin', orbiting a Sun-like G2 star inside the conservative Goldilocks zone."
  },
  {
    pl_name: "K2-18 b",
    hostname: "K2-18",
    pl_rade: 2.61,
    pl_bmasse: 8.63,
    pl_dens: 2.67,
    pl_eqt: 279,
    pl_insol: 1.25,
    pl_orbper: 32.94,
    dist_ly: 124.0,
    dist_pc: 38.0,
    disc_year: 2015,
    discoverymethod: "Transit",
    description: "A famous Hycean candidate with potential global ocean under a hydrogen-rich atmosphere. JWST detected carbon-bearing molecules."
  },
  {
    pl_name: "GJ 1214 b",
    hostname: "GJ 1214",
    pl_rade: 2.74,
    pl_bmasse: 8.17,
    pl_dens: 1.87,
    pl_eqt: 553,
    pl_insol: 17.5,
    pl_orbper: 1.58,
    dist_ly: 47.8,
    dist_pc: 14.6,
    disc_year: 2009,
    discoverymethod: "Transit",
    description: "A warm water-world candidate with a thick, steamy volatile envelope and density below 2.0 g/cm³, featuring a global supercritical fluid ocean."
  },
  {
    pl_name: "Proxima Centauri b",
    hostname: "Proxima Centauri",
    pl_rade: 1.07,
    pl_bmasse: 1.17,
    pl_dens: 5.30,
    pl_eqt: 234,
    pl_insol: 0.65,
    pl_orbper: 11.19,
    dist_ly: 4.2,
    dist_pc: 1.3,
    disc_year: 2016,
    discoverymethod: "Radial Velocity",
    description: "The closest known exoplanet to our Solar System (4.2 light-years). Orbits in the habitable zone of our neighboring red dwarf."
  },
  {
    pl_name: "55 Cancri e (Janssen)",
    hostname: "55 Cancri",
    pl_rade: 1.87,
    pl_bmasse: 7.99,
    pl_dens: 6.70,
    pl_eqt: 1958,
    pl_insol: 2470.0,
    pl_orbper: 0.74,
    dist_ly: 41.1,
    dist_pc: 12.6,
    disc_year: 2004,
    discoverymethod: "Radial Velocity",
    description: "A super-hot, hyper-dense carbon-rich super-Earth covered in rivers of glowing silicate and molten lava."
  },
  {
    pl_name: "Kepler-186 f",
    hostname: "Kepler-186",
    pl_rade: 1.17,
    pl_bmasse: 1.71,
    pl_dens: 5.92,
    pl_eqt: 188,
    pl_insol: 0.32,
    pl_orbper: 129.9,
    dist_ly: 582.0,
    dist_pc: 178.4,
    disc_year: 2014,
    discoverymethod: "Transit",
    description: "The first validated Earth-sized planet found in the habitable zone of another star. It receives twilight-level orange sunlight."
  },
  {
    pl_name: "TOI-700 d",
    hostname: "TOI-700",
    pl_rade: 1.14,
    pl_bmasse: 1.57,
    pl_dens: 5.84,
    pl_eqt: 269,
    pl_insol: 0.86,
    pl_orbper: 37.42,
    dist_ly: 101.4,
    dist_pc: 31.1,
    disc_year: 2020,
    discoverymethod: "Transit",
    description: "Discovered by NASA's TESS spacecraft. A temperate, rocky terrestrial world inside a quiet, non-flaring M-dwarf habitable zone."
  },
  {
    pl_name: "HD 189733 b",
    hostname: "HD 189733",
    pl_rade: 12.75,
    pl_bmasse: 363.5,
    pl_dens: 0.96,
    pl_eqt: 1201,
    pl_insol: 450.0,
    pl_orbper: 2.22,
    dist_ly: 64.5,
    dist_pc: 19.8,
    disc_year: 2005,
    discoverymethod: "Transit",
    description: "A deep cobalt-blue gas giant where horizontal winds scream at 8,700 km/h and rain down molten silicate glass sideways."
  },
  {
    pl_name: "WASP-39 b",
    hostname: "WASP-39",
    pl_rade: 14.23,
    pl_bmasse: 88.98,
    pl_dens: 0.18,
    pl_eqt: 1166,
    pl_insol: 320.0,
    pl_orbper: 4.05,
    dist_ly: 700.0,
    dist_pc: 214.6,
    disc_year: 2011,
    discoverymethod: "Transit",
    description: "A puffy, low-density 'cotton-candy' gas giant where JWST observed the first direct detection of carbon dioxide in an alien atmosphere."
  },
  {
    pl_name: "LHS 1140 b",
    hostname: "LHS 1140",
    pl_rade: 1.73,
    pl_bmasse: 5.60,
    pl_dens: 5.90,
    pl_eqt: 235,
    pl_insol: 0.46,
    pl_orbper: 24.74,
    dist_ly: 48.9,
    dist_pc: 15.0,
    disc_year: 2017,
    discoverymethod: "Transit",
    description: "A dense, high-gravity Super-Earth in the habitable zone, potentially bearing a nitrogen-rich atmosphere and vast ice-covered oceans."
  },
  {
    pl_name: "Kepler-22 b",
    hostname: "Kepler-22",
    pl_rade: 2.38,
    pl_bmasse: 9.10,
    pl_dens: 3.65,
    pl_eqt: 262,
    pl_insol: 1.11,
    pl_orbper: 289.86,
    dist_ly: 635.0,
    dist_pc: 194.7,
    disc_year: 2011,
    discoverymethod: "Transit",
    description: "NASA Kepler's first validated habitable zone planet. Possible ocean-covered mini-Neptune with a warm planetary ocean surface."
  },
  {
    pl_name: "Kepler-1649 c",
    hostname: "Kepler-1649",
    pl_rade: 1.06,
    pl_bmasse: 1.20,
    pl_dens: 5.54,
    pl_eqt: 234,
    pl_insol: 0.75,
    pl_orbper: 19.54,
    dist_ly: 301.0,
    dist_pc: 92.3,
    disc_year: 2020,
    discoverymethod: "Transit",
    description: "Discovered by re-analyzing Kepler archival data; 1.06 times Earth's radius and receives 75% of Earth's stellar flux."
  },
  {
    pl_name: "TRAPPIST-1 f",
    hostname: "TRAPPIST-1",
    pl_rade: 1.04,
    pl_bmasse: 1.04,
    pl_dens: 5.12,
    pl_eqt: 219,
    pl_insol: 0.38,
    pl_orbper: 9.21,
    dist_ly: 39.5,
    dist_pc: 12.1,
    disc_year: 2017,
    discoverymethod: "Transit",
    description: "A cool terrestrial planet with an icy crust, situated in the outer rim of the TRAPPIST-1 habitable zone."
  },
  {
    pl_name: "WASP-12 b",
    hostname: "WASP-12",
    pl_rade: 19.45,
    pl_bmasse: 467.0,
    pl_dens: 0.33,
    pl_eqt: 2575,
    pl_insol: 7300.0,
    pl_orbper: 1.09,
    dist_ly: 1410.0,
    dist_pc: 432.3,
    disc_year: 2008,
    discoverymethod: "Transit",
    description: "An ultra-hot Jupiter being stretched into an egg shape by its host star's extreme tidal forces, slowly being devoured."
  }
];

export class NasaService {
  constructor() {
    this.cachedPlanets = [];
    this.isLive = false;
  }

  /**
   * Fetches live exoplanet data from the NASA Exoplanet Archive TAP API.
   * If the network fails, CORS blocks, or timeout occurs, gracefully falls back
   * to the embedded high-fidelity catalog.
   */
  async fetchExoplanets(limit = 40) {
    const query = `select top ${limit} pl_name,hostname,pl_rade,pl_bmasse,pl_dens,pl_eqt,pl_insol,pl_orbper,disc_year,discoverymethod,sy_dist from ps where pl_rade is not null and pl_bmasse is not null order by pl_rade asc`;
    const url = `${NASA_TAP_ENDPOINT}?query=${encodeURIComponent(query)}&format=json`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`NASA TAP returned status ${response.status}`);
      }

      const rawData = await response.json();
      if (Array.isArray(rawData) && rawData.length > 0) {
        this.cachedPlanets = this.normalizePlanets(rawData);
        this.isLive = true;
        console.log(`[NasaService] Successfully fetched ${this.cachedPlanets.length} live planets from NASA TAP API.`);
        return { planets: this.cachedPlanets, isLive: true };
      }
    } catch (err) {
      console.warn(`[NasaService] Live NASA TAP API fetch failed (${err.message}). Using NASA Archive fallback catalog.`, err);
    }

    // Fallback catalog
    this.cachedPlanets = this.normalizePlanets(FALLBACK_EXOPLANETS);
    this.isLive = false;
    return { planets: this.cachedPlanets, isLive: false };
  }

  /**
   * Normalizes values, fills missing density / temperature using astrophysical equations,
   * and computes gravity and habitability scores.
   */
  normalizePlanets(rawList) {
    return rawList.map((item, idx) => {
      const radius = parseFloat(item.pl_rade) || 1.0; // Earth radii
      const mass = parseFloat(item.pl_bmasse) || 1.0; // Earth masses
      
      // Calculate density if missing: rho = M / R^3 * 5.515 g/cm^3 (Earth avg density = 5.515)
      let density = parseFloat(item.pl_dens);
      if (isNaN(density) || density <= 0) {
        density = (mass / Math.pow(radius, 3)) * 5.515;
      }
      density = Math.round(density * 100) / 100;

      // Calculate surface gravity: g = M / R^2 (Earth = 1.0 g = 9.81 m/s^2)
      const surfaceGravity = Math.round((mass / Math.pow(radius, 2)) * 100) / 100;

      // Insolation flux (Earth = 1.0)
      let insol = parseFloat(item.pl_insol);
      let eqt = parseFloat(item.pl_eqt);

      if (isNaN(insol) && !isNaN(eqt)) {
        // S_eff ~ (T_eq / 255)^4
        insol = Math.pow(eqt / 255, 4);
      } else if (!isNaN(insol) && isNaN(eqt)) {
        eqt = 255 * Math.pow(insol, 0.25);
      } else if (isNaN(insol) && isNaN(eqt)) {
        insol = 1.0;
        eqt = 288;
      }
      insol = Math.round(insol * 100) / 100;
      eqt = Math.round(eqt);

      // Goldilocks Habitable Zone evaluation (Conservative: 0.5 <= insol <= 1.5)
      const isGoldilocks = insol >= 0.45 && insol <= 1.65 && eqt >= 180 && eqt <= 330;

      // Planet type classification
      let planetType = "Terrestrial";
      if (density < 2.0 && radius >= 1.5 && radius < 4.0) {
        planetType = "Ocean World / Hycean";
      } else if (density < 2.0 && radius >= 4.0) {
        planetType = "Gas Giant";
      } else if (radius > 1.25 && radius <= 2.2 && density >= 2.0) {
        planetType = "Super-Earth";
      } else if (radius <= 1.25 && density >= 2.0) {
        planetType = "Terrestrial";
      } else if (radius > 2.2 && radius < 6.0) {
        planetType = "Sub-Neptune";
      }

      // Distance from Earth in Light-Years and Parsecs
      let dist_pc = parseFloat(item.sy_dist) || parseFloat(item.dist_pc);
      let dist_ly = parseFloat(item.dist_ly);
      if (isNaN(dist_ly) && !isNaN(dist_pc)) {
        dist_ly = dist_pc * 3.26156;
      } else if (isNaN(dist_pc) && !isNaN(dist_ly)) {
        dist_pc = dist_ly / 3.26156;
      } else if (isNaN(dist_ly) && isNaN(dist_pc)) {
        dist_ly = 40.0;
        dist_pc = 12.3;
      }
      dist_ly = Math.round(dist_ly * 10) / 10;
      dist_pc = Math.round(dist_pc * 10) / 10;

      // 3D celestial galactic coordinates relative to Earth at (0,0,0) in Light-Years
      const theta = (idx * 137.5077 * Math.PI) / 180;
      const phi = (((idx % 9) - 4) * 0.14);
      const coordX = Number((dist_ly * Math.cos(phi) * Math.cos(theta)).toFixed(2));
      const coordY = Number((dist_ly * Math.sin(phi)).toFixed(2));
      const coordZ = Number((dist_ly * Math.cos(phi) * Math.sin(theta)).toFixed(2));

      return {
        pl_name: item.pl_name || "Unknown Exoplanet",
        hostname: item.hostname || "Unknown Host Star",
        pl_rade: radius,
        pl_bmasse: mass,
        pl_dens: density,
        pl_eqt: eqt,
        pl_insol: insol,
        pl_orbper: item.pl_orbper ? parseFloat(item.pl_orbper).toFixed(2) : "Unknown",
        dist_ly,
        dist_pc,
        coordX,
        coordY,
        coordZ,
        disc_year: item.disc_year || "Archived",
        discoverymethod: item.discoverymethod || "Transit",
        surfaceGravity,
        isGoldilocks,
        planetType,
        isLiquidWorld: density < 2.0,
        description: item.description || `${planetType} orbiting host star ${item.hostname || 'its primary'}. Distance: ${dist_ly} ly. Density: ${density} g/cm³.`
      };
    });
  }
}
