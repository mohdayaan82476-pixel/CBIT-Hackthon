// geminiService.js - Featherless AI Service for AI Space Teacher NPC (Professor Nova)
// Powered by open-source high-speed models via Featherless API (OpenAI-compatible)

export class FeatherlessAIService {
  constructor() {
    this.storageKey = 'exoplanet_featherless_api_key';
    this.defaultApiKey = 'rc_26afd75a4b18549ffb541dc63f36d1e9ed6ed12529e5f24c36a9648815bf70ef';
    this.apiKey = this.loadApiKey();
    this.model = 'Qwen/Qwen2.5-7B-Instruct';
    this.apiEndpoint = 'https://api.featherless.ai/v1/chat/completions';
  }

  loadApiKey() {
    // 1. Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const paramKey = urlParams.get('featherlessKey') || urlParams.get('geminiKey') || urlParams.get('apiKey');
    if (paramKey) {
      localStorage.setItem(this.storageKey, paramKey.trim());
      return paramKey.trim();
    }

    // 2. Check localStorage
    const saved = localStorage.getItem(this.storageKey);
    if (saved && saved.trim().length > 5) {
      return saved.trim();
    }

    // 3. Fallback to provided default Featherless key
    localStorage.setItem(this.storageKey, this.defaultApiKey);
    return this.defaultApiKey;
  }

  setApiKey(key) {
    this.apiKey = (key || '').trim();
    if (this.apiKey) {
      localStorage.setItem(this.storageKey, this.apiKey);
    } else {
      localStorage.removeItem(this.storageKey);
      this.apiKey = this.defaultApiKey;
    }
  }

