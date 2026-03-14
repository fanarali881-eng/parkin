import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import ParkinChat from "@/components/ParkinChat";

/* ───── Plate Structure Data (from Parkin.ae /general/get-plate-structure API) ───── */
const plateStructure = [
  {pid:"2",name:"Dubai",categories:[{pid:"1",name:"Private",codes:[{pid:"5",name:"A"},{pid:"135",name:"AA"},{pid:"6",name:"B"},{pid:"147",name:"BB"},{pid:"7",name:"C"},{pid:"148",name:"CC"},{pid:"8",name:"D"},{pid:"149",name:"DD"},{pid:"26",name:"E"},{pid:"151",name:"EE"},{pid:"27",name:"F"},{pid:"158",name:"FF"},{pid:"34",name:"G"},{pid:"38",name:"H"},{pid:"153",name:"HH"},{pid:"40",name:"I"},{pid:"159",name:"II"},{pid:"42",name:"J"},{pid:"43",name:"K"},{pid:"50",name:"L"},{pid:"44",name:"M"},{pid:"155",name:"MM"},{pid:"52",name:"N"},{pid:"154",name:"NN"},{pid:"60",name:"O"},{pid:"66",name:"P"},{pid:"65",name:"Q"},{pid:"63",name:"R"},{pid:"51",name:"S"},{pid:"62",name:"T"},{pid:"61",name:"U"},{pid:"48",name:"V"},{pid:"69",name:"W"},{pid:"70",name:"X"},{pid:"47",name:"Y"},{pid:"71",name:"Z"}]},{pid:"14",name:"Export",codes:[{pid:"13",name:"Blue"},{pid:"122",name:"Export 2"},{pid:"123",name:"Export 3"},{pid:"124",name:"Export 4"},{pid:"125",name:"Export 5"},{pid:"126",name:"Export 6"},{pid:"127",name:"Export 7"},{pid:"128",name:"Export 8"},{pid:"129",name:"Export 9"}]},{pid:"16",name:"Under Test",codes:[{pid:"142",name:"Under Test"}]},{pid:"18",name:"Consulate",codes:[{pid:"138",name:"Consulate"}]},{pid:"2",name:"Taxi",codes:[{pid:"19",name:"Yellow"}]},{pid:"27",name:"Learning",codes:[{pid:"72",name:"Learning"}]},{pid:"3",name:"Commercial",codes:[{pid:"9",name:"White"}]},{pid:"36",name:"Classical Vehicles",codes:[{pid:"49",name:"CLASSIC"}]},{pid:"37",name:"Trailer",codes:[{pid:"134",name:"TRAILER"}]},{pid:"38",name:"Dubai Flag",codes:[{pid:"140",name:"Dubai Flag"}]},{pid:"4",name:"General Transportation",codes:[{pid:"17",name:"Green"},{pid:"130",name:"PublicTransportation1"}]},{pid:"9",name:"Motor Cycle",codes:[{pid:"9",name:"White"},{pid:"28",name:"White 1"},{pid:"29",name:"White 2"},{pid:"30",name:"White 3"},{pid:"59",name:"White 9"}]}]},
  {pid:"1",name:"Abu Dhabi",categories:[{pid:"1",name:"Private",codes:[{pid:"41",name:"1"},{pid:"46",name:"2"},{pid:"53",name:"4"},{pid:"39",name:"5"},{pid:"45",name:"6"},{pid:"54",name:"7"},{pid:"55",name:"8"},{pid:"56",name:"9"},{pid:"57",name:"10"},{pid:"64",name:"11"},{pid:"67",name:"12"},{pid:"73",name:"13"},{pid:"74",name:"14"},{pid:"120",name:"15"},{pid:"121",name:"16"},{pid:"132",name:"17"},{pid:"139",name:"18"},{pid:"144",name:"19"},{pid:"145",name:"20"},{pid:"150",name:"21"},{pid:"157",name:"22"},{pid:"133",name:"50"}]},{pid:"14",name:"Export",codes:[{pid:"41",name:"1"}]},{pid:"17",name:"Diplomat",codes:[{pid:"136",name:"Diplomat"}]},{pid:"2",name:"Taxi",codes:[{pid:"19",name:"Yellow"}]},{pid:"28",name:"Customs",codes:[{pid:"13",name:"Blue"},{pid:"9",name:"White"}]},{pid:"3",name:"Commercial",codes:[{pid:"9",name:"White"}]},{pid:"33",name:"General Organization",codes:[{pid:"137",name:"International Organization"}]},{pid:"34",name:"Public Transportation",codes:[{pid:"41",name:"1"},{pid:"46",name:"2"}]},{pid:"36",name:"Classical Vehicles",codes:[{pid:"41",name:"1"},{pid:"49",name:"CLASSIC"},{pid:"16",name:"Red"}]},{pid:"37",name:"Trailer",codes:[{pid:"41",name:"1"}]},{pid:"9",name:"Motor Cycle",codes:[{pid:"53",name:"4"},{pid:"16",name:"Red"},{pid:"9",name:"White"},{pid:"156",name:"Yellow 1"}]}]},
  {pid:"3",name:"Sharjah",categories:[{pid:"1",name:"Private",codes:[{pid:"41",name:"1"},{pid:"46",name:"2"},{pid:"131",name:"3"},{pid:"53",name:"4"},{pid:"9",name:"White"}]},{pid:"14",name:"Export",codes:[{pid:"41",name:"1"},{pid:"13",name:"Blue"},{pid:"122",name:"Export 2"},{pid:"123",name:"Export 3"},{pid:"124",name:"Export 4"},{pid:"125",name:"Export 5"}]},{pid:"27",name:"Learning",codes:[{pid:"72",name:"Learning"}]},{pid:"3",name:"Commercial",codes:[{pid:"9",name:"White"}]},{pid:"34",name:"Public Transportation",codes:[{pid:"41",name:"1"},{pid:"46",name:"2"},{pid:"17",name:"Green"}]},{pid:"36",name:"Classical Vehicles",codes:[{pid:"49",name:"CLASSIC"}]},{pid:"37",name:"Trailer",codes:[{pid:"41",name:"1"}]},{pid:"9",name:"Motor Cycle",codes:[{pid:"73",name:"13"},{pid:"9",name:"White"}]}]},
  {pid:"4",name:"Ajman",categories:[{pid:"1",name:"Private",codes:[{pid:"5",name:"A"},{pid:"6",name:"B"},{pid:"7",name:"C"},{pid:"8",name:"D"},{pid:"26",name:"E"},{pid:"27",name:"F"},{pid:"38",name:"H"},{pid:"43",name:"K"}]},{pid:"14",name:"Export",codes:[{pid:"13",name:"Blue"}]},{pid:"16",name:"Under Test",codes:[{pid:"16",name:"Red"}]},{pid:"27",name:"Learning",codes:[{pid:"72",name:"Learning"}]},{pid:"3",name:"Commercial",codes:[{pid:"16",name:"Red"}]},{pid:"34",name:"Public Transportation",codes:[{pid:"17",name:"Green"}]},{pid:"36",name:"Classical Vehicles",codes:[{pid:"49",name:"CLASSIC"}]},{pid:"37",name:"Trailer",codes:[{pid:"134",name:"TRAILER"}]},{pid:"9",name:"Motor Cycle",codes:[{pid:"9",name:"White"}]}]},
  {pid:"6",name:"Ras Al Khaimah",categories:[{pid:"1",name:"Private",codes:[{pid:"5",name:"A"},{pid:"6",name:"B"},{pid:"7",name:"C"},{pid:"8",name:"D"},{pid:"27",name:"F"},{pid:"34",name:"G"},{pid:"40",name:"I"},{pid:"43",name:"K"},{pid:"44",name:"M"},{pid:"52",name:"N"},{pid:"66",name:"P"},{pid:"51",name:"S"},{pid:"61",name:"U"},{pid:"48",name:"V"},{pid:"70",name:"X"},{pid:"47",name:"Y"},{pid:"71",name:"Z"}]},{pid:"14",name:"Export",codes:[{pid:"13",name:"Blue"}]},{pid:"16",name:"Under Test",codes:[{pid:"16",name:"Red"}]},{pid:"2",name:"Taxi",codes:[{pid:"17",name:"Green"}]},{pid:"22",name:"Government",codes:[{pid:"9",name:"White"}]},{pid:"3",name:"Commercial",codes:[{pid:"16",name:"Red"},{pid:"9",name:"White"}]},{pid:"37",name:"Trailer",codes:[{pid:"24",name:"White+Green"}]},{pid:"4",name:"General Transportation",codes:[{pid:"17",name:"Green"}]},{pid:"9",name:"Motor Cycle",codes:[{pid:"41",name:"1"},{pid:"53",name:"4"},{pid:"9",name:"White"}]}]},
  {pid:"7",name:"Fujairah",categories:[{pid:"1",name:"Private",codes:[{pid:"5",name:"A"},{pid:"6",name:"B"},{pid:"7",name:"C"},{pid:"8",name:"D"},{pid:"26",name:"E"},{pid:"27",name:"F"},{pid:"34",name:"G"},{pid:"38",name:"H"},{pid:"40",name:"I"},{pid:"42",name:"J"},{pid:"43",name:"K"},{pid:"50",name:"L"},{pid:"44",name:"M"},{pid:"52",name:"N"},{pid:"60",name:"O"},{pid:"66",name:"P"},{pid:"63",name:"R"},{pid:"51",name:"S"},{pid:"62",name:"T"},{pid:"61",name:"U"},{pid:"48",name:"V"},{pid:"70",name:"X"},{pid:"47",name:"Y"},{pid:"71",name:"Z"}]},{pid:"14",name:"Export",codes:[{pid:"13",name:"Blue"}]},{pid:"16",name:"Under Test",codes:[{pid:"16",name:"Red"}]},{pid:"2",name:"Taxi",codes:[{pid:"17",name:"Green"}]},{pid:"3",name:"Commercial",codes:[{pid:"16",name:"Red"}]},{pid:"37",name:"Trailer",codes:[{pid:"5",name:"A"}]},{pid:"4",name:"General Transportation",codes:[{pid:"17",name:"Green"}]},{pid:"9",name:"Motor Cycle",codes:[{pid:"9",name:"White"}]}]},
  {pid:"5",name:"Umm Al Quwain",categories:[{pid:"1",name:"Private",codes:[{pid:"5",name:"A"},{pid:"6",name:"B"},{pid:"7",name:"C"},{pid:"8",name:"D"},{pid:"26",name:"E"},{pid:"27",name:"F"},{pid:"34",name:"G"},{pid:"38",name:"H"},{pid:"40",name:"I"},{pid:"42",name:"J"},{pid:"43",name:"K"},{pid:"50",name:"L"},{pid:"44",name:"M"},{pid:"52",name:"N"},{pid:"9",name:"White"},{pid:"70",name:"X"}]},{pid:"14",name:"Export",codes:[{pid:"13",name:"Blue"}]},{pid:"16",name:"Under Test",codes:[{pid:"16",name:"Red"}]},{pid:"2",name:"Taxi",codes:[{pid:"17",name:"Green"}]},{pid:"27",name:"Learning",codes:[{pid:"72",name:"Learning"}]},{pid:"3",name:"Commercial",codes:[{pid:"16",name:"Red"}]},{pid:"37",name:"Trailer",codes:[{pid:"17",name:"Green"}]},{pid:"4",name:"General Transportation",codes:[{pid:"17",name:"Green"}]},{pid:"9",name:"Motor Cycle",codes:[{pid:"5",name:"A"},{pid:"6",name:"B"},{pid:"9",name:"White"}]}]},
  {pid:"19",name:"Iraq",categories:[{pid:"1",name:"Private",codes:[{pid:"18",name:"Orange"},{pid:"9",name:"White"}]}]},
  {pid:"16",name:"Syria",categories:[{pid:"1",name:"Private",codes:[{pid:"36",name:"White + Black"}]},{pid:"11",name:"Rent-A-Car",codes:[{pid:"15",name:"Blue+White Number"}]},{pid:"2",name:"Taxi",codes:[{pid:"23",name:"White+Red"}]},{pid:"22",name:"Government",codes:[{pid:"24",name:"White+Green"}]},{pid:"3",name:"Commercial",codes:[{pid:"37",name:"Yallow + Black"}]},{pid:"33",name:"General Organization",codes:[{pid:"14",name:"Light Blue"}]},{pid:"4",name:"General Transportation",codes:[{pid:"23",name:"White+Red"}]},{pid:"6",name:"General Bus",codes:[{pid:"23",name:"White+Red"}]}]},
  {pid:"18",name:"Jordan",categories:[{pid:"1",name:"Private",codes:[{pid:"9",name:"White"}]}]},
  {pid:"20",name:"Lebanon",categories:[{pid:"1",name:"Private",codes:[{pid:"9",name:"White"}]},{pid:"2",name:"Taxi",codes:[{pid:"16",name:"Red"}]},{pid:"4",name:"General Transportation",codes:[{pid:"17",name:"Green"}]}]},
  {pid:"17",name:"Yemen",categories:[{pid:"1",name:"Private",codes:[{pid:"13",name:"Blue"}]},{pid:"4",name:"General Transportation",codes:[{pid:"16",name:"Red"}]}]},
  {pid:"8",name:"Saudi Arabia",categories:[{pid:"1",name:"Private",codes:[{pid:"9",name:"White"}]},{pid:"14",name:"Export",codes:[{pid:"11",name:"Black"}]},{pid:"15",name:"Temporary",codes:[{pid:"11",name:"Black"}]},{pid:"17",name:"Diplomat",codes:[{pid:"17",name:"Green"}]},{pid:"18",name:"Consulate",codes:[{pid:"17",name:"Green"}]},{pid:"2",name:"Taxi",codes:[{pid:"19",name:"Yellow"}]},{pid:"28",name:"Customs",codes:[{pid:"11",name:"Black"}]},{pid:"3",name:"Commercial",codes:[{pid:"13",name:"Blue"}]},{pid:"31",name:"Haj",codes:[{pid:"11",name:"Black"}]},{pid:"34",name:"Public Transportation",codes:[{pid:"19",name:"Yellow"}]},{pid:"4",name:"General Transportation",codes:[{pid:"13",name:"Blue"},{pid:"19",name:"Yellow"}]},{pid:"5",name:"Private Transport",codes:[{pid:"13",name:"Blue"}]},{pid:"6",name:"General Bus",codes:[{pid:"16",name:"Red"}]},{pid:"7",name:"Private Bus",codes:[{pid:"16",name:"Red"}]},{pid:"8",name:"Heavy Equipment",codes:[{pid:"18",name:"Orange"}]},{pid:"9",name:"Motor Cycle",codes:[{pid:"9",name:"White"}]}]},
  {pid:"10",name:"Bahrain",categories:[{pid:"1",name:"Private",codes:[{pid:"9",name:"White"}]},{pid:"14",name:"Export",codes:[{pid:"16",name:"Red"}]},{pid:"19",name:"Political",codes:[{pid:"17",name:"Green"}]},{pid:"24",name:"Police",codes:[{pid:"13",name:"Blue"}]},{pid:"4",name:"General Transportation",codes:[{pid:"19",name:"Yellow"}]},{pid:"5",name:"Private Transport",codes:[{pid:"18",name:"Orange"},{pid:"16",name:"Red"}]}]},
  {pid:"11",name:"Kuwait",categories:[{pid:"1",name:"Private",codes:[{pid:"28",name:"White 1"},{pid:"79",name:"White 10"},{pid:"80",name:"White 11"},{pid:"81",name:"White 12"},{pid:"82",name:"White 13"},{pid:"83",name:"White 14"},{pid:"84",name:"White 15"},{pid:"85",name:"White 16"},{pid:"86",name:"White 17"},{pid:"87",name:"White 18"},{pid:"88",name:"White 19"},{pid:"29",name:"White 2"},{pid:"89",name:"White 20"},{pid:"90",name:"White 21"},{pid:"91",name:"White 22"},{pid:"92",name:"White 23"},{pid:"93",name:"White 24"},{pid:"94",name:"White 25"},{pid:"95",name:"White 26"},{pid:"96",name:"White 27"},{pid:"97",name:"White 28"},{pid:"98",name:"White 29"},{pid:"30",name:"White 3"},{pid:"99",name:"White 30"},{pid:"100",name:"White 31"},{pid:"101",name:"White 32"},{pid:"102",name:"White 33"},{pid:"103",name:"White 34"},{pid:"104",name:"White 35"},{pid:"105",name:"White 36"},{pid:"106",name:"White 37"},{pid:"107",name:"White 38"},{pid:"108",name:"White 39"},{pid:"31",name:"White 4"},{pid:"109",name:"White 40"},{pid:"110",name:"White 41"},{pid:"111",name:"White 42"},{pid:"112",name:"White 43"},{pid:"113",name:"White 44"},{pid:"114",name:"White 45"},{pid:"115",name:"White 46"},{pid:"116",name:"White 47"},{pid:"117",name:"White 48"},{pid:"118",name:"White 49"},{pid:"75",name:"White 5"},{pid:"119",name:"White 50"},{pid:"76",name:"White 6"},{pid:"141",name:"White 60"},{pid:"77",name:"White 7"},{pid:"143",name:"White 70"},{pid:"78",name:"White 8"},{pid:"146",name:"White 80"},{pid:"59",name:"White 9"},{pid:"152",name:"White 90"}]},{pid:"13",name:"Temporary Customs Entrance",codes:[{pid:"23",name:"White+Red"}]},{pid:"14",name:"Export",codes:[{pid:"24",name:"White+Green"}]},{pid:"19",name:"Political",codes:[{pid:"19",name:"Yellow"}]},{pid:"2",name:"Taxi",codes:[{pid:"20",name:"Orange+Yellow"}]},{pid:"22",name:"Government",codes:[{pid:"13",name:"Blue"}]},{pid:"25",name:"Emir Court",codes:[{pid:"15",name:"Blue+White Number"}]},{pid:"26",name:"Constructions",codes:[{pid:"22",name:"W+Y"}]},{pid:"3",name:"Commercial",codes:[{pid:"23",name:"White+Red"}]},{pid:"4",name:"General Transportation",codes:[{pid:"18",name:"Orange"}]},{pid:"5",name:"Private Transport",codes:[{pid:"20",name:"Orange+Yellow"}]},{pid:"9",name:"Motor Cycle",codes:[{pid:"19",name:"Yellow"}]}]},
  {pid:"9",name:"Qatar",categories:[{pid:"1",name:"Private",codes:[{pid:"9",name:"White"}]},{pid:"14",name:"Export",codes:[{pid:"13",name:"Blue"},{pid:"18",name:"Orange"}]},{pid:"18",name:"Consulate",codes:[{pid:"22",name:"W+Y"}]},{pid:"2",name:"Taxi",codes:[{pid:"18",name:"Orange"}]},{pid:"20",name:"C.D",codes:[{pid:"22",name:"W+Y"}]},{pid:"21",name:"Government(GOV)",codes:[{pid:"9",name:"White"}]},{pid:"4",name:"General Transportation",codes:[{pid:"16",name:"Red"}]},{pid:"5",name:"Private Transport",codes:[{pid:"11",name:"Black"}]},{pid:"9",name:"Motor Cycle",codes:[{pid:"9",name:"White"}]}]},
  {pid:"12",name:"Oman",categories:[{pid:"1",name:"Private",codes:[{pid:"19",name:"Yellow"}]},{pid:"10",name:"Tractor",codes:[{pid:"17",name:"Green"}]},{pid:"11",name:"Rent-A-Car",codes:[{pid:"16",name:"Red"},{pid:"9",name:"White"}]},{pid:"12",name:"Temporary Checking",codes:[{pid:"17",name:"Green"}]},{pid:"14",name:"Export",codes:[{pid:"13",name:"Blue"}]},{pid:"18",name:"Consulate",codes:[{pid:"18",name:"Orange"}]},{pid:"19",name:"Political",codes:[{pid:"10",name:"Off White"}]},{pid:"2",name:"Taxi",codes:[{pid:"16",name:"Red"}]},{pid:"22",name:"Government",codes:[{pid:"9",name:"White"}]},{pid:"23",name:"United Nations",codes:[{pid:"14",name:"Light Blue"}]},{pid:"27",name:"Learning",codes:[{pid:"21",name:"Pink"}]},{pid:"3",name:"Commercial",codes:[{pid:"11",name:"Black"},{pid:"16",name:"Red"}]},{pid:"9",name:"Motor Cycle",codes:[{pid:"25",name:"According to Plate Type"}]}]},
];

