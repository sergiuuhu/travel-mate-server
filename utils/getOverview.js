

const getOverview = () => {
  const lines = markdownText.split('\n');
  const data = {};

  for (let i = 3; i < lines.length - 1; i++) {
    const [empty, country, city, code, count] = lines[i].split('|').map(item => item.trim());

   // console.log("country: " + country, "city: " + city, "code: " + code, "count: " + count, "other: " + other);
   
    if (!data[country]) data[country] = {}
   
    data[country][city] = Number(count)
  }

  // Sort the object by keys alphabetically
  const sortedData = Object.keys(data).sort().reduce((acc, key) => {
    acc[key] = data[key];
    return acc;
  }, {});

  return sortedData;
}

export default getOverview;

const markdownText = `
| country_from                | flight1_city_from      | flight1_fly_from | record_count |
| --------------------------- | ---------------------- | ---------------- | ------------ |
| Turkey                      | Antalya                | AYT              | 9022         |
| Turkey                      | İzmir                  | ADB              | 8971         |
| Turkey                      | Istanbul               | SAW              | 7961         |
| Turkey                      | Ankara                 | ESB              | 6328         |
| Spain                       | Madrid                 | MAD              | 5007         |
| Spain                       | Barcelona              | BCN              | 4034         |
| Turkey                      | Istanbul               | IST              | 3541         |
| Portugal                    | Lisbon                 | LIS              | 2205         |
| Turkey                      | Adana                  | ADA              | 2186         |
| Turkey                      | Trabzon                | TZX              | 1645         |
| Spain                       | Palma, Majorca         | PMI              | 1438         |
| Switzerland                 | Geneva                 | GVA              | 1209         |
| Albania                     | Tirana                 | TIA              | 1168         |
| Turkey                      | Bodrum                 | BJV              | 1161         |
| Italy                       | Rome                   | FCO              | 1062         |
| United Kingdom              | Belfast                | BHD              | 1034         |
| United Kingdom              | Belfast                | BFS              | 1014         |
| Portugal                    | Porto                  | OPO              | 946          |
| Spain                       | Málaga                 | AGP              | 838          |
| United Kingdom              | Edinburgh              | EDI              | 831          |
| Greece                      | Athens                 | ATH              | 752          |
| Turkey                      | Dalaman                | DLM              | 718          |
| Italy                       | Catania                | CTA              | 637          |
| Kazakhstan                  | Almaty                 | ALA              | 612          |
| Greece                      | Thessaloniki           | SKG              | 609          |
| Italy                       | Milan                  | MXP              | 603          |
| Spain                       | Seville                | SVQ              | 533          |
| United Kingdom              | Manchester             | MAN              | 522          |
| United Kingdom              | London                 | LGW              | 517          |
| Spain                       | Ibiza                  | IBZ              | 513          |
| Spain                       | Santa Cruz de La Palma | SPC              | 504          |
| Poland                      | Warsaw                 | WAW              | 441          |
| Norway                      | Bergen                 | BGO              | 416          |
| Ireland                     | Dublin                 | DUB              | 404          |
| Czechia                     | Prague                 | PRG              | 398          |
| Spain                       | Las Palmas             | LPA              | 394          |
| Spain                       | Tenerife               | TFN              | 393          |
| Spain                       | Alicante               | ALC              | 376          |
| Spain                       | Valencia               | VLC              | 359          |
| France                      | Nice                   | NCE              | 352          |
| Netherlands                 | Amsterdam              | AMS              | 350          |
| Finland                     | Helsinki               | HEL              | 336          |
| Denmark                     | Copenhagen             | CPH              | 316          |
| United Kingdom              | Birmingham             | BHX              | 313          |
| Spain                       | Bilbao                 | BIO              | 311          |
| Poland                      | Gdańsk                 | GDN              | 305          |
| Hungary                     | Budapest               | BUD              | 303          |
| Italy                       | Palermo                | PMO              | 301          |
| Poland                      | Kraków                 | KRK              | 280          |
| United Kingdom              | London                 | LTN              | 260          |
| Poland                      | Wrocław                | WRO              | 239          |
| United Kingdom              | Glasgow                | GLA              | 238          |
| Portugal                    | Funchal                | FNC              | 207          |
| Italy                       | Venice                 | VCE              | 204          |
| France                      | Paris                  | CDG              | 203          |
| Norway                      | Stavanger              | SVG              | 197          |
| Sweden                      | Stockholm              | ARN              | 196          |
| Italy                       | Milan                  | BGY              | 194          |
| Greece                      | Heraklion              | HER              | 165          |
| Italy                       | Naples                 | NAP              | 156          |
| Kazakhstan                  | Astana                 | NQZ              | 151          |
| Italy                       | Bologna                | BLQ              | 132          |
| Poland                      | Katowice               | KTW              | 129          |
| Italy                       | Olbia                  | OLB              | 124          |
| France                      | Paris                  | ORY              | 122          |
| Belgium                     | Brussels               | CRL              | 119          |
| United Kingdom              | Liverpool              | LPL              | 117          |
| Romania                     | Bucharest              | OTP              | 113          |
| France                      | Lyon                   | LYS              | 111          |
| Spain                       | Asturias               | OVD              | 109          |
| Latvia                      | Riga                   | RIX              | 107          |
| Austria                     | Vienna                 | VIE              | 107          |
| Spain                       | Menorca                | MAH              | 104          |
| Austria                     | Innsbruck              | INN              | 95           |
| Italy                       | Venice                 | TSF              | 91           |
| Spain                       | Lanzarote              | ACE              | 90           |
| Germany                     | Berlin                 | BER              | 88           |
| Spain                       | Granada                | GRX              | 85           |
| Jersey                      | Saint Helier           | JER              | 79           |
| Italy                       | Milan                  | LIN              | 77           |
| Spain                       | Santiago de Compostela | SCQ              | 74           |
| Poland                      | Poznań                 | POZ              | 71           |
| Portugal                    | Ponta Delgada          | PDL              | 68           |
| United Kingdom              | Bristol                | BRS              | 67           |
| Spain                       | Fuerteventura          | FUE              | 67           |
| Italy                       | Bari                   | BRI              | 66           |
| Malta                       | Malta                  | MLA              | 65           |
| Austria                     | Salzburg               | SZG              | 63           |
| Norway                      | Kristiansand           | KRS              | 60           |
| Italy                       | Pisa                   | PSA              | 56           |
| Romania                     | Cluj-Napoca            | CLJ              | 55           |
| Sweden                      | Malmö                  | MMX              | 54           |
| France                      | Marseille              | MRS              | 52           |
| France                      | Bordeaux               | BOD              | 47           |
| United Kingdom              | Newcastle upon Tyne    | NCL              | 47           |
| Italy                       | Turin                  | TRN              | 45           |
| Portugal                    | Faro                   | FAO              | 45           |
| France                      | Toulouse               | TLS              | 45           |
| Italy                       | Verona                 | VRN              | 43           |
| United Kingdom              | Southampton            | SOU              | 41           |
| Germany                     | Dortmund               | DTM              | 40           |
| Estonia                     | Tallinn                | TLL              | 36           |
| Italy                       | Trapani                | TPS              | 36           |
| Bulgaria                    | Sofia                  | SOF              | 35           |
| Belgium                     | Brussels               | BRU              | 35           |
| Serbia                      | Belgrade               | BEG              | 34           |
| France                      | Nantes                 | NTE              | 33           |
| Norway                      | Oslo                   | OSL              | 33           |
| Switzerland                 | Basel                  | BSL              | 31           |
| Spain                       | Santander              | SDR              | 31           |
| Italy                       | Cagliari               | CAG              | 28           |
| Germany                     | Memmingen              | FMM              | 28           |
| Greece                      | Mytilene               | MJT              | 28           |
| Italy                       | Lamezia Terme          | SUF              | 27           |
| Iceland                     | Reykjavik              | KEF              | 27           |
| Lithuania                   | Vilnius                | VNO              | 25           |
| Romania                     | Iași                   | IAS              | 25           |
| Greece                      | Rhodes                 | RHO              | 25           |
| Bosnia & Herzegovina        | Sarajevo               | SJJ              | 24           |
| Kosovo                      | Pristina               | PRN              | 23           |
| France                      | Lille                  | LIL              | 22           |
| United Kingdom              | London                 | STN              | 22           |
| Cyprus                      | Larnaca                | LCA              | 21           |
| Germany                     | Hamburg                | HAM              | 21           |
| United Kingdom              | Nottingham             | EMA              | 20           |
| Spain                       | Almería                | LEI              | 20           |
| Spain                       | Tenerife               | TFS              | 19           |
| France                      | Paris                  | BVA              | 19           |
| United Kingdom              | Leeds                  | LBA              | 19           |
| Armenia                     | Yerevan                | EVN              | 18           |
| Greece                      | Kos                    | KGS              | 17           |
| Greece                      | Santorini              | JTR              | 17           |
| Italy                       | Rome                   | CIA              | 15           |
| Greece                      | Chania                 | CHQ              | 14           |
| United Kingdom              | London                 | LHR              | 13           |
| Finland                     | Turku                  | TKU              | 13           |
| Netherlands                 | Eindhoven              | EIN              | 12           |
| Italy                       | Ancona                 | AOI              | 11           |
| Norway                      | Tromsø                 | TOS              | 11           |
| Norway                      | Haugesund              | HAU              | 10           |
| Spain                       | Jerez de la Frontera   | XRY              | 10           |
| Greece                      | Corfu                  | CFU              | 10           |
| Slovakia                    | Bratislava             | BTS              | 10           |
| United Kingdom              | Exeter                 | EXT              | 10           |
| Sweden                      | Stockholm              | NYO              | 10           |
| Republic of North Macedonia | Skopje                 | SKP              | 9            |
| Norway                      | Trondheim              | TRD              | 9            |
| Romania                     | Sibiu                  | SBZ              | 9            |
| Georgia                     | Kutaisi                | KUT              | 9            |
| Italy                       | Pescara                | PSR              | 8            |
| Greece                      | Samos                  | SMI              | 8            |
| Italy                       | Comiso                 | CIY              | 8            |
| United Kingdom              | Aberdeen               | ABZ              | 8            |
| Norway                      | Ålesund                | AES              | 7            |
| Italy                       | Brindisi               | BDS              | 7            |
| Sweden                      | Gothenburg             | GOT              | 7            |
| Poland                      | Szczecin               | SZZ              | 6            |
| Hungary                     | Debrecen               | DEB              | 6            |
| Norway                      | Oslo                   | TRF              | 5            |
| Lithuania                   | Kaunas                 | KUN              | 5            |
| Switzerland                 | Zürich                 | ZRH              | 5            |
| Croatia                     | Zadar                  | ZAD              | 5            |
| Spain                       | Zaragoza               | ZAZ              | 4            |
| France                      | Strasbourg             | SXB              | 4            |
| United Kingdom              | London                 | SEN              | 4            |
| Serbia                      | Niš                    | INI              | 4            |
| Germany                     | Munich                 | MUC              | 4            |
| Slovenia                    | Ljubljana              | LJU              | 3            |
| Germany                     | Stuttgart              | STR              | 3            |
| Romania                     | Timișoara              | TSR              | 3            |
| Sweden                      | Stockholm              | BMA              | 3            |
| Italy                       | Genoa                  | GOA              | 2            |
| Croatia                     | Zagreb                 | ZAG              | 2            |
| Slovakia                    | Košice                 | KSC              | 2            |
| Norway                      | Bodø                   | BOO              | 2            |
| Croatia                     | Pula                   | PUY              | 2            |
| Germany                     | Bremen                 | BRE              | 2            |
| Bulgaria                    | Varna                  | VAR              | 1            |
| Germany                     | Frankfurt              | HHN              | 1            |
| United Kingdom              | Cardiff                | CWL              | 1            |
| Italy                       | Alghero                | AHO              | 1            |
| Luxembourg                  | Luxembourg             | LUX              | 1            |
| Italy                       | Florence               | FLR              | 1            |
| France                      | Montpellier            | MPL              | 1            |
| Germany                     | Düsseldorf             | DUS              | 1            |
| Netherlands                 | Rotterdam              | RTM              | 1            |
| Montenegro                  | Podgorica              | TGD              | 1            |
`