  hasApiKey() {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  /**
   * Generates Teacher comparison dialogue when landing on a new exoplanet.
   * Compares CURRENT planet with PREVIOUS planet and Earth.
   */
  /**
   * Generates an in-depth Human Compatibility Briefing comparing visited planet against previous planet.
   * If previous is Earth, benchmarks against Earth; if another planet, compares their physical and physiological stats.
   */
  async generateHumanCompatibilityComparison(currentPlanet, previousPlanet) {
    const isPrevEarth = !previousPlanet || previousPlanet.pl_name === 'Earth' || previousPlanet.isEarth;
    const isCurrentEarth = currentPlanet.pl_name === 'Earth' || currentPlanet.isEarth;

    const prevInfo = {
      name: isPrevEarth ? 'Earth' : (previousPlanet.pl_name || 'Previous World'),
      gravity: previousPlanet ? (previousPlanet.surfaceGravity || 1.0) : 1.0,
      density: previousPlanet ? (previousPlanet.pl_dens || 5.51) : 5.51,
      temperatureK: previousPlanet ? (previousPlanet.pl_eqt || 288) : 288,
      type: previousPlanet ? (previousPlanet.planetType || 'Terrestrial') : 'Terrestrial (Home World)',
      isEarth: isPrevEarth
    };

    const currentInfo = {
      name: isCurrentEarth ? 'Earth' : (currentPlanet.pl_name || 'Destination World'),
      radius: currentPlanet.pl_rade || 1.0,
      mass: currentPlanet.pl_bmasse || 1.0,
      gravity: currentPlanet.surfaceGravity || 1.0,
      density: currentPlanet.pl_dens || 5.51,
      temperatureK: currentPlanet.pl_eqt || 288,
      insolation: currentPlanet.pl_insol || 1.0,
      type: currentPlanet.planetType || 'Terrestrial',
      isLiquidWorld: Boolean(currentPlanet.isLiquidWorld),
      isGoldilocks: Boolean(currentPlanet.isGoldilocks),
      isEarth: isCurrentEarth
    };

    const systemInstruction = `You are Professor Nova, a warm and brilliant astrobiology lead guiding cadet astronaut Whiskers. 
Deliver an in-depth Human Compatibility Briefing comparing the CURRENT planet with the PREVIOUS planet visited.
Format your debriefing clearly in 4 bullet points:
1. Musculoskeletal & Gravity (compare gravity pull, astronaut body weight, spinal fatigue or atrophy risk)
2. Atmosphere & Respiration (N2, O2, CO2, bar pressure, helmet visor status vs Class-4 EVA rebreather requirement)
3. Thermal & Water Status (equilibrium temperature in K and °C, liquid/ice/vapor water presence vs previous world)
4. Human Compatibility Rating & Colonization Verdict (Compatibility Score %, Tier 1-4, colony potential)
If the current world is Earth, warmly celebrate returning home to 100% human compatibility.
If previous world was Earth, benchmark directly against Earth 1.0g/1.0 bar/288K; if previous was another exoplanet, explicitly compare their stats.
Keep your tone warm, encouraging, and scientifically rigorous.`;

    const prompt = `Current Visited World: ${JSON.stringify(currentInfo)}
Previous Departure World: ${JSON.stringify(prevInfo)}

Deliver the structured Human Compatibility Briefing now.`;

    if (isCurrentEarth) {
      return {
        text: this.generateOfflineHumanCompatibility(currentInfo, prevInfo),
        source: 'offline'
      };
    }

    if (this.hasApiKey()) {
      try {
        const text = await this.callFeatherlessAPI(systemInstruction, prompt);
        if (text) return { text, source: 'featherless' };
      } catch (err) {
        console.warn('[FeatherlessService] Human compatibility briefing API failed, using offline simulator:', err);
      }
    }

    return {
      text: this.generateOfflineHumanCompatibility(currentInfo, prevInfo),
      source: 'offline'
    };
  }

  /**
   * Legacy alias forwarding to Human Compatibility Briefing
   */
  async generateLandingComparison(currentPlanet, previousPlanet) {
    return this.generateHumanCompatibilityComparison(currentPlanet, previousPlanet);
  }

  /**
   * Generates dynamic atmospheric entry warning and telemetry briefing.
   */
  async generateEntryWarning(currentPlanet) {
    const isHot = currentPlanet.pl_eqt > 400;
    const isCold = currentPlanet.pl_eqt < 220;
    const isWater = currentPlanet.isLiquidWorld;

    const systemInstruction = `You are Professor Nova on the cockpit comms. Give the student cadet astronaut a 2-sentence atmospheric entry warning for planet ${currentPlanet.pl_name}. Mention thermal shields, gravity adjusters, and what visual spectacle awaits outside the viewport.`;

    const prompt = `Planet Name: ${currentPlanet.pl_name}
Equilibrium Temp: ${currentPlanet.pl_eqt} K
Density: ${currentPlanet.pl_dens} g/cm³
Gravity: ${currentPlanet.surfaceGravity}g
Liquid World: ${isWater}`;

    if (this.hasApiKey()) {
      try {
        const text = await this.callFeatherlessAPI(systemInstruction, prompt);
        if (text) return { text, source: 'featherless' };
      } catch (err) {
        console.warn('[FeatherlessService] Entry warning API failed, using fallback:', err);
      }
    }

    if (isWater) {
      return {
        text: `Hold tight cadet, our thermal shields are glowing as we pierce the thick water-vapor stratosphere of ${currentPlanet.pl_name}! Deploy the hydrofoil stabilizers—we are splashing down onto an endless alien ocean!`,
        source: 'offline'
      };
    } else if (isHot) {
      return {
        text: `Warning sirens are chiming cadet—${currentPlanet.pl_name} is scorching at ${currentPlanet.pl_eqt} Kelvin, pushing our cooling heat-sinks to maximum capacity! Keep our landing retro-thrusters locked on solid basalt ground.`,
        source: 'offline'
      };
    } else if (isCold) {
      return {
        text: `Brace for entry cadet, cryo-ice crystals are dancing across our cockpit viewport as we enter ${currentPlanet.pl_name}'s frigid atmosphere! Ensure your thermal suit regulator is primed before we touch down.`,
        source: 'offline'
      };
    } else {
      return {
        text: `Descent corridor is green cadet! We are entering the temperate skies of ${currentPlanet.pl_name} with gentle atmospheric drag, revealing stunning low-poly terrain right below us.`,
        source: 'offline'
      };
    }
  }

  /**
   * Interactive follow-up Q&A with the Teacher NPC.
   */
  async askTeacherQuestion(question, currentPlanet) {
    const systemInstruction = `You are Professor Nova, an encouraging, cozy space science teacher speaking to student cadet Whiskers on ${currentPlanet.pl_name}. Answer their question warmly and concisely in 2 to 3 sentences, incorporating real planetary science facts about density (${currentPlanet.pl_dens} g/cm³), temperature (${currentPlanet.pl_eqt} K), and gravity (${currentPlanet.surfaceGravity}g).`;

    if (this.hasApiKey()) {
      try {
        const text = await this.callFeatherlessAPI(systemInstruction, question);
        if (text) return { text, source: 'featherless' };
      } catch (err) {
        console.warn('[FeatherlessService] Question API failed:', err);
      }
    }

    // Dynamic offline response to questions
    const qLower = question.toLowerCase();
    if (qLower.includes('grow') || qLower.includes('crop') || qLower.includes('farm') || qLower.includes('plant')) {
      if (currentPlanet.isLiquidWorld) {
        return {
          text: `On ${currentPlanet.pl_name}, traditional soil crops won't work, but floating hydroponic kelp and bio-luminescent micro-algae would thrive in these nutrient-dense alien waters! We can deploy floating greenhouse pods from our boat.`,
          source: 'offline'
        };
      } else if (currentPlanet.pl_eqt > 400) {
        return {
          text: `At ${currentPlanet.pl_eqt} K, open-air crops would vaporize instantly! We'll need pressurized domed greenhouses with heavy cooling arrays and synthesized nitrate topsoil.`,
          source: 'offline'
        };
      } else {
        return {
          text: `With an insolation of ${currentPlanet.pl_insol} times Earth's sunlight and ${currentPlanet.surfaceGravity}g gravity, hardy bio-engineered crops could take root with just mild UV-filtering canopies!`,
          source: 'offline'
        };
      }
    } else if (qLower.includes('mine') || qLower.includes('mineral') || qLower.includes('drill') || qLower.includes('metal')) {
      if (currentPlanet.pl_dens > 5.0) {
        return {
          text: `With a heavy density of ${currentPlanet.pl_dens} g/cm³, this planet's crust is packed with high-grade nickel-iron ores, titanium silicates, and rare-earth heavy metals! Set up your drill rig on any bedrock ridge.`,
          source: 'offline'
        };
      } else if (currentPlanet.isLiquidWorld) {
        return {
          text: `Sub-surface mining here requires submersible robotic dredgers to extract dissolved mineral salts and heavy deuterium isotopes from the deep sea trenches!`,
          source: 'offline'
        };
      } else {
        return {
          text: `The core drill shows abundant quartz silicates and light aluminum alloys—ideal for building lightweight outpost structures and solar panels.`,
          source: 'offline'
        };
      }
    } else {
      return {
        text: `That's a wonderful question cadet! Remember that with ${currentPlanet.surfaceGravity}g gravity and ${currentPlanet.pl_eqt} K equilibrium temperature, every step on ${currentPlanet.pl_name} teaches us how unique worlds evolve across the galaxy.`,
        source: 'offline'
      };
    }
  }

  /**
   * Direct fetch to Featherless AI (OpenAI compatible endpoint).
   */
  async callFeatherlessAPI(systemInstruction, userContent) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userContent }
          ],
          temperature: 0.7,
          max_tokens: 300
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Featherless API error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No text generated by Featherless model.');
      }
      return content.trim();
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  // Compatibility alias for existing callers
  async callGeminiAPI(systemInstruction, userContent) {
    return this.callFeatherlessAPI(systemInstruction, userContent);
  }

  /**
   * Generates a structured, scientifically accurate Human Compatibility debriefing offline.
   */
  generateOfflineHumanCompatibility(current, prev) {
    const isPrevEarth = !prev || prev.isEarth || prev.name === 'Earth';
    const isCurrentEarth = current.isEarth || current.name === 'Earth';

    if (isCurrentEarth) {
      const prevName = prev ? prev.name : 'the deep frontier';
      const prevGrav = prev && prev.gravity ? prev.gravity : 1.0;
      return `Welcome home to Earth, Cadet Whiskers! 🌍\n\n` +
        `• Musculoskeletal & Gravity: Optimal 1.0g baseline. After enduring ${prevGrav}g on ${prevName}, your spine and skeletal frame can relax under natural terrestrial pull.\n\n` +
        `• Atmosphere & Respiration: 100% Breathable. Rich 78% N₂ and 21% O₂ at 1.013 bar—feel free to unseal your helmet visor and breathe the fresh mountain air.\n\n` +
        `• Thermal & Hydrosphere: Temperate 288 K (15°C) with vast stable oceans of liquid H₂O.\n\n` +
        `• Human Compatibility: Tier 1 (100% Optimal Homeworld). Outstanding work out in the stars! 🐾`;
    }

    const curName = current.name || 'Destination World';
    const curGrav = Number(current.gravity || 1.0).toFixed(2);
    const curEqt = current.temperatureK || 288;
    const curC = (curEqt - 273.15).toFixed(0);
    const curDens = Number(current.density || 5.5).toFixed(2);
    const isLiquid = Boolean(current.isLiquidWorld);

    const prevName = isPrevEarth ? 'Earth' : (prev.name || 'Previous Exoplanet');
    const prevGrav = Number(prev.gravity || 1.0).toFixed(2);
    const prevEqt = prev.temperatureK || 288;
    const prevC = (prevEqt - 273.15).toFixed(0);

    // 1. Gravity & Musculoskeletal Comparison
    let gravText = '';
    const weightRatio = Number(curGrav);
    const weightDiffPct = Math.round((weightRatio - (isPrevEarth ? 1.0 : Number(prevGrav))) * 100);
    const sign = weightDiffPct >= 0 ? '+' : '';

    if (isPrevEarth) {
      if (curGrav > 1.25) {
        gravText = `• Musculoskeletal & Gravity: ${curGrav}g vs Earth's 1.0g (${sign}${weightDiffPct}% heavier). A 70 kg astronaut weighs ~${Math.round(70 * curGrav)} kg here. High spinal compression and leg fatigue require motorized exoskeletons for prolonged EVA.`;
      } else if (curGrav < 0.75) {
        gravText = `• Musculoskeletal & Gravity: ${curGrav}g vs Earth's 1.0g (${weightDiffPct}% lighter). Moving feels buoyant and leaping is effortless, but long-term settlement will require daily resistance training to prevent bone mineral loss.`;
      } else {
        gravText = `• Musculoskeletal & Gravity: ${curGrav}g vs Earth's 1.0g (${sign}${weightDiffPct}%). Remarkably close to Earth's biomechanics—minimal musculoskeletal strain for human exploration boots.`;
      }
    } else {
      gravText = `• Musculoskeletal & Gravity: ${curGrav}g on ${curName} vs ${prevGrav}g on ${prevName} (${sign}${weightDiffPct}% shift). Your biomechanical workload changes from ${prevGrav}g to ${curGrav}g.`;
    }

    // 2. Atmospheric & Respiration Comparison
    let atmoText = '';
    let compatTier = '';
    let compatScore = '';

    if (isLiquid) {
      atmoText = `• Atmosphere & Respiration: Dense superheated volatile envelope dominated by steam (H₂O) and CO₂. Zero free oxygen. Anoxic and hyperbaric—unfiltered human exposure is fatal within seconds; pressurized deep-dive suits required.`;
      compatTier = 'Tier 3 (Hostile Fluid Biosphere)';
      compatScore = '24%';
    } else if (curEqt > 700) {
      atmoText = `• Atmosphere & Respiration: Hyper-dense CO₂ and sulfur dioxide furnace exceeding 50+ bar. Zero breathable O₂. Class-5 reinforced thermal EVA suits mandatory; unshielded materials melt on contact.`;
      compatTier = 'Tier 4 (Scorching Furnace - Lethal)';
      compatScore = '6%';
    } else if (current.isGoldilocks) {
      atmoText = `• Atmosphere & Respiration: Secondary nitrogen-dominant envelope with moderate CO₂ (1.8%) and trace O₂. Non-breathable raw air (EVA rebreather required), but surface pressure (~${(curGrav * 1.05).toFixed(1)} bar) is structurally benign for lightweight domes.`;
      compatTier = 'Tier 2 (Habitable Candidate with Life Support)';
      compatScore = '78%';
    } else if (curEqt < 220) {
      atmoText = `• Atmosphere & Respiration: Thin, sub-atmospheric cryo-envelope (~0.4 bar). Low molecular pressure requires pressurized heated suits to prevent blood ebullism and severe frostbite.`;
      compatTier = 'Tier 3 (Cryo-Glacial Frontier)';
      compatScore = '36%';
    } else {
      atmoText = `• Atmosphere & Respiration: Toxic carbon-dioxide envelope at ${(curGrav * 0.95).toFixed(1)} bar. Full oxygen supply required, though surface atmospheric shielding deflects heavy cosmic rays.`;
      compatTier = 'Tier 3 (Dry Regolith World)';
      compatScore = '42%';
    }

    // 3. Thermal & Water Comparison
    let thermalText = '';
    if (isPrevEarth) {
      thermalText = `• Thermal & Water: Equilibrium temperature is ${curEqt} K (${curC}°C) compared to Earth's temperate 288 K (15°C). ${current.isGoldilocks ? 'Surface lies in the Goldilocks sweet spot where liquid water can stably pool.' : (curEqt > 380 ? 'Water boils instantly into atmospheric vapor.' : 'Water is locked into solid cryo-ice.')}`;
    } else {
      thermalText = `• Thermal & Water: Shift from ${prevEqt} K (${prevC}°C) on ${prevName} to ${curEqt} K (${curC}°C) on ${curName}. ${isLiquid ? 'Vast global ocean depth detected.' : 'Lithospheric bedrock with localized hydration.'}`;
    }

    // 4. Compatibility Summary Verdict
    const verdict = `• Human Compatibility Rating: ${compatScore} — ${compatTier}. ${current.isGoldilocks ? 'Excellent candidate for pressurized research colonies and bio-domes!' : 'Strict survival protocols and habitat environmental control systems active.'} 🐾`;

    return `Cadet Whiskers, here is our Human Compatibility Briefing for ${curName} comparing against ${prevName}:\n\n${gravText}\n\n${atmoText}\n\n${thermalText}\n\n${verdict}`;
  }

  /**
   * Generates a context-aware 3-sentence cozy comparison offline.
   */
  generateOfflineComparison(current, prev) {
    let gravitySentence = "";
    if (current.gravity > 1.3) {
      gravitySentence = `Welcome to ${current.name}, where you will feel noticeably heavier under ${current.gravity}g surface gravity compared to ${prev.name}'s ${prev.gravity || 1.0}g and Earth's gentle 1.0g pull.`;
    } else if (current.gravity < 0.8) {
      gravitySentence = `Look at that leap, cadet—with only ${current.gravity}g surface gravity on ${current.name}, you can bound across the surface far more effortlessly than on ${prev.name} or back home on Earth!`;
    } else {
      gravitySentence = `Stepping onto ${current.name} feels remarkably familiar, with its comfortable ${current.gravity}g gravity welcoming our boots just like Earth's 1.0g.`;
    }

    let habitabilitySentence = "";
    if (current.isLiquidWorld) {
      habitabilitySentence = `Unlike the solid soil of ${prev.name}, this world's low density of ${current.density} g/cm³ means we are floating atop a vast, deep planetary ocean with a humid, volatile-rich atmosphere.`;
    } else if (current.temperatureK > 400) {
      habitabilitySentence = `While Earth basks in a cozy 288 K, ${current.name} is a scorching furnace at ${current.temperatureK} K, making standard outdoor farming impossible without climate-sealed biodomes.`;
    } else if (current.temperatureK < 220) {
      habitabilitySentence = `With temperatures dipping to a crisp ${current.temperatureK} K, its frozen crust resembles a world-sized cryo-glacier compared to ${prev.name}.`;
    } else {
      habitabilitySentence = `Its equilibrium temperature of ${current.temperatureK} K places it squarely in a promising temperate bracket, far closer to Earth's sweet spot than the conditions on ${prev.name}.`;
    }

    let resourceSentence = "";
    if (current.density >= 5.0) {
      resourceSentence = `Our mining drill should strike rich veins of heavy transition metals here, though our agricultural team will need greenhouse domes to cultivate crops in this alien regolith.`;
    } else if (current.isLiquidWorld) {
      resourceSentence = `Farming will take the form of floating kelp aquaponics from our boat, while our mineral dredgers harvest deuterium and salts from the endless tides.`;
    } else {
      resourceSentence = `Light silicates will provide plenty of building materials for our base camp, making this a fascinating new frontier for both mining and greenhouse farming!`;
    }

    return `${gravitySentence} ${habitabilitySentence} ${resourceSentence}`;
  }
}

// Retain GeminiService export name as alias for seamless compatibility
export const GeminiService = FeatherlessAIService;
