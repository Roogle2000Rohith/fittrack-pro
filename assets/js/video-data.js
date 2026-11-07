/** Exercise-video sources and day-specific warm-up/cool-down video catalog.
 * Videos remain hosted by their original publishers. A working page does not guarantee embedding. */
const VERIFIED_PUBLIC_VIDEO_LINKS={"incline-cable-chest-press":{"url":"https://www.youtube.com/watch?v=chvZZIWje0M","title":"Incline cable chest press — form demonstration","provider":"OriGym","match":"exact","note":"","kind":"youtube"},"neutral-grip-chest-press-machine":{"url":"https://commons.wikimedia.org/wiki/File:Muscle_Strengthening_at_the_Gym_-_Chest_Press.webm","video":"https://upload.wikimedia.org/wikipedia/commons/7/70/Muscle_Strengthening_at_the_Gym_-_Chest_Press.webm","title":"Seated chest press machine","provider":"Centers for Disease Control and Prevention","match":"related","note":"Machine-grip style may differ from your neutral-grip press.","kind":"commons","license":"US public domain"},"rope-triceps-pushdown":{"url":"https://www.muscleandstrength.com/exercises/rope-tricep-extension.html","title":"Rope triceps pushdown","provider":"Muscle & Strength","match":"exact","note":"","kind":"guide"},"overhead-cable-triceps-extension":{"url":"https://www.muscleandstrength.com/exercises/overhead-tricep-extension.html","title":"Overhead rope cable triceps extension","provider":"Muscle & Strength","match":"related","note":"Shows a high-pulley rope version; match the cable setup at your gym.","kind":"guide"},"close-grip-lat-pulldown":{"url":"https://www.muscleandstrength.com/exercises/close-grip-pull-down.html","title":"Close-grip lat pulldown","provider":"Muscle & Strength","match":"related","note":"The guide's handle and grip orientation may differ from your close neutral grip.","kind":"guide"},"ez-bar-biceps-curl":{"url":"https://commons.wikimedia.org/wiki/File:Video_of_EZ_Bar_Curl_and_Straight_Bar_Curl.webm","video":"https://upload.wikimedia.org/wikipedia/commons/e/ec/Video_of_EZ_Bar_Curl_and_Straight_Bar_Curl.webm","title":"EZ-bar curl demonstration and comparison","provider":"Colossus Fitness","match":"exact","note":"Includes a comparison to straight-bar curls.","kind":"commons","license":"CC BY 3.0"},"cable-crunch":{"url":"https://www.muscleandstrength.com/exercises/cable-crunch.html","title":"Kneeling cable crunch","provider":"Muscle & Strength","match":"exact","note":"","kind":"guide"},"pallof-press":{"url":"https://www.muscleandstrength.com/exercises/pallof-press","title":"Standing Pallof press","provider":"Muscle & Strength","match":"exact","note":"","kind":"guide"},"hack-squat":{"url":"https://www.muscleandstrength.com/exercises/hack-squat.html","title":"Machine hack squat","provider":"Muscle & Strength","match":"exact","note":"","kind":"guide"},"seated-leg-curl":{"url":"https://www.muscleandstrength.com/exercises/seated-leg-curl","title":"Seated hamstring curl","provider":"Muscle & Strength","match":"exact","note":"","kind":"guide"},"leg-press-calf-raise":{"url":"https://www.muscleandstrength.com/exercises/45-degress-calf-press.html","title":"45-degree leg press calf raise","provider":"Muscle & Strength","match":"exact","note":"","kind":"guide"},"cable-lateral-raise":{"url":"https://www.muscleandstrength.com/exercises/one-arm-cable-lateral-raise.html","title":"Single-arm cable lateral raise","provider":"Muscle & Strength","match":"related","note":"Shows the cross-body cable setup, which may differ from your version.","kind":"guide"},"reverse-pec-deck":{"url":"https://www.muscleandstrength.com/exercises/machine-reverse-fly","title":"Reverse pec deck / machine reverse fly","provider":"Muscle & Strength","match":"exact","note":"","kind":"guide"},"seated-shoulder-press-machine":{"url":"https://www.muscleandstrength.com/exercises/machine-shoulder-press","title":"Seated machine shoulder press","provider":"Muscle & Strength","match":"exact","note":"","kind":"guide"},"pec-deck-fly":{"url":"https://www.muscleandstrength.com/exercises/pec-dec.html","title":"Pec deck fly","provider":"Muscle & Strength","match":"exact","note":"","kind":"guide"},"straight-bar-triceps-pushdown":{"url":"https://www.muscleandstrength.com/exercises/tricep-extension.html","title":"Straight-bar triceps pushdown","provider":"Muscle & Strength","match":"exact","note":"","kind":"guide"},"dumbbell-skull-crusher":{"url":"https://www.muscleandstrength.com/exercises/lying-dumbbell-extension.html","title":"Lying dumbbell skull crushers","provider":"Muscle & Strength","match":"exact","note":"","kind":"guide"},"lat-pulldown":{"url":"https://www.muscleandstrength.com/exercises/lat-pull-down.html","title":"Lat pulldown","provider":"Muscle & Strength","match":"exact","note":"","kind":"guide"},"straight-arm-cable-pulldown":{"url":"https://www.muscleandstrength.com/exercises/straight-arm-lat-pull-down.html","title":"Straight-arm cable pulldown","provider":"Muscle & Strength","match":"exact","note":"","kind":"guide"},"45-leg-press":{"url":"https://commons.wikimedia.org/wiki/File:Hip_Sled_-_How_to_perform_a_45_degree_leg_press.webm","video":"https://upload.wikimedia.org/wikipedia/commons/4/44/Hip_Sled_-_How_to_perform_a_45_degree_leg_press.webm","title":"45-degree sled leg press","provider":"FitnessScape","match":"exact","note":"Equipment dimensions and safety catches vary.","kind":"commons","license":"CC BY 3.0"},"leg-extension":{"url":"https://www.muscleandstrength.com/exercises/leg-extension.html","title":"Seated leg extension","provider":"Muscle & Strength","match":"exact","note":"","kind":"guide"},"hip-adductor-machine":{"url":"https://www.muscleandstrength.com/exercises/hip-adduction-machine.html","title":"Hip adduction machine","provider":"Muscle & Strength","match":"exact","note":"","kind":"guide"}};

