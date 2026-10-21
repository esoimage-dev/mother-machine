/* =========================================================================
   Vitalia's Pizza on Wheels — single front-end source of truth.
   Loaded by booking.html (public wizard) AND tony.html (admin create-event),
   so the menu, packages, surcharges and pricing rules can never drift apart
   between the two calendars/forms.

   The SERVER keeps its own mirror in netlify/functions/_pricing.js (it is the
   security authority that recomputes the charged amount). If you change a
   price/surcharge here, change it there too.
   ========================================================================= */
(function (root) {
  var M = {
    // --- Packages --------------------------------------------------------
    PKG: {
      social:      { label: 'Social',      price: 1500, guests: '10–30 guests', pizzas: '~30 pizzas' },
      party:       { label: 'Party',       price: 1750, guests: '30–55 guests', pizzas: '~50 pizzas' },
      celebration: { label: 'Celebration', price: 2100, guests: '55–85 guests', pizzas: '~80 pizzas' },
      custom:      { label: 'Custom event', price: null, guests: '',                 pizzas: '' }
    },

    // --- Add-ons (per pizza, dollars) ------------------------------------
    ADDON_VEGAN: 3,   // vegan mozzarella
    ADDON_GF: 10,     // gluten-free base

    // --- Surcharges ------------------------------------------------------
    EVENING_SURCHARGE: 100,
    EVENING_THRESHOLD: '19:00', // start time at/after 7:00pm gets the surcharge
    DEPOSIT_PCT: 0.3,

    // --- Serviced postcodes (value, area label, travel surcharge $) ------
    POSTCODES: [
      { group: 'Cairns',              code: '4870', area: 'Cairns Area',              surcharge: 0,   km: 5 },
      { group: 'Cairns',              code: '4868', area: 'Cairns South',             surcharge: 0,   km: 8 },
      { group: 'Cairns',              code: '4869', area: 'Edmonton',                 surcharge: 0,   km: 15 },
      { group: 'Cairns',              code: '4865', area: 'Gordonvale',               surcharge: 0,   km: 25 },
      { group: 'Northern Beaches',    code: '4878', area: 'Smithfield / Yorkeys Knob', surcharge: 0, km: 15 },
      { group: 'Northern Beaches',    code: '4879', area: 'Palm Cove / Trinity Beach', surcharge: 0, km: 25 },
      { group: 'Douglas Shire',       code: '4877', area: 'Port Douglas Area',        surcharge: 160, km: 65 },
      { group: 'Douglas Shire',       code: '4873', area: 'Mossman / Daintree',       surcharge: 210, km: 80 },
      { group: 'Cassowary Coast',     code: '4861', area: 'Babinda',                  surcharge: 120, km: 60 },
      { group: 'Cassowary Coast',     code: '4860', area: 'Innisfail',                surcharge: 260, km: 90 },
      { group: 'Atherton Tablelands', code: '4881', area: 'Kuranda',                  surcharge: 15,  km: 25 },
      { group: 'Atherton Tablelands', code: '4880', area: 'Mareeba',                  surcharge: 140, km: 65 },
      { group: 'Atherton Tablelands', code: '4882', area: 'Tolga',                    surcharge: 260, km: 75 },
      { group: 'Atherton Tablelands', code: '4883', area: 'Atherton',                 surcharge: 210, km: 80 },
      { group: 'Atherton Tablelands', code: '4884', area: 'Yungaburra',               surcharge: 160, km: 70 },
      { group: 'Atherton Tablelands', code: '4885', area: 'Malanda',                  surcharge: 210, km: 85 }
    ],

    // --- Event types + venue types --------------------------------------
    EVENT_TYPES: ['Birthday / Party', 'Wedding', 'Corporate Event', 'Backyard Gathering', 'School / Community Event', 'Other'],
    VENUES: [
      { value: 'backyard', label: 'Backyard' },
      { value: 'patio',    label: 'Patio / Deck' },
      { value: 'carpark',  label: 'Car Park' },
      { value: 'park',     label: 'Park / Outdoor' },
      { value: 'venue',    label: 'Event Venue' },
      { value: 'other',    label: 'Other' }
    ],

    // --- Pizza menu ------------------------------------------------------
    PIZZAS: [
      { name: 'Margherita',          ingredients: 'San marzano tomatoes, mozzarella, basil, evoo',                                          badge: 'Vegetarian', badgeClass: 'veg' },
      { name: 'Diavola',             ingredients: "San marzano tomatoes, mozzarella, caramelised onion, spicy salami, 'nduja",              badge: 'Classic',    badgeClass: 'classic' },
      { name: 'Capricciosa',         ingredients: 'San marzano tomatoes, mozzarella, ham, mushrooms, artichokes, olives',                   badge: 'Classic',    badgeClass: 'classic' },
      { name: '4 Formaggi e Tartufo', ingredients: 'Mozzarella, gorgonzola, smoked scamorza, parmesan, truffle cream',                      badge: 'Vegetarian', badgeClass: 'veg' },
      { name: "Napule'",             ingredients: 'Mozzarella, smoked scamorza, sausage, broccoli rabe',                                     badge: 'Special',    badgeClass: 'special' },
      { name: 'Norcina',             ingredients: 'Mozzarella, sausage, roasted potato, pecorino cheese',                                    badge: 'Special',    badgeClass: 'special' },
      { name: 'Garlic Focaccia',     ingredients: 'Olive oil, garlic, rosemary, sea salt',                                                   badge: 'Vegetarian', badgeClass: 'veg' },
      { name: 'Bufalina',            ingredients: 'San marzano tomatoes, fresh buffalo mozzarella, prosciutto crudo, cherry tomatoes, basil, evoo', badge: 'Special', badgeClass: 'special' },
      { name: 'Godfather',           ingredients: 'San marzano tomatoes, mozzarella, soppressa salami, rocket, cherry tomatoes, burrata',    badge: 'Special',    badgeClass: 'special' },
      { name: 'Gambero Rosso',       ingredients: 'Zucchini cream, prawns, mozzarella, chilli',                                              badge: 'Seafood',    badgeClass: 'seafood' },
      { name: 'Umbria',              ingredients: 'Mozzarella, pumpkin puree, mushrooms, walnuts, truffle cream, broccoli rabe',             badge: 'Vegetarian', badgeClass: 'veg' },
      { name: 'Siciliana',           ingredients: 'San marzano tomatoes, mozzarella, zucchini cream, eggplant, sun-dried tomatoes',          badge: 'Vegetarian', badgeClass: 'veg' }
    ]
  };

  // --- Helpers -----------------------------------------------------------
  // Half-hour start-time slots, 9:00 AM to 11:30 PM. [{ value:'19:00', label:'7:00 PM' }]
  M.startTimes = function () {
    var out = [];
    for (var hr = 9; hr <= 23; hr++) {
      [0, 30].forEach(function (mn) {
        var ampm = hr < 12 ? 'AM' : 'PM';
        var h12 = hr % 12; if (h12 === 0) h12 = 12;
        out.push({
          value: String(hr).padStart(2, '0') + ':' + (mn === 0 ? '00' : '30'),
          label: h12 + ':' + (mn === 0 ? '00' : '30') + ' ' + ampm
        });
      });
    }
    return out;
  };
  M.travelSurcharge = function (postcode) {
    var p = M.POSTCODES.find(function (x) { return x.code === String(postcode); });
    return p ? p.surcharge : 0;
  };
  M.areaForPostcode = function (postcode) {
    var p = M.POSTCODES.find(function (x) { return x.code === String(postcode); });
    return p ? p.area : '';
  };
  M.ingredientsFor = function (name) {
    var p = M.PIZZAS.find(function (x) { return x.name === name; });
    return p ? p.ingredients : '';
  };

  // Wires Google Places Autocomplete onto an address text input, shared by the
  // public booking form and the admin create/edit-event form (same behaviour,
  // one implementation). Biased to the Cairns region but not restricted to it
  // — the truck occasionally travels further. When the picked place's postcode
  // matches one of our serviced POSTCODES, the paired <select> is auto-set and
  // a 'change' event fires so pricing/travel surcharge recompute immediately;
  // outside our serviced area, the select is left alone rather than guessing.
  // Safe to call before the Google Maps script has finished loading — it waits
  // for the 'vitalia:maps-ready' event (fired by the page once google.maps is
  // ready) if it isn't available yet.
  M.attachAddressAutocomplete = function (addressInputId, postcodeSelectId) {
    function init() {
      var input = document.getElementById(addressInputId);
      if (!input || !root.google || !google.maps || !google.maps.places) return;
      var postcodeSelect = postcodeSelectId ? document.getElementById(postcodeSelectId) : null;
      var autocomplete = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: 'au' },
        fields: ['formatted_address', 'address_components'],
        types: ['address'],
        bounds: new google.maps.LatLngBounds({ lat: -17.6, lng: 145.4 }, { lat: -16.6, lng: 146.3 })
      });
      autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place || !place.formatted_address) return;
        input.value = place.formatted_address;
        // Deliberately DON'T fire an 'input' event on the address field here:
        // Google's Autocomplete listens to it and would re-open the suggestion
        // dropdown for the just-picked value (the leftover white box). Nothing
        // in either form reacts to the address field's input event anyway — it's
        // only read on submit — so there's nothing to notify. Pricing/travel is
        // driven by the postcode <select> below, which DOES get a 'change'.
        if (!postcodeSelect || !place.address_components) return;
        var comp = place.address_components.find(function (c) { return c.types.indexOf('postal_code') !== -1; });
        var pc = comp ? comp.long_name : '';
        var known = pc && M.POSTCODES.some(function (p) { return p.code === pc; });
        if (known && postcodeSelect.value !== pc) {
          postcodeSelect.value = pc;
          postcodeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }
    if (root.google && google.maps && google.maps.places) init();
    else root.addEventListener('vitalia:maps-ready', init);
  };

  root.VITALIA_MENU = M;
})(typeof window !== 'undefined' ? window : this);