/* ───── Parking Zones Data (334 real zones from Parkin.ae API) ───── */
const parkingZones = [
  { code: "111A", name: "Al Corniche", nameAr: "الكورنيش" },
  { code: "111AP", name: "Al Corniche", nameAr: "الكورنيش" },
  { code: "112AP", name: "Al Ras", nameAr: "الراس" },
  { code: "112BP", name: "Al Ras", nameAr: "الراس" },
  { code: "113AP", name: "Al Daghaya", nameAr: "الضغاية" },
  { code: "114AP", name: "Al Buteen", nameAr: "البطين" },
  { code: "115AP", name: "Al Sabkha", nameAr: "السبخة" },
  { code: "116AP", name: "Ayal Nasir", nameAr: "عيال ناصر" },
  { code: "117AP", name: "Al Murar", nameAr: "المرر" },
  { code: "117BP", name: "Al Murar", nameAr: "المرر" },
  { code: "118AP", name: "Naif", nameAr: "نايف" },
  { code: "119AP", name: "Al Rigga", nameAr: "الرقة" },
  { code: "119BP", name: "Al Rigga", nameAr: "الرقة" },
  { code: "122A", name: "Al Baraha", nameAr: "البراحة" },
  { code: "122C", name: "Al Baraha", nameAr: "البراحة" },
  { code: "122D", name: "Al Baraha", nameAr: "البراحة" },
  { code: "123A", name: "Al Muteena", nameAr: "المطينة" },
  { code: "123AP", name: "Al Muteena", nameAr: "المطينة" },
  { code: "123C", name: "Al Muteena", nameAr: "المطينة" },
  { code: "123CP", name: "Al Muteena", nameAr: "المطينة" },
  { code: "123D", name: "Al Muteena", nameAr: "المطينة" },
  { code: "124AP", name: "Al Muraqqabat", nameAr: "المرقبات" },
  { code: "124BP", name: "Al Muraqqabat", nameAr: "المرقبات" },
  { code: "124CP", name: "Al Muraqqabat", nameAr: "المرقبات" },
  { code: "124DP", name: "Al Muraqqabat", nameAr: "المرقبات" },
  { code: "124MP", name: "Al Muraqqabat", nameAr: "المرقبات" },
  { code: "125AP", name: "Riggat Al Buteen", nameAr: "رقة البطين" },
  { code: "125C", name: "Riggat Al Buteen", nameAr: "رقة البطين" },
  { code: "125CP", name: "Riggat Al Buteen", nameAr: "رقة البطين" },
  { code: "125DP", name: "Riggat Al Buteen", nameAr: "رقة البطين" },
  { code: "126A", name: "Abu Hail", nameAr: "أبو هيل" },
  { code: "126C", name: "Abu Hail", nameAr: "أبو هيل" },
  { code: "126D", name: "Abu Hail", nameAr: "أبو هيل" },
  { code: "126M", name: "Abu Hail", nameAr: "أبو هيل" },
  { code: "127A", name: "Hor Al Anz", nameAr: "هور العنز" },
  { code: "127AP", name: "Hor Al Anz", nameAr: "هور العنز" },
  { code: "127C", name: "Hor Al Anz", nameAr: "هور العنز" },
  { code: "127CP", name: "Hor Al Anz", nameAr: "هور العنز" },
  { code: "127D", name: "Hor Al Anz", nameAr: "هور العنز" },
  { code: "127DP", name: "Hor Al Anz", nameAr: "هور العنز" },
  { code: "127M", name: "Hor Al Anz", nameAr: "هور العنز" },
  { code: "128AP", name: "Al Khabaisi", nameAr: "الخبيصي" },
  { code: "128CP", name: "Al Khabaisi", nameAr: "الخبيصي" },
  { code: "129A", name: "Port Saeed", nameAr: "بور سعيد" },
  { code: "129AP", name: "Port Saeed", nameAr: "بور سعيد" },
  { code: "129CP", name: "Port Saeed", nameAr: "بور سعيد" },
  { code: "129DP", name: "Port Saeed", nameAr: "بور سعيد" },
  { code: "131C", name: "Al Hamriya Port", nameAr: "ميناء الحمرية" },
  { code: "132C", name: "Al Wuheida", nameAr: "الوحيدة" },
  { code: "132M", name: "Al Wuheida", nameAr: "الوحيدة" },
  { code: "133AP", name: "Hor Al Anz East", nameAr: "هور العنز شرق" },
  { code: "133CP", name: "Hor Al Anz East", nameAr: "هور العنز شرق" },
  { code: "133DP", name: "Hor Al Anz East", nameAr: "هور العنز شرق" },
  { code: "134C", name: "Al Mamzar", nameAr: "الممزر" },
  { code: "134D", name: "Al Mamzar", nameAr: "الممزر" },
  { code: "134M", name: "Al Mamzar", nameAr: "الممزر" },
  { code: "214AP", name: "Al Garhoud", nameAr: "القرهود" },
  { code: "214C", name: "Al Garhoud", nameAr: "القرهود" },
  { code: "214CP", name: "Al Garhoud", nameAr: "القرهود" },
  { code: "214D", name: "Al Garhoud", nameAr: "القرهود" },
  { code: "214M", name: "Al Garhoud", nameAr: "القرهود" },
  { code: "214MP", name: "Al Garhoud", nameAr: "القرهود" },
  { code: "215C", name: "Umm Ramool", nameAr: "أم رمول" },
  { code: "215CP", name: "Umm Ramool", nameAr: "أم رمول" },
  { code: "215M", name: "Umm Ramool", nameAr: "أم رمول" },
  { code: "216C", name: "Al Rashidiya", nameAr: "الراشدية" },
  { code: "216M", name: "Al Rashidiya", nameAr: "الراشدية" },
  { code: "221AP", name: "Dubai Int\'l Airport", nameAr: "مطار دبي الدولي" },
  { code: "221C", name: "Dubai Int\'l Airport", nameAr: "مطار دبي الدولي" },
  { code: "221CP", name: "Dubai Int\'l Airport", nameAr: "مطار دبي الدولي" },
  { code: "221DP", name: "Dubai Int\'l Airport", nameAr: "مطار دبي الدولي" },
  { code: "226C", name: "Al Twar First", nameAr: "الطوار الأولى" },
  { code: "226CP", name: "Al Twar First", nameAr: "الطوار الأولى" },
  { code: "226D", name: "Al Twar First", nameAr: "الطوار الأولى" },
  { code: "226DP", name: "Al Twar First", nameAr: "الطوار الأولى" },
  { code: "226MP", name: "Al Twar First", nameAr: "الطوار الأولى" },
  { code: "227C", name: "Al Twar Second", nameAr: "الطوار الثانية" },
  { code: "227CP", name: "Al Twar Second", nameAr: "الطوار الثانية" },
  { code: "231C", name: "Al Nahda First", nameAr: "النهدة الأولى" },
  { code: "231CP", name: "Al Nahda First", nameAr: "النهدة الأولى" },
  { code: "231D", name: "Al Nahda First", nameAr: "النهدة الأولى" },
  { code: "231DP", name: "Al Nahda First", nameAr: "النهدة الأولى" },
  { code: "231M", name: "Al Nahda First", nameAr: "النهدة الأولى" },
  { code: "232C", name: "Al Qusais First", nameAr: "القصيص الأولى" },
  { code: "232CP", name: "Al Qusais First", nameAr: "القصيص الأولى" },
  { code: "232D", name: "Al Qusais First", nameAr: "القصيص الأولى" },
  { code: "232DP", name: "Al Qusais First", nameAr: "القصيص الأولى" },
  { code: "232M", name: "Al Qusais First", nameAr: "القصيص الأولى" },
  { code: "232W", name: "Al Qusais First", nameAr: "القصيص الأولى" },
  { code: "233C", name: "Al Qusais Second", nameAr: "القصيص الثانية" },
  { code: "233CP", name: "Al Qusais Second", nameAr: "القصيص الثانية" },
  { code: "233D", name: "Al Qusais Second", nameAr: "القصيص الثانية" },
  { code: "233DP", name: "Al Qusais Second", nameAr: "القصيص الثانية" },
  { code: "241C", name: "Al Nahda Second", nameAr: "النهدة الثانية" },
  { code: "241D", name: "Al Nahda Second", nameAr: "النهدة الثانية" },
  { code: "241M", name: "Al Nahda Second", nameAr: "النهدة الثانية" },
  { code: "242C", name: "Al Qusais Ind. First", nameAr: "القصيص الصناعية الأولى" },
  { code: "243C", name: "Al Qusais Ind. Second", nameAr: "القصيص الصناعية الثانية" },
  { code: "245C", name: "Muhaisanah Fourth", nameAr: "محيصنة الرابعة" },
  { code: "245D", name: "Muhaisanah Fourth", nameAr: "محيصنة الرابعة" },
  { code: "245M", name: "Muhaisanah Fourth", nameAr: "محيصنة الرابعة" },
  { code: "246C", name: "Al Qusais Ind. Third", nameAr: "القصيص الصناعية الثالثة" },
  { code: "247C", name: "Al Qusais Ind. Fourth", nameAr: "القصيص الصناعية الرابعة" },
  { code: "247M", name: "Al Qusais Ind. Fourth", nameAr: "القصيص الصناعية الرابعة" },
  { code: "251C", name: "Mirdif", nameAr: "مردف" },
  { code: "251D", name: "Mirdif", nameAr: "مردف" },
  { code: "251M", name: "Mirdif", nameAr: "مردف" },
  { code: "262D", name: "Al Mizhar First", nameAr: "المزهر الأولى" },
  { code: "283M", name: "Aleyas", nameAr: "العياص" },
  { code: "311AP", name: "Al Shindagha", nameAr: "الشندغة" },
  { code: "311BP", name: "Al Shindagha", nameAr: "الشندغة" },
  { code: "312AP", name: "Al Souq Al Kabeer", nameAr: "السوق الكبير" },
  { code: "312BP", name: "Al Souq Al Kabeer", nameAr: "السوق الكبير" },
  { code: "313AP", name: "Al Hamriya", nameAr: "الحمرية" },
  { code: "313CP", name: "Al Hamriya", nameAr: "الحمرية" },
  { code: "313DP", name: "Al Hamriya", nameAr: "الحمرية" },
  { code: "314AP", name: "Umm Hurair First", nameAr: "أم هرير الأولى" },
  { code: "314BP", name: "Umm Hurair First", nameAr: "أم هرير الأولى" },
  { code: "315AP", name: "Umm Hurair Second", nameAr: "أم هرير الثانية" },
  { code: "315C", name: "Umm Hurair Second", nameAr: "أم هرير الثانية" },
  { code: "315CP", name: "Umm Hurair Second", nameAr: "أم هرير الثانية" },
  { code: "315D", name: "Umm Hurair Second", nameAr: "أم هرير الثانية" },
  { code: "315DP", name: "Umm Hurair Second", nameAr: "أم هرير الثانية" },
  { code: "315GP", name: "Umm Hurair Second", nameAr: "أم هرير الثانية" },
  { code: "316A", name: "Al Raffa", nameAr: "الرفاعة" },
  { code: "316AP", name: "Al Raffa", nameAr: "الرفاعة" },
  { code: "316B", name: "Al Raffa", nameAr: "الرفاعة" },
  { code: "316C", name: "Al Raffa", nameAr: "الرفاعة" },
  { code: "316CP", name: "Al Raffa", nameAr: "الرفاعة" },
  { code: "316D", name: "Al Raffa", nameAr: "الرفاعة" },
  { code: "316MP", name: "Al Raffa", nameAr: "الرفاعة" },
  { code: "317AP", name: "Mankhool", nameAr: "منخول" },
  { code: "317C", name: "Mankhool", nameAr: "منخول" },
  { code: "317CP", name: "Mankhool", nameAr: "منخول" },
  { code: "317DP", name: "Mankhool", nameAr: "منخول" },
  { code: "317M", name: "Mankhool", nameAr: "منخول" },
  { code: "318A", name: "Al Karama", nameAr: "الكرامة" },
  { code: "318AP", name: "Al Karama", nameAr: "الكرامة" },
  { code: "318B", name: "Al Karama", nameAr: "الكرامة" },
  { code: "318C", name: "Al Karama", nameAr: "الكرامة" },
  { code: "318CP", name: "Al Karama", nameAr: "الكرامة" },
  { code: "318D", name: "Al Karama", nameAr: "الكرامة" },
  { code: "318DP", name: "Al Karama", nameAr: "الكرامة" },
  { code: "318MP", name: "Al Karama", nameAr: "الكرامة" },
  { code: "318W", name: "Al Karama", nameAr: "الكرامة" },
  { code: "319A", name: "Oud Metha", nameAr: "عود ميثاء" },
  { code: "319AP", name: "Oud Metha", nameAr: "عود ميثاء" },
  { code: "319C", name: "Oud Metha", nameAr: "عود ميثاء" },
  { code: "319CP", name: "Oud Metha", nameAr: "عود ميثاء" },
  { code: "319D", name: "Oud Metha", nameAr: "عود ميثاء" },
  { code: "319DP", name: "Oud Metha", nameAr: "عود ميثاء" },
  { code: "321A", name: "Madinat Dubai Al Melaheyah", nameAr: "مدينة دبي الملاحية" },
  { code: "321C", name: "Madinat Dubai Al Melaheyah", nameAr: "مدينة دبي الملاحية" },
  { code: "321F", name: "Madinat Dubai Al Melaheyah", nameAr: "مدينة دبي الملاحية" },
  { code: "321M", name: "Madinat Dubai Al Melaheyah", nameAr: "مدينة دبي الملاحية" },
  { code: "321W", name: "Madinat Dubai Al Melaheyah", nameAr: "مدينة دبي الملاحية" },
  { code: "322A", name: "Al Hudaiba", nameAr: "الحضيبة" },
  { code: "322AP", name: "Al Hudaiba", nameAr: "الحضيبة" },
  { code: "322C", name: "Al Hudaiba", nameAr: "الحضيبة" },
  { code: "322D", name: "Al Hudaiba", nameAr: "الحضيبة" },
  { code: "322M", name: "Al Hudaiba", nameAr: "الحضيبة" },
  { code: "323AP", name: "Al Jafiliya", nameAr: "الجافلية" },
  { code: "323C", name: "Al Jafiliya", nameAr: "الجافلية" },
  { code: "323CP", name: "Al Jafiliya", nameAr: "الجافلية" },
  { code: "323D", name: "Al Jafiliya", nameAr: "الجافلية" },
  { code: "323DP", name: "Al Jafiliya", nameAr: "الجافلية" },
  { code: "323M", name: "Al Jafiliya", nameAr: "الجافلية" },
  { code: "324CP", name: "Al Kifaf", nameAr: "الكفاف" },
  { code: "324DP", name: "Al Kifaf", nameAr: "الكفاف" },
  { code: "324MP", name: "Al Kifaf", nameAr: "الكفاف" },
  { code: "324WP", name: "Al Kifaf", nameAr: "الكفاف" },
  { code: "326A", name: "Al Jadaf", nameAr: "الجداف" },
  { code: "326C", name: "Al Jadaf", nameAr: "الجداف" },
  { code: "326D", name: "Al Jadaf", nameAr: "الجداف" },
  { code: "326M", name: "Al Jadaf", nameAr: "الجداف" },
  { code: "332C", name: "Jumeira First", nameAr: "جميرا الأولى" },
  { code: "332CP", name: "Jumeira First", nameAr: "جميرا الأولى" },
  { code: "332DP", name: "Jumeira First", nameAr: "جميرا الأولى" },
  { code: "332MP", name: "Jumeira First", nameAr: "جميرا الأولى" },
  { code: "333AP", name: "Al Bada", nameAr: "البدع" },
  { code: "333C", name: "Al Bada", nameAr: "البدع" },
  { code: "333CP", name: "Al Bada", nameAr: "البدع" },
  { code: "333DP", name: "Al Bada", nameAr: "البدع" },
  { code: "333MP", name: "Al Bada", nameAr: "البدع" },
  { code: "334AP", name: "Al Satwa", nameAr: "السطوة" },
  { code: "334C", name: "Al Satwa", nameAr: "السطوة" },
  { code: "334CP", name: "Al Satwa", nameAr: "السطوة" },
  { code: "334D", name: "Al Satwa", nameAr: "السطوة" },
  { code: "334DP", name: "Al Satwa", nameAr: "السطوة" },
  { code: "335AP", name: "Trade Center First", nameAr: "المركز التجاري الأولى" },
  { code: "335BP", name: "Trade Center First", nameAr: "المركز التجاري الأولى" },
  { code: "335X", name: "Trade Center First", nameAr: "المركز التجاري الأولى" },
  { code: "336AP", name: "Trade Center Second", nameAr: "المركز التجاري الثانية" },
  { code: "336X", name: "Trade Center Second", nameAr: "المركز التجاري الثانية" },
  { code: "337A", name: "Zaa\'beel Second", nameAr: "زعبيل الثانية" },
  { code: "337AP", name: "Zaa\'beel Second", nameAr: "زعبيل الثانية" },
  { code: "337M", name: "Zaa\'beel Second", nameAr: "زعبيل الثانية" },
  { code: "337X", name: "Zaa\'beel Second", nameAr: "زعبيل الثانية" },
  { code: "342A", name: "Jumeira Second", nameAr: "جميرا الثانية" },
  { code: "342AP", name: "Jumeira Second", nameAr: "جميرا الثانية" },
  { code: "342C", name: "Jumeira Second", nameAr: "جميرا الثانية" },
  { code: "342CP", name: "Jumeira Second", nameAr: "جميرا الثانية" },
  { code: "342MP", name: "Jumeira Second", nameAr: "جميرا الثانية" },
  { code: "343A", name: "Al Wasl", nameAr: "الوصل" },
  { code: "343AP", name: "Al Wasl", nameAr: "الوصل" },
  { code: "343C", name: "Al Wasl", nameAr: "الوصل" },
  { code: "343CP", name: "Al Wasl", nameAr: "الوصل" },
  { code: "343D", name: "Al Wasl", nameAr: "الوصل" },
  { code: "343DP", name: "Al Wasl", nameAr: "الوصل" },
  { code: "343G", name: "Al Wasl", nameAr: "الوصل" },
  { code: "343M", name: "Al Wasl", nameAr: "الوصل" },
  { code: "343MP", name: "Al Wasl", nameAr: "الوصل" },
  { code: "345CP", name: "Burj Khalifa", nameAr: "برج خليفة" },
  { code: "345GP", name: "Burj Khalifa", nameAr: "برج خليفة" },
  { code: "346AP", name: "Business Bay", nameAr: "الخليج التجاري" },
  { code: "346CP", name: "Business Bay", nameAr: "الخليج التجاري" },
  { code: "346DP", name: "Business Bay", nameAr: "الخليج التجاري" },
  { code: "346GP", name: "Business Bay", nameAr: "الخليج التجاري" },
  { code: "346MP", name: "Business Bay", nameAr: "الخليج التجاري" },
  { code: "352C", name: "Jumeira Third", nameAr: "جميرا الثالثة" },
  { code: "352CP", name: "Jumeira Third", nameAr: "جميرا الثالثة" },
  { code: "352D", name: "Jumeira Third", nameAr: "جميرا الثالثة" },
  { code: "352MP", name: "Jumeira Third", nameAr: "جميرا الثالثة" },
  { code: "353C", name: "Al Safa First", nameAr: "الصفا الأولى" },
  { code: "353CP", name: "Al Safa First", nameAr: "الصفا الأولى" },
  { code: "354C", name: "Al Qouz First", nameAr: "القوز الأولى" },
  { code: "354M", name: "Al Qouz First", nameAr: "القوز الأولى" },
  { code: "356C", name: "Umm Suqeim First", nameAr: "أم سقيم الأولى" },
  { code: "356CP", name: "Umm Suqeim First", nameAr: "أم سقيم الأولى" },
  { code: "356D", name: "Umm Suqeim First", nameAr: "أم سقيم الأولى" },
  { code: "356M", name: "Umm Suqeim First", nameAr: "أم سقيم الأولى" },
  { code: "356MP", name: "Umm Suqeim First", nameAr: "أم سقيم الأولى" },
  { code: "357CP", name: "Al Safa Second", nameAr: "الصفا الثانية" },
  { code: "357D", name: "Al Safa Second", nameAr: "الصفا الثانية" },
  { code: "358C", name: "Al Qouz Third", nameAr: "القوز الثالثة" },
  { code: "358M", name: "Al Qouz Third", nameAr: "القوز الثالثة" },
  { code: "359C", name: "Al Qouz Fourth", nameAr: "القوز الرابعة" },
  { code: "359D", name: "Al Qouz Fourth", nameAr: "القوز الرابعة" },
  { code: "362C", name: "Umm Suqeim Second", nameAr: "أم سقيم الثانية" },
  { code: "362CP", name: "Umm Suqeim Second", nameAr: "أم سقيم الثانية" },
  { code: "362D", name: "Umm Suqeim Second", nameAr: "أم سقيم الثانية" },
  { code: "362MP", name: "Umm Suqeim Second", nameAr: "أم سقيم الثانية" },
  { code: "363C", name: "Al Manara", nameAr: "المنارة" },
  { code: "363CP", name: "Al Manara", nameAr: "المنارة" },
  { code: "363D", name: "Al Manara", nameAr: "المنارة" },
  { code: "363M", name: "Al Manara", nameAr: "المنارة" },
  { code: "364C", name: "Al Qouz Ind.first", nameAr: "القوز الصناعية الأولى" },
  { code: "364CP", name: "Al Qouz Ind.first", nameAr: "القوز الصناعية الأولى" },
  { code: "364D", name: "Al Qouz Ind.first", nameAr: "القوز الصناعية الأولى" },
  { code: "364DP", name: "Al Qouz Ind.first", nameAr: "القوز الصناعية الأولى" },
  { code: "365C", name: "Al Qouz Ind.second", nameAr: "القوز الصناعية الثانية" },
  { code: "365N", name: "Al Qouz Ind.second", nameAr: "القوز الصناعية الثانية" },
  { code: "366C", name: "Umm Suqeim Third", nameAr: "أم سقيم الثالثة" },
  { code: "366CP", name: "Umm Suqeim Third", nameAr: "أم سقيم الثالثة" },
  { code: "366MP", name: "Umm Suqeim Third", nameAr: "أم سقيم الثالثة" },
  { code: "367C", name: "Umm Al Sheif", nameAr: "أم الشيف" },
  { code: "367CP", name: "Umm Al Sheif", nameAr: "أم الشيف" },
  { code: "367D", name: "Umm Al Sheif", nameAr: "أم الشيف" },
  { code: "367M", name: "Umm Al Sheif", nameAr: "أم الشيف" },
  { code: "368C", name: "Al Qouz Ind.third", nameAr: "القوز الصناعية الثالثة" },
  { code: "368CP", name: "Al Qouz Ind.third", nameAr: "القوز الصناعية الثالثة" },
  { code: "368D", name: "Al Qouz Ind.third", nameAr: "القوز الصناعية الثالثة" },
  { code: "368DP", name: "Al Qouz Ind.third", nameAr: "القوز الصناعية الثالثة" },
  { code: "369C", name: "Al Qouz Ind.fourth", nameAr: "القوز الصناعية الرابعة" },
  { code: "372A", name: "Al Safouh First", nameAr: "الصفوح الأولى" },
  { code: "372B", name: "Al Safouh First", nameAr: "الصفوح الأولى" },
  { code: "372C", name: "Al Safouh First", nameAr: "الصفوح الأولى" },
  { code: "372CP", name: "Al Safouh First", nameAr: "الصفوح الأولى" },
  { code: "373C", name: "Al Barsha First", nameAr: "البرشاء الأولى" },
  { code: "373CP", name: "Al Barsha First", nameAr: "البرشاء الأولى" },
  { code: "373D", name: "Al Barsha First", nameAr: "البرشاء الأولى" },
  { code: "373DP", name: "Al Barsha First", nameAr: "البرشاء الأولى" },
  { code: "373M", name: "Al Barsha First", nameAr: "البرشاء الأولى" },
  { code: "375C", name: "Al Barsha Third", nameAr: "البرشاء الثالثة" },
  { code: "375D", name: "Al Barsha Third", nameAr: "البرشاء الثالثة" },
  { code: "376C", name: "Al Barsha Second", nameAr: "البرشاء الثانية" },
  { code: "376M", name: "Al Barsha Second", nameAr: "البرشاء الثانية" },
  { code: "381M", name: "Nakhlat Jumeira", nameAr: "نخلة جميرا" },
  { code: "382C", name: "Al Safouh Second", nameAr: "الصفوح الثانية" },
  { code: "382CP", name: "Al Safouh Second", nameAr: "الصفوح الثانية" },
  { code: "382D", name: "Al Safouh Second", nameAr: "الصفوح الثانية" },
  { code: "382F", name: "Al Safouh Second", nameAr: "الصفوح الثانية" },
  { code: "383A", name: "Al Thanyah First", nameAr: "الثنيه الأولى" },
  { code: "383AP", name: "Al Thanyah First", nameAr: "الثنيه الأولى" },
  { code: "388C", name: "Al Thanyah Third", nameAr: "الثنيه الثالثة" },
  { code: "388CP", name: "Al Thanyah Third", nameAr: "الثنيه الثالثة" },
  { code: "388M", name: "Al Thanyah Third", nameAr: "الثنيه الثالثة" },
  { code: "392AP", name: "Marsa Dubai", nameAr: "مرسى دبي" },
  { code: "392MP", name: "Marsa Dubai", nameAr: "مرسى دبي" },
  { code: "393E", name: "Al Thanyah Fifth", nameAr: "الثنيه الخامسة" },
  { code: "393I", name: "Al Thanyah Fifth", nameAr: "الثنيه الخامسة" },
  { code: "393J", name: "Al Thanyah Fifth", nameAr: "الثنيه الخامسة" },
  { code: "393K", name: "Al Thanyah Fifth", nameAr: "الثنيه الخامسة" },
  { code: "393L", name: "Al Thanyah Fifth", nameAr: "الثنيه الخامسة" },
  { code: "393M", name: "Al Thanyah Fifth", nameAr: "الثنيه الخامسة" },
  { code: "412C", name: "Al Kheeran", nameAr: "الخيران" },
  { code: "416C", name: "Nadd Al Hamar", nameAr: "ند الحمر" },
  { code: "416D", name: "Nadd Al Hamar", nameAr: "ند الحمر" },
  { code: "416M", name: "Nadd Al Hamar", nameAr: "ند الحمر" },
  { code: "421C", name: "Al Warqa\'a First", nameAr: "الورقاء الأولى" },
  { code: "518C", name: "Jabal Ali Industrial Second", nameAr: "جبل علي الصناعية الثانية" },
  { code: "612C", name: "Ras Al Khor Ind. First", nameAr: "رأس الخور الصناعية الأولى" },
  { code: "613C", name: "Ras Al Khor Ind. Second", nameAr: "رأس الخور الصناعية الثانية" },
  { code: "614C", name: "Ras Al Khor Ind. Third", nameAr: "رأس الخور الصناعية الثالثة" },
  { code: "614M", name: "Ras Al Khor Ind. Third", nameAr: "رأس الخور الصناعية الثالثة" },
  { code: "614V", name: "Ras Al Khor Ind. Third", nameAr: "رأس الخور الصناعية الثالثة" },
  { code: "614VP", name: "Ras Al Khor Ind. Third", nameAr: "رأس الخور الصناعية الثالثة" },
  { code: "614W", name: "Ras Al Khor Ind. Third", nameAr: "رأس الخور الصناعية الثالثة" },
  { code: "621C", name: "Warsan First", nameAr: "ورسان الأولى" },
  { code: "621M", name: "Warsan First", nameAr: "ورسان الأولى" },
  { code: "621Q", name: "Warsan First", nameAr: "ورسان الأولى" },
  { code: "622M", name: "Warsan Second", nameAr: "ورسان الثانية" },
  { code: "626H", name: "Nadd Hessa", nameAr: "ند حصه" },
  { code: "631G", name: "Hadaeq Sheikh Mohammed Bin Rashid", nameAr: "حدائق الشيخ محمد بن راشد" },
  { code: "643B", name: "Wadi Al Safa 2", nameAr: "وادي الصفا 2" },
  { code: "643M", name: "Wadi Al Safa 2", nameAr: "وادي الصفا 2" },
  { code: "645B", name: "Wadi Al Safa 3", nameAr: "وادي الصفا 3" },
  { code: "645M", name: "Wadi Al Safa 3", nameAr: "وادي الصفا 3" },
  { code: "648B", name: "Wadi Al Safa 5", nameAr: "وادي الصفا 5" },
  { code: "672F", name: "Al Barsha South Second", nameAr: "البرشاء جنوب الثانية" },
  { code: "672M", name: "Al Barsha South Second", nameAr: "البرشاء جنوب الثانية" },
  { code: "673A", name: "Al Barsha South Third", nameAr: "البرشاء جنوب الثالثة" },
  { code: "673B", name: "Al Barsha South Third", nameAr: "البرشاء جنوب الثالثة" },
  { code: "673M", name: "Al Barsha South Third", nameAr: "البرشاء جنوب الثالثة" },
  { code: "675M", name: "Al Hebiah Second", nameAr: "الحبيه الثانية" },
  { code: "675T", name: "Al Hebiah Second", nameAr: "الحبيه الثانية" },
  { code: "676H", name: "Al Hebiah Third", nameAr: "الحبيه الثالثة" },
  { code: "676M", name: "Al Hebiah Third", nameAr: "الحبيه الثالثة" },
  { code: "682S", name: "Al Hebiah Fourth", nameAr: "الحبيه الرابعة" },
  { code: "684T", name: "Al Barsha South Fifth", nameAr: "البرشاء جنوب الخامسة" },
  { code: "685F", name: "Me\'aisem First", nameAr: "معيصم الأولى" },
  { code: "812F", name: "Al Rowaiyah First", nameAr: "الرويه الأولى" },
  { code: "812T", name: "Al Rowaiyah First", nameAr: "الرويه الأولى" },
  { code: "914M", name: "Madinat Hind 4", nameAr: "مدينة هند 4" },
];