const FEATURED_MEDIA={
  "warmup": {
    "push": [
      {
        "title": "Upper-body dynamic mobility (5–10 minutes)",
        "provider": "E3 Rehab",
        "detail": "Best before Push: shoulder and thoracic dynamic movements, then 1–3 lighter sets of your first press.",
        "url": "https://www.youtube.com/watch?v=_hyJjSGJAEo",
        "query": "E3 Rehab upper body dynamic stretching warmup"
      },
      {
        "title": "How to warm up before resistance training",
        "provider": "Renaissance Periodization",
        "detail": "Explains how to progressively prepare for heavy pressing without tiring yourself out.",
        "url": "https://www.youtube.com/watch?v=HdgDDSjtaLM",
        "query": "Renaissance Periodization warm up before workout"
      }
    ],
    "pull": [
      {
        "title": "Upper-body dynamic mobility (5–10 minutes)",
        "provider": "E3 Rehab",
        "detail": "Best before Pull: upper-back and shoulder mobility, followed by lighter pulldown/row sets.",
        "url": "https://www.youtube.com/watch?v=_hyJjSGJAEo",
        "query": "E3 Rehab upper body dynamic stretching warmup"
      },
      {
        "title": "How to warm up before resistance training",
        "provider": "Renaissance Periodization",
        "detail": "Warm-up principles for pulling sessions; educational guidance, not a follow-along routine.",
        "url": "https://www.youtube.com/watch?v=HdgDDSjtaLM",
        "query": "Renaissance Periodization warm up before workout"
      }
    ],
    "legs": [
      {
        "title": "Squat preparation: ankle and hip control",
        "provider": "Squat University",
        "detail": "A squat-specific movement drill. Use only a comfortable range and follow with machine warm-up sets.",
        "url": "https://www.youtube.com/watch?v=pCEpcIo-O4I",
        "query": "Squat University squat warm up hip ankle"
      },
      {
        "title": "How to warm up before resistance training",
        "provider": "Renaissance Periodization",
        "detail": "How to ramp up your first hack-squat or leg-press movement; warm-up principles rather than a guided mobility session.",
        "url": "https://www.youtube.com/watch?v=HdgDDSjtaLM",
        "query": "Renaissance Periodization warm up before workout"
      }
    ]
  },
  "cooldown": {
    "push": [
      {
        "title": "Five-minute upper-body cool-down",
        "provider": "Tom Peto Training",
        "detail": "Gentle post-Push upper-body cooldown; stretching is optional and should not be painful.",
        "url": "https://www.youtube.com/watch?v=0ZkuKwjyWtI",
        "query": "Tom Peto Training five minute upper body cool down"
      }
    ],
    "pull": [
      {
        "title": "Five-minute upper-body cool-down",
        "provider": "Tom Peto Training",
        "detail": "Gentle post-Pull upper-back, shoulder and chest mobility; use a comfortable range.",
        "url": "https://www.youtube.com/watch?v=0ZkuKwjyWtI",
        "query": "Tom Peto Training five minute upper body cool down"
      }
    ],
    "legs": [
      {
        "title": "Five-minute lower-body cool-down",
        "provider": "Tom Peto Training",
        "detail": "Follow-along lower-body stretching including hip flexors, adductors, glutes and hamstrings.",
        "url": "https://www.youtube.com/watch?v=myN0dGpJabc",
        "query": "Tom Peto Training five minute lower body cool down"
      }
    ]
  },
  "mobility": [
    {
      "title": "Upper-body dynamic mobility (5–10 minutes)",
      "provider": "E3 Rehab",
      "detail": "Use upper-body dynamic mobility at an easy intensity; avoid forcing range.",
      "url": "https://www.youtube.com/watch?v=_hyJjSGJAEo",
      "query": "E3 Rehab upper body dynamic stretching warmup"
    },
    {
      "title": "Squat preparation: ankle and hip control",
      "provider": "Squat University",
      "detail": "Option for hip and ankle mobility; adapt squat depth to comfort.",
      "url": "https://www.youtube.com/watch?v=pCEpcIo-O4I",
      "query": "Squat University squat warm up hip ankle"
    },
    {
      "title": "Five-minute lower-body cool-down",
      "provider": "Tom Peto Training",
      "detail": "Gentle lower-body mobility and stretching as an optional recovery routine.",
      "url": "https://www.youtube.com/watch?v=myN0dGpJabc",
      "query": "Tom Peto Training five minute lower body cool down"
    }
  ]
};