/* ───── Translations ───── */
const t: Record<string, Record<string, string>> = {
  // Header nav
  home: { en: "Home", ar: "الرئيسية" },
  individuals: { en: "Individuals", ar: "الأفراد" },
  business: { en: "Business", ar: "الأعمال" },
  government: { en: "Government", ar: "الحكومة" },
  investors: { en: "Investors", ar: "المستثمرون" },
  more: { en: "More", ar: "المزيد" },

  // Slides
  slide1_title: { en: "Variable parking tariff", ar: "تعرفة مواقف متغيرة" },
  slide1_desc: { en: "On 4 April 2025, we'll roll out a new parking tariff to help you find parking faster, enjoy better access in busy areas, and pay less when demand is low.", ar: "في 4 أبريل 2025، سنطلق تعرفة مواقف جديدة لمساعدتك في إيجاد موقف أسرع، والاستمتاع بوصول أفضل في المناطق المزدحمة، ودفع أقل عندما يكون الطلب منخفضاً." },
  slide2_title: { en: "Your Gateway to Easy Parking Solutions!", ar: "بوابتك لحلول المواقف السهلة!" },
  slide2_desc: { en: "Enjoy the ease and flexibility of Parkin's top services. Explore hassle-free options designed to make your parking experience as smooth as possible.", ar: "استمتع بسهولة ومرونة خدمات باركن المميزة. اكتشف خيارات مصممة لجعل تجربة المواقف سلسة قدر الإمكان." },

  // Form
  pay_parking: { en: "Pay for Parking", ar: "ادفع للمواقف" },
  pay_later: { en: "Pay Later", ar: "ادفع لاحقاً" },
  pay_fines: { en: "Pay Fines", ar: "ادفع المخالفات" },
  parking_zone: { en: "Parking Zone", ar: "منطقة المواقف" },
  enter_zone: { en: "Enter Your Zone Code", ar: "أدخل رمز المنطقة" },
  duration: { en: "Duration", ar: "المدة" },
  select_duration: { en: "Select duration", ar: "اختر المدة" },
  now: { en: "Now", ar: "الآن" },
  continue_btn: { en: "Continue", ar: "متابعة" },
  total: { en: "Total:", ar: "الإجمالي:" },

  // Pay Later / Pay Fines form
  country_emirate: { en: "Country/Emirate", ar: "الدولة/الإمارة" },
  plate_category: { en: "Plate category", ar: "فئة اللوحة" },
  plate_code: { en: "Plate code", ar: "رمز اللوحة" },
  plate_number: { en: "Plate number", ar: "رقم اللوحة" },
  enter_plate_number: { en: "Enter plate number", ar: "أدخل رقم اللوحة" },
  select: { en: "Select", ar: "اختر" },
  search_btn: { en: "Search", ar: "بحث" },

  // 3 Info Cards
  card1_title: { en: "Variable parking tariff", ar: "تعرفة مواقف متغيرة" },
  card1_desc: { en: "Check parking rates based on zone codes and peak hours to take advantage of variable tariffs so you can plan smarter and save more.", ar: "تحقق من أسعار المواقف بناءً على رموز المناطق وساعات الذروة للاستفادة من التعرفة المتغيرة والتخطيط بذكاء والتوفير أكثر." },
  card2_title: { en: "Parking Zone Guide", ar: "دليل مناطق المواقف" },
  card2_desc: { en: "Discover zone-specific parking details, including fees and operational hours. Optimise your parking choices and stay informed to avoid fines.", ar: "اكتشف تفاصيل المواقف حسب المنطقة، بما في ذلك الرسوم وساعات العمل. حسّن خياراتك وابقَ على اطلاع لتجنب المخالفات." },
  card3_title: { en: "Parkin Machines", ar: "أجهزة باركن" },
  card3_desc: { en: "Explore available options and familiarise yourself with how to operate offline parking machines, including the payment processes.", ar: "استكشف الخيارات المتاحة وتعرف على كيفية تشغيل أجهزة المواقف، بما في ذلك عمليات الدفع." },
  learn_more: { en: "Learn More", ar: "اعرف المزيد" },

  // Discover
  discover_title: { en: "Discover the Key to Stress-Free Parking!", ar: "اكتشف مفتاح المواقف بدون توتر!" },
  seamless_title: { en: "Seamless Experience", ar: "تجربة سلسة" },
  seamless_desc: { en: "Enjoy hassle-free parking with Parkin's intuitive solutions.", ar: "استمتع بمواقف بدون عناء مع حلول باركن الذكية." },
  effortless_title: { en: "Effortless Transactions", ar: "معاملات سهلة" },
  effortless_desc: { en: "Easily manage all your parking needs, from booking to subscription, with Parkin user-friendly platform.", ar: "أدر جميع احتياجات المواقف بسهولة، من الحجز إلى الاشتراك، مع منصة باركن سهلة الاستخدام." },
  support_title: { en: "24/7 Customer Support", ar: "دعم العملاء 24/7" },
  support_desc: { en: "Get reliable assistance round the clock for all your parking needs.", ar: "احصل على مساعدة موثوقة على مدار الساعة لجميع احتياجات المواقف." },

  // New Feature
  new_feature: { en: "New Feature!", ar: "ميزة جديدة!" },
  new_feature_desc: { en: "Take control and manage your subscription with ease from your Parkin dashboard. Renew your card, Update your vehicle details, or modify your subscription terms with just a few clicks.", ar: "تحكم وأدر اشتراكك بسهولة من لوحة تحكم باركن. جدد بطاقتك، حدّث بيانات مركبتك، أو عدّل شروط اشتراكك بنقرات قليلة." },
  check_it_out: { en: "Check it Out", ar: "اكتشف الآن" },

  // 4 Service Cards
  pay_fines_title: { en: "Pay Parking Fines", ar: "ادفع مخالفات المواقف" },
  pay_fines_desc: { en: "Pay and manage your fines effortlessly with the Parkin platform for a smooth parking experience.", ar: "ادفع وأدر مخالفاتك بسهولة مع منصة باركن لتجربة مواقف سلسة." },
  pay_parking_title: { en: "Pay for Parking", ar: "ادفع للمواقف" },
  pay_parking_desc: { en: "Choose your parking type and zone to pay instantly or schedule it later with ease.", ar: "اختر نوع الموقف والمنطقة للدفع فوراً أو جدولته لاحقاً بسهولة." },
  subscribe_title: { en: "Subscribe to a Parking", ar: "اشترك في موقف" },
  subscribe_desc: { en: "Make parking easier with a subscription offering access to designated facilities when needed.", ar: "اجعل المواقف أسهل مع اشتراك يوفر الوصول للمرافق المخصصة عند الحاجة." },
  permit_title: { en: "Get a Permit", ar: "احصل على تصريح" },
  permit_desc: { en: "Access exclusive parking privileges with permits designed for convenience and comfort.", ar: "احصل على امتيازات مواقف حصرية مع تصاريح مصممة للراحة والملاءمة." },
  coming_soon: { en: "Coming Soon", ar: "قريباً" },

  // Personalised
  personal_title: { en: "Personalised Features for the Ultimate Parking Convenience", ar: "ميزات مخصصة لأقصى راحة في المواقف" },
  personal_desc: { en: "Seamlessly tailored to your needs, our innovative features redefine the parking experience, ensuring smooth transactions, streamlined management, and hassle-free payments.", ar: "مصممة بسلاسة حسب احتياجاتك، ميزاتنا المبتكرة تعيد تعريف تجربة المواقف، مع ضمان معاملات سلسة وإدارة مبسطة ومدفوعات بدون عناء." },
  notif_title: { en: "Personalised Notifications", ar: "إشعارات مخصصة" },
  notif_desc: { en: "Stay updated with real-time alerts tailored to your parking preferences and activities.", ar: "ابقَ على اطلاع بتنبيهات فورية مخصصة حسب تفضيلاتك وأنشطتك." },
  multi_title: { en: "Multi-Vehicle Management", ar: "إدارة عدة مركبات" },
  multi_desc: { en: "Easily manage parking for multiple vehicles from a single account with seamless switching.", ar: "أدر مواقف عدة مركبات من حساب واحد مع تبديل سلس." },
  contactless_title: { en: "Contactless Payments", ar: "الدفع بدون تلامس" },
  contactless_desc: { en: "Experience fast and secure contactless payment options for a hassle-free parking experience.", ar: "جرب خيارات الدفع بدون تلامس السريعة والآمنة لتجربة مواقف بدون عناء." },

  // Need Help
  need_help: { en: "Need Help?", ar: "تحتاج مساعدة؟" },
  need_help_desc: { en: "We're here for you! If you have any questions or need assistance, don't hesitate to reach out. Contact our support team for quick and friendly help.", ar: "نحن هنا من أجلك! إذا كان لديك أي أسئلة أو تحتاج مساعدة، لا تتردد في التواصل معنا. تواصل مع فريق الدعم للحصول على مساعدة سريعة وودية." },
  contact_us: { en: "Contact Us", ar: "تواصل معنا" },

  // Submenu items & descriptions
  seasonal_parking: { en: "Seasonal Parking", ar: "المواقف الموسمية" },
  seasonal_parking_d: { en: "Secure your parking spot for the season with flexible plans tailored to your needs.", ar: "احجز موقفك للموسم مع خطط مرنة مصممة حسب احتياجاتك." },
  multi_storey: { en: "Multi-storey Parking", ar: "مواقف متعددة الطوابق" },
  multi_storey_d: { en: "Access convenient multi-storey parking facilities across key locations.", ar: "استخدم مرافق المواقف متعددة الطوابق في المواقع الرئيسية." },
  valet_parking: { en: "Valet Parking", ar: "خدمة صف السيارات" },
  valet_parking_d: { en: "Enjoy premium valet parking services for a hassle-free experience.", ar: "استمتع بخدمة صف السيارات المميزة لتجربة بدون عناء." },
  fleet_mgmt: { en: "Fleet Management", ar: "إدارة الأسطول" },
  fleet_mgmt_d: { en: "Manage your fleet parking needs efficiently with our comprehensive solutions.", ar: "أدر احتياجات مواقف أسطولك بكفاءة مع حلولنا الشاملة." },
  business_solutions: { en: "Business Solutions", ar: "حلول الأعمال" },
  business_solutions_d: { en: "Tailored parking solutions designed to meet your business requirements.", ar: "حلول مواقف مصممة لتلبية متطلبات أعمالك." },
  corporate_parking: { en: "Corporate Parking", ar: "مواقف الشركات" },
  corporate_parking_d: { en: "Dedicated corporate parking programs for your organization.", ar: "برامج مواقف مخصصة لمؤسستك." },
  govt_services: { en: "Government Services", ar: "الخدمات الحكومية" },
  govt_services_d: { en: "Parking services and solutions for government entities.", ar: "خدمات وحلول المواقف للجهات الحكومية." },
  public_parking: { en: "Public Parking", ar: "المواقف العامة" },
  public_parking_d: { en: "Manage and access public parking zones across the city.", ar: "أدر واستخدم مناطق المواقف العامة في أنحاء المدينة." },
  // Submenu descriptions for individuals
  pay_parking_sub_d: { en: "Pay for parking only when your business needs it with this fast, easy, and commitment-free option.", ar: "ادفع للمواقف فقط عند الحاجة مع هذا الخيار السريع والسهل." },
  subscribe_sub_d: { en: "Simplify parking with a subscription that saves costs and ensures a smooth experience for your team, customers, and guests.", ar: "بسّط المواقف مع اشتراك يوفر التكاليف ويضمن تجربة سلسة." },
  pay_fines_sub_d: { en: "Resolve your corporate parking fines swiftly with our simple, convenient payment process.", ar: "سدد مخالفات المواقف بسرعة مع عملية الدفع البسيطة والمريحة." },
  pay_later_sub_d: { en: "Park now and pay later with flexible payment options for your convenience.", ar: "اركن الآن وادفع لاحقاً مع خيارات دفع مرنة لراحتك." },
  get_permit_sub_d: { en: "Claim your FREE parking permit, exclusively for residents in high-density areas and priority groups.", ar: "احصل على تصريح مواقف مجاني، حصرياً لسكان المناطق ذات الكثافة العالية." },
  reserve_sub_d: { en: "Enjoy exclusive reserved parking and a seamless experience for your team, customers, and guests, with added savings on longer plans.", ar: "استمتع بمواقف محجوزة حصرية وتجربة سلسة مع توفير إضافي على الخطط الطويلة." },

  // Footer
  easy_parking: { en: "Easy Parking Effortless Living", ar: "مواقف سهلة حياة مريحة" },
  get_app: { en: "Get the App", ar: "حمّل التطبيق" },
  subscribe: { en: "Subscribe", ar: "اشترك" },
  pay_for_parking_f: { en: "Pay For Parking", ar: "ادفع للمواقف" },
  pay_fines_f: { en: "Pay Fines", ar: "ادفع المخالفات" },
  pay_later_f: { en: "Pay Later", ar: "ادفع لاحقاً" },
  get_permit_f: { en: "Get a Permit", ar: "احصل على تصريح" },
  company_overview: { en: "Company Overview", ar: "نبذة عن الشركة" },
  share_price: { en: "Share price information", ar: "معلومات سعر السهم" },
  dfm: { en: "DFM Announcements", ar: "إعلانات سوق دبي المالي" },
  results_reports: { en: "Results, Reports, and Presentations", ar: "النتائج والتقارير والعروض" },
  governance: { en: "Corporate Governance", ar: "الحوكمة المؤسسية" },
  sustainability: { en: "Sustainability", ar: "الاستدامة" },
  ipo: { en: "Initial Public Offering (IPO)", ar: "الطرح العام الأولي" },
  media: { en: "IR / Media Enquiries", ar: "استفسارات الإعلام" },
  about: { en: "About Parkin", ar: "عن باركن" },
  faqs: { en: "Parkin FAQs", ar: "الأسئلة الشائعة" },
  blog: { en: "Blog", ar: "المدونة" },
  partners: { en: "Partners", ar: "الشركاء" },
  newsroom: { en: "News Room", ar: "غرفة الأخبار" },
  careers: { en: "Careers", ar: "الوظائف" },
  privacy: { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  terms: { en: "Terms and conditions", ar: "الشروط والأحكام" },
  rights: { en: "Parkin All rights reserved.", ar: "باركن جميع الحقوق محفوظة." },
};

/* ───── Logo Component ───── */
function ParkinLogo({ white = false, size = 'h-[50px]' }: { white?: boolean; size?: string }) {
  return (
    <img src="/images/parkin-logo.png" alt="Parkin" className={`${size} w-auto`} style={white ? {filter:'brightness(0) invert(1)'} : {}}/>
  );
}

export default function ParkinHome() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"pay"|"later"|"fines">("pay");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lang, setLang] = useState<"en"|"ar">("en");
  const [openMenu, setOpenMenu] = useState<string|null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [zoneQuery, setZoneQuery] = useState("");
  const [showZoneSuggestions, setShowZoneSuggestions] = useState(false);
  const [selectedZone, setSelectedZone] = useState<typeof parkingZones[0]|null>(null);
  const [durationOptions, setDurationOptions] = useState<{label:string; value:string; amount:string}[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<{label:string; value:string; amount:string}|null>(null);
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [isLoadingTariff, setIsLoadingTariff] = useState(false);
  // Pay Later / Pay Fines state
  const [selectedCountry, setSelectedCountry] = useState(plateStructure[0]); // Dubai default
  const [selectedCategory, setSelectedCategory] = useState<typeof plateStructure[0]['categories'][0]|null>(plateStructure[0].categories[0]); // Private default
  const [selectedCode, setSelectedCode] = useState<{pid:string;name:string}|null>(null);
  const [plateNumber, setPlateNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const codeDropdownRef = useRef<HTMLDivElement>(null);
  const zoneInputRef = useRef<HTMLInputElement>(null);
  const zoneDropdownRef = useRef<HTMLDivElement>(null);
  const durationDropdownRef = useRef<HTMLDivElement>(null);

  const L = (key: string) => t[key]?.[lang] || t[key]?.en || key;
  const isAr = lang === "ar";

  const filteredZones = zoneQuery.length > 0
    ? parkingZones.filter(z =>
        z.code.toLowerCase().includes(zoneQuery.toLowerCase()) ||
        z.name.toLowerCase().includes(zoneQuery.toLowerCase()) ||
        z.nameAr.includes(zoneQuery)
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (zoneDropdownRef.current && !zoneDropdownRef.current.contains(e.target as Node) &&
          zoneInputRef.current && !zoneInputRef.current.contains(e.target as Node)) {
        setShowZoneSuggestions(false);
      }
      if (durationDropdownRef.current && !durationDropdownRef.current.contains(e.target as Node)) {
        setIsDurationOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setIsCountryOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (codeDropdownRef.current && !codeDropdownRef.current.contains(e.target as Node)) {
        setIsCodeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch tariff when a zone is selected
  useEffect(() => {
    if (!selectedZone) {
      setDurationOptions([]);
      setSelectedDuration(null);
      return;
    }
    const fetchTariff = async () => {
      setIsLoadingTariff(true);
      setDurationOptions([]);
      setSelectedDuration(null);
      try {
        const resp = await fetch('https://api.parkin.ae/api/fees/get-dynamic-parking-zone-tariff-v2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer m3EGd2NT8ypR4e9MjYBvKwJhLCgnqUZ5sbXrcHaDQSkPAfzx6F',
            'language': lang,
          },
          body: JSON.stringify({
            plate_no: '',
            plate_source_id: '',
            plate_type_id: '',
            plate_color_d: '',
            duration_in_minutes: '',
            zone_no: selectedZone.code,
            booking_type: '0',
            schedule_date_time: '',
          }),
        });
        const data = await resp.json();
        if (data.statusCode === 10000 && data.data?.tariff) {
          const options = data.data.tariff.map((t: any) => {
            const mins = parseInt(t.duration_in_minutes);
            const hours = mins / 60;
            let label = '';
            if (mins < 60) {
              label = lang === 'ar' ? `${mins} دقيقة` : `${mins} Min`;
            } else {
              const h = Math.round(hours);
              if (lang === 'ar') {
                label = h === 1 ? `${h} ساعة` : `${h} ساعات`;
              } else {
                label = h === 1 ? `${h} Hour` : `${h} Hours`;
              }
            }
            return {
              label,
              value: t.duration_in_minutes,
              amount: t.amount,
            };
          });
          setDurationOptions(options);
        }
      } catch (err) {
        console.error('Failed to fetch tariff:', err);
      } finally {
        setIsLoadingTariff(false);
      }
    };
    fetchTariff();
  }, [selectedZone, lang]);

  const slides = [
    { title: L("slide1_title"), desc: L("slide1_desc"), italic:true, bg:"/images/banner1_variable_tariff.jpg" },
    { title: L("slide2_title"), desc: L("slide2_desc"), italic:false, bg:"/images/banner2_gateway.jpg" },
  ];

  const navMenus: { key: string; label: string; subs: { label: string; desc: string }[] }[] = [
    { key: "home", label: L("home"), subs: [] },
    { key: "individuals", label: L("individuals"), subs: [
      { label: L("pay_for_parking_f"), desc: L("pay_parking_sub_d") },
      { label: L("subscribe"), desc: L("subscribe_sub_d") },
      { label: L("pay_fines_f"), desc: L("pay_fines_sub_d") },
      { label: L("pay_later_f"), desc: L("pay_later_sub_d") },
      { label: L("get_permit_f"), desc: L("get_permit_sub_d") },
      { label: L("seasonal_parking"), desc: L("seasonal_parking_d") },
      { label: L("multi_storey"), desc: L("multi_storey_d") },
      { label: L("valet_parking"), desc: L("valet_parking_d") },
    ]},
    { key: "business", label: L("business"), subs: [
      { label: L("pay_for_parking_f"), desc: L("pay_parking_sub_d") },
      { label: L("subscribe"), desc: L("subscribe_sub_d") },
      { label: "Reserve", desc: L("reserve_sub_d") },
      { label: L("pay_fines_f"), desc: L("pay_fines_sub_d") },
      { label: L("get_permit_f"), desc: L("get_permit_sub_d") },
    ]},
    { key: "government", label: L("government"), subs: [
      { label: L("govt_services"), desc: L("govt_services_d") },
      { label: L("public_parking"), desc: L("public_parking_d") },
      { label: L("fleet_mgmt"), desc: L("fleet_mgmt_d") },
      { label: L("corporate_parking"), desc: L("corporate_parking_d") },
    ]},
    { key: "investors", label: L("investors"), subs: [
      { label: L("company_overview"), desc: "" },
      { label: L("share_price"), desc: "" },
      { label: L("dfm"), desc: "" },
      { label: L("results_reports"), desc: "" },
      { label: L("governance"), desc: "" },
      { label: L("sustainability"), desc: "" },
      { label: L("ipo"), desc: "" },
      { label: L("media"), desc: "" },
    ]},
    { key: "more", label: L("more"), subs: [
      { label: L("about"), desc: "" },
      { label: L("contact_us"), desc: "" },
      { label: L("faqs"), desc: "" },
      { label: L("blog"), desc: "" },
      { label: L("partners"), desc: "" },
      { label: L("newsroom"), desc: "" },
      { label: L("careers"), desc: "" },
    ]},
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => setCurrentSlide(p => (p+1)%slides.length), 5000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  return (
    <div className="min-h-screen bg-white" style={{fontFamily:"'Inter','Segoe UI',sans-serif"}} dir={isAr ? "rtl" : "ltr"}>

      {/* ═══════ HEADER ═══════ */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex flex-nowrap items-center h-[60px] md:h-[72px]">
          <a href="/" className="flex-shrink-0 mr-4 md:mr-8"><ParkinLogo /></a>
          <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center whitespace-nowrap">
            {navMenus.map((menu,i)=>(
              <div key={menu.key} className="relative" onMouseEnter={()=>menu.subs.length>0&&setOpenMenu(menu.key)} onMouseLeave={()=>setOpenMenu(null)}>
                <a href="#" className={`text-[15px] font-medium ${i===0?"text-[#045464] border-b-2 border-[#045464]":"text-gray-700 hover:text-[#045464] border-b-2 border-transparent"} transition-colors py-6 inline-block whitespace-nowrap`}>{menu.label}</a>
              </div>
            ))}
          </nav>
          <div className="flex items-center gap-3 ml-auto">
            <button onClick={()=>setLang(lang==="en"?"ar":"en")} className="text-[#045464] text-[14px] md:text-[15px] font-medium hover:underline transition whitespace-nowrap">{lang==="en"?"العربية":"English"}</button>
            {/* Mobile hamburger menu */}
            <button onClick={()=>setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden flex flex-col gap-1.5 p-2">
              <span className={`block w-6 h-0.5 bg-[#045464] transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}/>
              <span className={`block w-6 h-0.5 bg-[#045464] transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}/>
              <span className={`block w-6 h-0.5 bg-[#045464] transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}/>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg max-h-[70vh] overflow-y-auto">
            <div className="px-4 py-3">
              {navMenus.map((menu)=>(
                <a key={menu.key} href="#" className="block py-3 text-[15px] font-medium text-gray-700 border-b border-gray-100 last:border-b-0">{menu.label}</a>
              ))}
            </div>
          </div>
        )}
        {/* ═══ MEGA MENU DROPDOWN ═══ */}
        {openMenu && navMenus.find(m=>m.key===openMenu)?.subs.length! > 0 && (
          <div className="absolute left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-40" onMouseEnter={()=>setOpenMenu(openMenu)} onMouseLeave={()=>setOpenMenu(null)}>
            <div className="max-w-[1400px] mx-auto px-6 py-10">
              {(() => {
                const menu = navMenus.find(m=>m.key===openMenu)!;
                const hasDes = menu.subs.some(s=>s.desc);
                if (hasDes) {
                  return (
                    <div className="grid grid-cols-2 gap-x-16 gap-y-10">
                      {menu.subs.map((sub,idx)=>(
                        <div key={idx}>
                          <a href="#" className="text-[#045464] font-semibold text-[16px] underline underline-offset-4 hover:opacity-80 transition">{sub.label}</a>
                          {sub.desc && <p className="text-gray-600 text-[14px] mt-2 leading-relaxed">{sub.desc}</p>}
                        </div>
                      ))}
                    </div>
                  );
                } else {
                  return (
                    <div className="grid grid-cols-2 gap-x-16 gap-y-4">
                      {menu.subs.map((sub,idx)=>(
                        <a key={idx} href="#" className="text-[#045464] font-semibold text-[16px] underline underline-offset-4 hover:opacity-80 transition py-1">{sub.label}</a>
                      ))}
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        )}
      </header>

      {/* ═══════ HERO SLIDER ═══════ */}
      <section className="relative w-full bg-[#045464] min-h-[500px] md:min-h-[700px]" style={{height:'auto'}}>
        {slides.map((s,i)=>(
          <div key={i} className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ${i===currentSlide?"opacity-100 z-10":"opacity-0 z-0"}`}>
            {/* Image slightly smaller - leaves teal visible on right and bottom */}
            <div className="absolute top-0 left-0" style={{width:'calc(100% - 10px)', height:'calc(100% - 20px)'}}>
              <img src={s.bg} alt="" className="w-full h-full object-cover" style={{ imageRendering: 'auto', WebkitBackfaceVisibility: 'hidden' }} loading="eager"/>
              <div className={`absolute inset-0 bg-gradient-to-${isAr?'l':'r'} from-white/90 via-white/60 to-transparent md:from-white/80 md:via-white/40`}/>
              {/* Car image - original from parkin.ae - hidden on mobile */}
              <img src="/car.webp" alt="" className="absolute bottom-[-5px] right-[25px] hidden md:block" style={{width:'160px', height:'auto', zIndex:5, opacity:0.85}} />
            </div>
            <div className={`relative z-20 max-w-[1400px] mx-auto px-4 md:px-6 pt-6 md:pt-16`}>
              <h1 className={`text-[#045464] max-w-[600px] leading-[1.15] text-[24px] md:text-[46px] ${s.italic?"italic font-semibold":"font-bold"}`}>{s.title}</h1>
              <p className="text-gray-700 text-[13px] md:text-[15px] max-w-[550px] mt-3 md:mt-5 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}

        {/* Spacer for mobile to push form down */}
        <div className="relative z-0 h-[100px] md:h-[350px]"></div>

        {/* Form */}
        <div className="relative z-30 w-full px-4 md:px-0 pb-8 md:pb-0 md:absolute md:bottom-[60px] md:w-[580px]" style={{left: typeof window !== 'undefined' && window.innerWidth >= 768 ? (isAr ? 'auto' : 'calc((100% - 1400px)/2 + 80px)') : 'auto', right: typeof window !== 'undefined' && window.innerWidth >= 768 ? (isAr ? 'calc((100% - 1400px)/2 + 80px)' : 'auto') : 'auto'}}>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-visible">
            <div className="flex bg-[#045464] rounded-t-2xl p-1.5 gap-1">
              {([['pay',L('pay_parking')],['later',L('pay_later')],['fines',L('pay_fines')]] as const).map(([id,label])=>(
                <button key={id} onClick={()=>setActiveTab(id as any)} className={`flex-1 py-3 text-[14px] font-semibold transition-all rounded-full ${activeTab===id?"bg-white text-[#045464] border-2 border-[#045464]":"text-white"}`}>{label}</button>
              ))}
            </div>
            <div className="p-6">
              {activeTab === 'pay' ? (
                /* ══════ PAY FOR PARKING FORM ══════ */
                <>
                  <div className="border border-gray-200 rounded-xl p-3 mb-4 relative">
                    <label className="text-[12px] text-gray-500 block mb-1">{L("parking_zone")}</label>
                    <div className="flex items-center justify-between">
                      <input
                        ref={zoneInputRef}
                        type="text"
                        placeholder={L("enter_zone")}
                        value={zoneQuery}
                        onChange={(e) => {
                          setZoneQuery(e.target.value);
                          setShowZoneSuggestions(true);
                          setSelectedZone(null);
                        }}
                        onFocus={() => { if (zoneQuery.length > 0) setShowZoneSuggestions(true); }}
                        className="bg-transparent text-[14px] text-gray-700 outline-none flex-1"
                      />
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400 flex-shrink-0"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M10 2V4M10 16V18M2 10H4M16 10H18" stroke="currentColor" strokeWidth="1.5"/></svg>
                    </div>
                    {showZoneSuggestions && filteredZones.length > 0 && (
                      <div ref={zoneDropdownRef} className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-[400px] overflow-y-auto">
                        {filteredZones.map((zone) => (
                          <button
                            key={zone.code}
                            onClick={() => {
                              setZoneQuery(zone.code);
                              setSelectedZone(zone);
                              setShowZoneSuggestions(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                          >
                            <div>
                              <span className="text-[#045464] font-semibold text-[14px]">{zone.code}</span>
                              <span className="text-gray-500 text-[13px] mx-2">-</span>
                              <span className="text-gray-700 text-[13px]">{isAr ? zone.nameAr : zone.name}</span>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-300 flex-shrink-0"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" fill="none"/><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-4 md:items-center">
                    <div className="border border-gray-200 rounded-xl p-3 flex-1 relative">
                      <label className="text-[12px] text-gray-500 block mb-1">{L("duration")}</label>
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => { if (durationOptions.length > 0) setIsDurationOpen(!isDurationOpen); }}
                      >
                        <span className={`text-[14px] ${selectedDuration ? 'text-gray-700' : 'text-gray-400'}`}>
                          {isLoadingTariff ? (lang === 'ar' ? '\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u062d\u0645\u064a\u0644...' : 'Loading...') : selectedDuration ? `${selectedDuration.label} - AED ${selectedDuration.amount}` : L("select_duration")}
                        </span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`text-gray-400 transition-transform ${isDurationOpen ? 'rotate-180' : ''}`}><path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5"/></svg>
                      </div>
                      {isDurationOpen && durationOptions.length > 0 && (
                        <div ref={durationDropdownRef} className="absolute left-0 right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-[400px] overflow-y-auto">
                          {durationOptions.map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setSelectedDuration(opt);
                                setIsDurationOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between ${selectedDuration?.value === opt.value ? 'bg-[#f0f9f9]' : ''}`}
                            >
                              <span className="text-gray-700 text-[14px]">{opt.label}</span>
                              <span className="text-[#045464] font-semibold text-[14px]">AED {opt.amount}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button className="border border-[#045464] rounded-full px-4 flex items-center gap-2 text-[#045464] text-[13px] font-medium" style={{height:'36px'}}>
                      <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="#045464" strokeWidth="1.5" fill="none"/><path d="M9 5V9L12 11" stroke="#045464" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      {L("now")}
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 4L5 6.5L7.5 4" stroke="#045464" strokeWidth="1.5"/></svg>
                    </button>
                  </div>
                  <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-3 md:gap-0">
                    <button onClick={()=>{ if(selectedZone && selectedDuration) { sessionStorage.removeItem('pfp_step'); sessionStorage.removeItem('pfp_country'); sessionStorage.removeItem('pfp_category'); sessionStorage.removeItem('pfp_code'); sessionStorage.removeItem('pfp_plateNumber'); const params = new URLSearchParams({ zone: selectedZone.code, duration: selectedDuration.label, total: parseFloat(selectedDuration.amount).toFixed(2), minutes: selectedDuration.value }); navigate(`/pay-for-parking?${params.toString()}`); } }} className="bg-[#045464] text-white px-8 py-3 rounded-full text-[14px] font-semibold hover:bg-[#004a4f] transition-colors w-full md:w-auto">{L("continue_btn")}</button>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-[15px]">{L("total")}</span>
                      <span className="text-[#045464] text-[24px] md:text-[28px] font-bold"><span className="text-[16px] md:text-[18px]">Ð</span> {selectedDuration ? parseFloat(selectedDuration.amount).toFixed(2) : '0.00'}</span>
                    </div>
                  </div>
                </>
              ) : (
                /* ══════ PAY LATER / PAY FINES FORM ══════ */
                <>
                  <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-4">
                    {/* Country/Emirate dropdown */}
                    <div className="border border-gray-200 rounded-xl p-3 flex-1 relative" ref={countryDropdownRef}>
                      <label className="text-[12px] text-gray-500 block mb-1">{L("country_emirate")}</label>
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => { setIsCountryOpen(!isCountryOpen); setIsCategoryOpen(false); setIsCodeOpen(false); }}>
                        <span className="text-[14px] text-[#045464] font-medium">{selectedCountry.name}</span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`text-gray-400 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`}><path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5"/></svg>
                      </div>
                      {isCountryOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-[250px] overflow-y-auto">
                          {plateStructure.map((c) => (
                            <button key={c.pid} onClick={() => { setSelectedCountry(c); setSelectedCategory(c.categories[0]); setSelectedCode(null); setIsCountryOpen(false); }} className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-[14px] ${selectedCountry.pid === c.pid ? 'bg-[#f0f9f9] text-[#045464] font-medium' : 'text-gray-700'}`}>{c.name}</button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Plate Category dropdown */}
                    <div className="border border-gray-200 rounded-xl p-3 flex-1 relative" ref={categoryDropdownRef}>
                      <label className="text-[12px] text-gray-500 block mb-1">{L("plate_category")}</label>
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsCountryOpen(false); setIsCodeOpen(false); }}>
                        <span className="text-[14px] text-[#045464] font-medium">{selectedCategory?.name || L("select")}</span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`text-gray-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}><path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5"/></svg>
                      </div>
                      {isCategoryOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-[250px] overflow-y-auto">
                          {selectedCountry.categories.map((cat) => (
                            <button key={cat.pid} onClick={() => { setSelectedCategory(cat); setSelectedCode(null); setIsCategoryOpen(false); }} className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-[14px] ${selectedCategory?.pid === cat.pid ? 'bg-[#f0f9f9] text-[#045464] font-medium' : 'text-gray-700'}`}>{cat.name}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-4">
                    {/* Plate Code dropdown */}
                    <div className="border border-gray-200 rounded-xl p-3 flex-1 relative" ref={codeDropdownRef}>
                      <label className="text-[12px] text-gray-500 block mb-1">{L("plate_code")}</label>
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => { setIsCodeOpen(!isCodeOpen); setIsCountryOpen(false); setIsCategoryOpen(false); }}>
                        <span className={`text-[14px] ${selectedCode ? 'text-[#045464] font-medium' : 'text-gray-400'}`}>{selectedCode?.name || L("select")}</span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`text-gray-400 transition-transform ${isCodeOpen ? 'rotate-180' : ''}`}><path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5"/></svg>
                      </div>
                      {isCodeOpen && selectedCategory && (
                        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-[250px] overflow-y-auto">
                          {selectedCategory.codes.map((code) => (
                            <button key={code.pid} onClick={() => { setSelectedCode(code); setIsCodeOpen(false); }} className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-[14px] ${selectedCode?.pid === code.pid ? 'bg-[#f0f9f9] text-[#045464] font-medium' : 'text-gray-700'}`}>{code.name}</button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Plate Number input */}
                    <div className="border border-gray-200 rounded-xl p-3 flex-1">
                      <label className="text-[12px] text-gray-500 block mb-1">{L("plate_number")}</label>
                      <input
                        type="text"
                        placeholder={L("enter_plate_number")}
                        value={plateNumber}
                        onChange={(e) => setPlateNumber(e.target.value)}
                        className="bg-transparent text-[14px] text-gray-700 outline-none w-full"
                      />
                    </div>
                  </div>
                    <button 
                      onClick={() => {
                        // Save plate info to sessionStorage for pay-for-parking page
                        sessionStorage.setItem('pfp_country', selectedCountry.name);
                        sessionStorage.setItem('pfp_category', selectedCategory?.name || '');
                        sessionStorage.setItem('pfp_code', selectedCode ? JSON.stringify(selectedCode) : '');
                        sessionStorage.setItem('pfp_plateNumber', plateNumber);
                        sessionStorage.removeItem('pfp_step');
                        // Navigate to pay-for-parking with default params
                        const params = new URLSearchParams({ zone: '111A', duration: '1 Hour', total: '4.00', minutes: '60' });
                        navigate(`/pay-for-parking?${params.toString()}`);
                      }} 
                      className="bg-[#045464] text-white px-8 py-3 rounded-full text-[14px] font-semibold hover:bg-[#004a4f] transition-colors w-full md:w-auto"
                    >
                      {L("search_btn")}
                    </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Slider controls */}
        <div className="relative md:absolute z-30 md:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 py-3 md:py-0">
          <button onClick={()=>setCurrentSlide(p=>(p-1+slides.length)%slides.length)} className="text-gray-500 hover:text-[#045464]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round"/></svg></button>
          <button onClick={()=>setIsPaused(!isPaused)} className="text-gray-500 hover:text-[#045464]">
            {isPaused?<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>:<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>}
          </button>
          {slides.map((_,i)=><button key={i} onClick={()=>setCurrentSlide(i)} className={`w-3 h-3 rounded-full transition-all ${i===currentSlide?"bg-[#045464] w-6":"bg-gray-300"}`}/>)}
          <button onClick={()=>setCurrentSlide(p=>(p+1)%slides.length)} className="text-gray-500 hover:text-[#045464]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round"/></svg></button>
        </div>
      </section>

      {/* ═══════ 3 INFO CARDS WITH IMAGES ═══════ */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {img:"/images/Variableparkingtariff.png",title:L("card1_title"),desc:L("card1_desc")},
            {img:"/images/ParkingZoneGuide.png",title:L("card2_title"),desc:L("card2_desc")},
            {img:"/images/ParkinMachines.png",title:L("card3_title"),desc:L("card3_desc")},
          ].map((c,i)=>(
            <a key={i} href="#" className="group block">
              <div className="overflow-hidden rounded-2xl mb-5">
                <img src={c.img} alt={c.title} className="w-full h-[250px] md:h-[420px] object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"/>
              </div>
              <h3 className="text-[#045464] text-[20px] font-bold mb-3">{c.title}</h3>
              <p className="text-gray-500 text-[14px] leading-relaxed mb-4">{c.desc}</p>
              <span className="inline-block border border-[#045464] text-[#045464] px-6 py-2 rounded-full text-[13px] font-medium hover:bg-[#045464] hover:text-white transition-colors">{L("learn_more")}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ═══════ DISCOVER STRESS-FREE ═══════ */}
      <section className="bg-[#F0FAF9] py-10 md:py-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <h2 className="text-[#045464] text-[24px] md:text-[34px] font-bold text-center mb-10 md:mb-16">{L("discover_title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {icon:"/images/SeamlessExperience.png",title:L("seamless_title"),desc:L("seamless_desc")},
              {icon:"/images/EffortlessTransactions.png",title:L("effortless_title"),desc:L("effortless_desc")},
              {icon:"/images/24_7CustomerSupport.png",title:L("support_title"),desc:L("support_desc")},
            ].map((f,i)=>(
              <div key={i}>
                <div className="w-[56px] h-[56px] bg-[#E0F5F3] rounded-xl flex items-center justify-center mb-5">
                  <img src={f.icon} alt="" className="w-7 h-7" style={{ imageRendering: 'crisp-edges' }}/>
                </div>
                <h3 className="text-[#045464] text-[20px] font-bold mb-3">{f.title}</h3>
                <p className="text-gray-500 text-[14px] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ NEW FEATURE BANNER ═══════ */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-10">
        <div className="relative overflow-hidden rounded-2xl" style={{minHeight:'280px'}}>
          <img src="/images/NewFeature.webp" alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy"/>
          <div className={`absolute inset-0 bg-gradient-to-${isAr?'l':'r'} from-black/70 via-black/50 to-transparent md:from-black/60 md:via-black/40`}/>
          <div className="relative z-10 px-6 md:px-10 py-10 md:py-16 flex items-center h-full" style={{minHeight:'280px'}}>
            <div>
              <h2 className="text-white text-[24px] md:text-[34px] font-bold mb-4">{L("new_feature")}</h2>
              <p className="text-gray-200 text-[15px] mb-8 max-w-[450px] leading-relaxed">{L("new_feature_desc")}</p>
              <a href="#" className="inline-block border border-white text-white px-8 py-3 rounded-full text-[14px] font-medium hover:bg-white hover:text-[#1a1a2e] transition-colors">{L("check_it_out")}</a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 4 SERVICE CARDS ═══════ */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {[
            {img:"/images/Parkinfines.jpeg",title:L("pay_fines_title"),desc:L("pay_fines_desc"),btn:L("learn_more")},
            {img:"/images/Image(5).png",title:L("pay_parking_title"),desc:L("pay_parking_desc"),btn:L("learn_more")},
            {img:"/images/Image.png",title:L("subscribe_title"),desc:L("subscribe_desc"),btn:L("learn_more")},
            {img:"/images/Image(4).png",title:L("permit_title"),desc:L("permit_desc"),btn:L("coming_soon")},
          ].map((c,i)=>(
            <a key={i} href="#" className="group block overflow-hidden rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="overflow-hidden">
                <img src={c.img} alt={c.title} className="w-full h-[200px] md:h-[280px] object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"/>
              </div>
              <div className="p-6">
                <h3 className="text-[#045464] text-[22px] font-bold mb-2">{c.title}</h3>
                <p className="text-gray-500 text-[14px] leading-relaxed mb-4">{c.desc}</p>
                <span className="inline-block border border-[#045464] text-[#045464] px-6 py-2 rounded-full text-[13px] font-medium hover:bg-[#045464] hover:text-white transition-colors">{c.btn}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ═══════ PERSONALISED FEATURES ═══════ */}
      <section className="bg-[#F0FAF9] py-10 md:py-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <h2 className="text-[#045464] text-[24px] md:text-[34px] font-bold text-center mb-4">{L("personal_title")}</h2>
          <p className="text-gray-500 text-[14px] md:text-[16px] text-center max-w-[700px] mx-auto mb-10 md:mb-16 leading-relaxed">{L("personal_desc")}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {img:"/images/Image(1).png",title:L("notif_title"),desc:L("notif_desc")},
              {img:"/images/Image(2).png",title:L("multi_title"),desc:L("multi_desc")},
              {img:"/images/Image(3).png",title:L("contactless_title"),desc:L("contactless_desc")},
            ].map((c,i)=>(
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-hidden">
                  <img src={c.img} alt={c.title} className="w-full h-[200px] md:h-[300px] object-cover" loading="lazy"/>
                </div>
                <div className="p-6">
                  <h3 className="text-[#045464] text-[18px] font-bold mb-2">{c.title}</h3>
                  <p className="text-gray-500 text-[14px] leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ NEED HELP ═══════ */}
      <section className="bg-[#F0FAF9] py-10 md:py-20 text-center">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <h2 className="text-[#045464] text-[24px] md:text-[34px] font-bold mb-4">{L("need_help")}</h2>
          <p className="text-gray-500 text-[16px] max-w-[700px] mx-auto mb-8">{L("need_help_desc")}</p>
          <a href="#" className="inline-block bg-[#045464] text-white px-8 py-3 rounded-full text-[14px] font-medium hover:bg-[#004048] transition-colors">{L("contact_us")}</a>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="relative">
        <div className="bg-[#f5f7f8] pt-10 md:pt-16 pb-8 md:pb-12">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
              <div>
                <ParkinLogo size="h-[120px]" />
                <p className="text-gray-600 text-[14px] mt-4 mb-6">{L("easy_parking")}</p>
                <p className="text-gray-700 font-semibold text-[14px] mb-3">{L("get_app")}</p>
                <div className="flex gap-3">
                  <img src="/images/Appstore.svg" alt="App Store" className="h-[40px] cursor-pointer"/>
                  <img src="/images/Googleplay.svg" alt="Google Play" className="h-[40px] cursor-pointer"/>
                </div>
              </div>
              <div>
                <h4 className="text-[#045464] font-bold text-[16px] mb-4">{L("individuals")}</h4>
                <ul className="space-y-3">
                  {[L("subscribe"),L("pay_for_parking_f"),L("pay_fines_f"),L("pay_later_f"),L("get_permit_f")].map(item=><li key={item}><a href="#" className="text-gray-600 text-[14px] hover:text-[#045464] transition-colors">{item}</a></li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-[#045464] font-bold text-[16px] mb-4">{L("investors")}</h4>
                <ul className="space-y-3">
                  {[L("company_overview"),L("share_price"),L("dfm"),L("results_reports"),L("governance"),L("sustainability"),L("ipo"),L("media")].map(item=><li key={item}><a href="#" className="text-gray-600 text-[14px] hover:text-[#045464] transition-colors">{item}</a></li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-[#045464] font-bold text-[16px] mb-4">{L("more")}</h4>
                <ul className="space-y-3">
                  {[L("about"),L("contact_us"),L("faqs"),L("blog"),L("partners"),L("newsroom"),L("careers"),L("privacy"),L("terms")].map(item=><li key={item}><a href="#" className="text-gray-600 text-[14px] hover:text-[#045464] transition-colors">{item}</a></li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#045464] py-4 px-4 md:px-6">
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-white text-[13px]">© {new Date().getFullYear()} {L("rights")}</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-white hover:text-[#3ECDC6]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
              <a href="#" className="text-white hover:text-[#3ECDC6]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
              <a href="#" className="text-white hover:text-[#3ECDC6]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
              <a href="#" className="text-white hover:text-[#3ECDC6]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
              <a href="#" className="text-white hover:text-[#3ECDC6]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
            </div>
          </div>
        </div>
        <div className={`absolute ${isAr?'left':'right'}-0 top-0 w-[12px] h-full bg-[#045464]`}/>
      </footer>

      {/* ═══════ LIVE CHAT ═══════ */}
      <ParkinChat />
    </div>
  );
}
