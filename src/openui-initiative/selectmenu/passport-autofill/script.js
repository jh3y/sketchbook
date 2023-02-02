import "../../../../net/experimental-web-platform/script.js";


const COUNTRIES = {
  Select: {
    
  },
  Afghanistan: {
    mini: "https://flags.fmcdn.net/data/flags/mini/af.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/af.png",
  },
  Albania: {
    mini: "https://flags.fmcdn.net/data/flags/mini/al.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/al.png",
  },
  Algeria: {
    mini: "https://flags.fmcdn.net/data/flags/mini/dz.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/dz.png",
  },
  Andorra: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ad.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ad.png",
  },
  Angola: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ao.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ao.png",
  },
  Antigua: {
    alias: "Antigua and Barbuda",
    mini: "https://flags.fmcdn.net/data/flags/mini/ag.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ag.png",
  },
  Argentina: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ar.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ar.png",
  },
  Armenia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/am.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/am.png",
  },
  Australia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/au.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/au.png",
  },
  Austria: {
    mini: "https://flags.fmcdn.net/data/flags/mini/at.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/at.png",
  },
  Azerbaijan: {
    mini: "https://flags.fmcdn.net/data/flags/mini/az.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/az.png",
  },
  Bahamas: {
    mini: "https://flags.fmcdn.net/data/flags/mini/bs.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/bs.png",
  },
  Bahrain: {
    mini: "https://flags.fmcdn.net/data/flags/mini/bh.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/bh.png",
  },
  Bangladesh: {
    mini: "https://flags.fmcdn.net/data/flags/mini/bd.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/bd.png",
  },
  Barbados: {
    mini: "https://flags.fmcdn.net/data/flags/mini/bb.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/bb.png",
  },
  Belarus: {
    mini: "https://flags.fmcdn.net/data/flags/mini/by.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/by.png",
  },
  Belgium: {
    mini: "https://flags.fmcdn.net/data/flags/mini/be.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/be.png",
  },
  Belize: {
    mini: "https://flags.fmcdn.net/data/flags/mini/bz.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/bz.png",
  },
  Benin: {
    mini: "https://flags.fmcdn.net/data/flags/mini/bj.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/bj.png",
  },
  Bhutan: {
    mini: "https://flags.fmcdn.net/data/flags/mini/bt.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/bt.png",
  },
  Bolivia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/bo.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/bo.png",
  },
  Bosnia: {
    alias: "Bosnia and Herzegovina",
    mini: "https://flags.fmcdn.net/data/flags/mini/ba.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ba.png",
  },
  Botswana: {
    mini: "https://flags.fmcdn.net/data/flags/mini/bw.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/bw.png",
  },
  Brazil: {
    mini: "https://flags.fmcdn.net/data/flags/mini/br.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/br.png",
  },
  Brunei: {
    mini: "https://flags.fmcdn.net/data/flags/mini/bn.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/bn.png",
  },
  Bulgaria: {
    mini: "https://flags.fmcdn.net/data/flags/mini/bg.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/bg.png",
  },
  Burkina: {
    alias: "Burkina Faso",
    mini: "https://flags.fmcdn.net/data/flags/mini/bf.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/bf.png",
  },
  Burundi: {
    mini: "https://flags.fmcdn.net/data/flags/mini/bi.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/bi.png",
  },
  Cambodia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/kh.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/kh.png",
  },
  Cameroon: {
    mini: "https://flags.fmcdn.net/data/flags/mini/cm.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/cm.png",
  },
  Canada: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ca.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ca.png",
  },
  Verde: {
    alias: "Cape Verde",
    mini: "https://flags.fmcdn.net/data/flags/mini/cv.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/cv.png",
  },
  CAR: {
    alias: "Central African Republic",
    mini: "https://flags.fmcdn.net/data/flags/mini/cf.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/cf.png",
  },
  Chad: {
    mini: "https://flags.fmcdn.net/data/flags/mini/td.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/td.png",
  },
  Chile: {
    mini: "https://flags.fmcdn.net/data/flags/mini/cl.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/cl.png",
  },
  Colombia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/co.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/co.png",
  },
  Comoros: {
    mini: "https://flags.fmcdn.net/data/flags/mini/km.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/km.png",
  },
  Cook: {
    alias: "Cook Islands",
    mini: "https://flags.fmcdn.net/data/flags/mini/ck.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ck.png",
  },
  CostaRica: {
    alias: "Costa Rica",
    mini: "https://flags.fmcdn.net/data/flags/mini/cr.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/cr.png",
  },
  Ivoire: {
    alias: "Cote d'Ivoire",
    mini: "https://flags.fmcdn.net/data/flags/mini/ci.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ci.png",
  },
  Croatia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/hr.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/hr.png",
  },
  Cuba: {
    mini: "https://flags.fmcdn.net/data/flags/mini/cu.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/cu.png",
  },
  Cyprus: {
    mini: "https://flags.fmcdn.net/data/flags/mini/cy.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/cy.png",
  },
  Czech: {
    alias: "Czech Republic",
    mini: "https://flags.fmcdn.net/data/flags/mini/cz.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/cz.png",
  },
  DRC: {
    alias: "Democratic Republic of the Congo",
    mini: "https://flags.fmcdn.net/data/flags/mini/cd.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/cd.png",
  },
  Denmark: {
    mini: "https://flags.fmcdn.net/data/flags/mini/dk.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/dk.png",
  },
  Djibouti: {
    mini: "https://flags.fmcdn.net/data/flags/mini/dj.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/dj.png",
  },
  Dominica: {
    mini: "https://flags.fmcdn.net/data/flags/mini/dm.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/dm.png",
  },
  DR: {
    alias: "Dominican Republic",
    mini: "https://flags.fmcdn.net/data/flags/mini/do.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/do.png",
  },
  Timor: {
    alias: "East Timor",
    mini: "https://flags.fmcdn.net/data/flags/mini/tl.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/tl.png",
  },
  Ecuador: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ec.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ec.png",
  },
  Egypt: {
    mini: "https://flags.fmcdn.net/data/flags/mini/eg.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/eg.png",
  },
  Salvador: {
    alias: "El Salvador",
    mini: "https://flags.fmcdn.net/data/flags/mini/sv.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/sv.png",
  },
  EGuinea: {
    alias: "Equatorial Guinea",
    mini: "https://flags.fmcdn.net/data/flags/mini/gq.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/gq.png",
  },
  Eritrea: {
    mini: "https://flags.fmcdn.net/data/flags/mini/er.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/er.png",
  },
  Estonia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ee.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ee.png",
  },
  Ethiopia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/et.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/et.png",
  },
  Fiji: {
    mini: "https://flags.fmcdn.net/data/flags/mini/fj.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/fj.png",
  },
  Finland: {
    mini: "https://flags.fmcdn.net/data/flags/mini/fi.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/fi.png",
  },
  France: {
    mini: "https://flags.fmcdn.net/data/flags/mini/fr.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/fr.png",
  },
  Gabon: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ga.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ga.png",
  },
  Gambia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/gm.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/gm.png",
  },
  Georgia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ge.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ge.png",
  },
  Germany: {
    mini: "https://flags.fmcdn.net/data/flags/mini/de.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/de.png",
  },
  Ghana: {
    mini: "https://flags.fmcdn.net/data/flags/mini/gh.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/gh.png",
  },
  Greece: {
    mini: "https://flags.fmcdn.net/data/flags/mini/gr.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/gr.png",
  },
  Grenada: {
    mini: "https://flags.fmcdn.net/data/flags/mini/gd.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/gd.png",
  },
  Guatemala: {
    mini: "https://flags.fmcdn.net/data/flags/mini/gt.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/gt.png",
  },
  Guinea: {
    mini: "https://flags.fmcdn.net/data/flags/mini/gn.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/gn.png",
  },
  GuineaB: {
    alias: "Guinea-Bissau",
    mini: "https://flags.fmcdn.net/data/flags/mini/gw.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/gw.png",
  },
  Guyana: {
    mini: "https://flags.fmcdn.net/data/flags/mini/gy.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/gy.png",
  },
  Haiti: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ht.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ht.png",
  },
  Honduras: {
    mini: "https://flags.fmcdn.net/data/flags/mini/hn.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/hn.png",
  },
  Hungary: {
    mini: "https://flags.fmcdn.net/data/flags/mini/hu.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/hu.png",
  },
  Iceland: {
    mini: "https://flags.fmcdn.net/data/flags/mini/is.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/is.png",
  },
  India: {
    mini: "https://flags.fmcdn.net/data/flags/mini/in.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/in.png",
  },
  Indonesia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/id.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/id.png",
  },
  Iran: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ir.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ir.png",
  },
  Iraq: {
    mini: "https://flags.fmcdn.net/data/flags/mini/iq.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/iq.png",
  },
  Ireland: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ie.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ie.png",
  },
  Israel: {
    mini: "https://flags.fmcdn.net/data/flags/mini/il.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/il.png",
  },
  Italy: {
    mini: "https://flags.fmcdn.net/data/flags/mini/it.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/it.png",
  },
  Jamaica: {
    mini: "https://flags.fmcdn.net/data/flags/mini/jm.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/jm.png",
  },
  Japan: {
    mini: "https://flags.fmcdn.net/data/flags/mini/jp.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/jp.png",
  },
  Jordan: {
    mini: "https://flags.fmcdn.net/data/flags/mini/jo.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/jo.png",
  },
  Kazakhstan: {
    mini: "https://flags.fmcdn.net/data/flags/mini/kz.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/kz.png",
  },
  Kenya: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ke.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ke.png",
  },
  Kiribati: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ki.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ki.png",
  },
  Kosovo: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ks.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ks.png",
  },
  Kuwait: {
    mini: "https://flags.fmcdn.net/data/flags/mini/kw.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/kw.png",
  },
  Kyrgyzstan: {
    mini: "https://flags.fmcdn.net/data/flags/mini/kg.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/kg.png",
  },
  Laos: {
    mini: "https://flags.fmcdn.net/data/flags/mini/la.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/la.png",
  },
  Latvia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/lv.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/lv.png",
  },
  Lebanon: {
    mini: "https://flags.fmcdn.net/data/flags/mini/lb.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/lb.png",
  },
  Lesotho: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ls.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ls.png",
  },
  Liberia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/lr.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/lr.png",
  },
  Libya: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ly.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ly.png",
  },
  Liechtenstein: {
    mini: "https://flags.fmcdn.net/data/flags/mini/li.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/li.png",
  },
  Lithuania: {
    mini: "https://flags.fmcdn.net/data/flags/mini/lt.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/lt.png",
  },
  Luxembourg: {
    mini: "https://flags.fmcdn.net/data/flags/mini/lu.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/lu.png",
  },
  Macedonia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/mk.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/mk.png",
  },
  Madagascar: {
    mini: "https://flags.fmcdn.net/data/flags/mini/mg.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/mg.png",
  },
  Malawi: {
    mini: "https://flags.fmcdn.net/data/flags/mini/mw.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/mw.png",
  },
  Malaysia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/my.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/my.png",
  },
  Maldives: {
    mini: "https://flags.fmcdn.net/data/flags/mini/mv.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/mv.png",
  },
  Mali: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ml.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ml.png",
  },
  Malta: {
    mini: "https://flags.fmcdn.net/data/flags/mini/mt.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/mt.png",
  },
  Marshall: {
    alias: "Marshall Islands",
    mini: "https://flags.fmcdn.net/data/flags/mini/mh.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/mh.png",
  },
  Mauritania: {
    mini: "https://flags.fmcdn.net/data/flags/mini/mr.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/mr.png",
  },
  Mauritius: {
    mini: "https://flags.fmcdn.net/data/flags/mini/mu.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/mu.png",
  },
  Mexico: {
    mini: "https://flags.fmcdn.net/data/flags/mini/mx.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/mx.png",
  },
  Micronesia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/fm.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/fm.png",
  },
  Moldova: {
    mini: "https://flags.fmcdn.net/data/flags/mini/md.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/md.png",
  },
  Monaco: {
    mini: "https://flags.fmcdn.net/data/flags/mini/mc.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/mc.png",
  },
  Mongolia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/mn.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/mn.png",
  },
  Montenegro: {
    mini: "https://flags.fmcdn.net/data/flags/mini/me.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/me.png",
  },
  Morocco: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ma.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ma.png",
  },
  Mozambique: {
    mini: "https://flags.fmcdn.net/data/flags/mini/mz.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/mz.png",
  },
  Myanmar: {
    mini: "https://flags.fmcdn.net/data/flags/mini/mm.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/mm.png",
  },
  Namibia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/na.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/na.png",
  },
  Nauru: {
    mini: "https://flags.fmcdn.net/data/flags/mini/nr.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/nr.png",
  },
  Nepal: {
    mini: "https://flags.fmcdn.net/data/flags/mini/np.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/np.png",
  },
  Netherlands: {
    mini: "https://flags.fmcdn.net/data/flags/mini/nl.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/nl.png",
  },
  NZ: {
    alias: "New Zealand",
    mini: "https://flags.fmcdn.net/data/flags/mini/nz.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/nz.png",
  },
  Nicaragua: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ni.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ni.png",
  },
  Niger: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ne.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ne.png",
  },
  Nigeria: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ng.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ng.png",
  },
  Niue: {
    mini: "https://flags.fmcdn.net/data/flags/mini/nu.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/nu.png",
  },
  NKorea: {
    alias: "North Korea",
    mini: "https://flags.fmcdn.net/data/flags/mini/kp.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/kp.png",
  },
  Norway: {
    mini: "https://flags.fmcdn.net/data/flags/mini/no.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/no.png",
  },
  Oman: {
    mini: "https://flags.fmcdn.net/data/flags/mini/om.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/om.png",
  },
  Pakistan: {
    mini: "https://flags.fmcdn.net/data/flags/mini/pk.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/pk.png",
  },
  Palau: {
    mini: "https://flags.fmcdn.net/data/flags/mini/pw.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/pw.png",
  },
  Panama: {
    mini: "https://flags.fmcdn.net/data/flags/mini/pa.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/pa.png",
  },
  PGuinea: {
    alias: "Papua new Guinea",
    mini: "https://flags.fmcdn.net/data/flags/mini/pg.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/pg.png",
  },
  Paraguay: {
    mini: "https://flags.fmcdn.net/data/flags/mini/py.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/py.png",
  },
  China: {
    alias: "People's Republic China",
    mini: "https://flags.fmcdn.net/data/flags/mini/cn.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/cn.png",
  },
  Peru: {
    mini: "https://flags.fmcdn.net/data/flags/mini/pe.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/pe.png",
  },
  Philippines: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ph.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ph.png",
  },
  Poland: {
    mini: "https://flags.fmcdn.net/data/flags/mini/pl.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/pl.png",
  },
  Portugal: {
    mini: "https://flags.fmcdn.net/data/flags/mini/pt.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/pt.png",
  },
  Qatar: {
    mini: "https://flags.fmcdn.net/data/flags/mini/qa.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/qa.png",
  },
  Taiwan: {
    mini: "https://flags.fmcdn.net/data/flags/mini/tw.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/tw.png",
  },
  RC: {
    alias: "Republic of Congo",
    mini: "https://flags.fmcdn.net/data/flags/mini/cg.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/cg.png",
  },
  Romania: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ro.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ro.png",
  },
  Russia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ru.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ru.png",
  },
  Rwanda: {
    mini: "https://flags.fmcdn.net/data/flags/mini/rw.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/rw.png",
  },
  SKN: {
    alias: "Saint Kitts and Nevis",
    mini: "https://flags.fmcdn.net/data/flags/mini/kn.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/kn.png",
  },
  SL: {
    alias: "Saint Lucia",
    mini: "https://flags.fmcdn.net/data/flags/mini/lc.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/lc.png",
  },
  SVG: {
    alias: "Saint Vincent and the Grenadines",
    mini: "https://flags.fmcdn.net/data/flags/mini/vc.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/vc.png",
  },
  Samoa: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ws.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ws.png",
  },
  SM: {
    alias: "San Marino",
    mini: "https://flags.fmcdn.net/data/flags/mini/sm.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/sm.png",
  },
  STP: {
    alias: "Sao Tome and Principe",
    mini: "https://flags.fmcdn.net/data/flags/mini/st.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/st.png",
  },
  Arab: {
    alias: "Saudi Arabia",
    mini: "https://flags.fmcdn.net/data/flags/mini/sa.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/sa.png",
  },
  Senegal: {
    mini: "https://flags.fmcdn.net/data/flags/mini/sn.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/sn.png",
  },
  Serbia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/rs.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/rs.png",
  },
  Seychelles: {
    mini: "https://flags.fmcdn.net/data/flags/mini/sc.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/sc.png",
  },
  Sierra: {
    alias: "Sierra Leone",
    mini: "https://flags.fmcdn.net/data/flags/mini/sl.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/sl.png",
  },
  Singapore: {
    mini: "https://flags.fmcdn.net/data/flags/mini/sg.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/sg.png",
  },
  Slovakia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/sk.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/sk.png",
  },
  Slovenia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/si.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/si.png",
  },
  Solomon: {
    alias: "Solomon Islands",
    mini: "https://flags.fmcdn.net/data/flags/mini/sb.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/sb.png",
  },
  Somalia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/so.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/so.png",
  },
  RSA: {
    alias: "Republic of South Africa",
    mini: "https://flags.fmcdn.net/data/flags/mini/za.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/za.png",
  },
  SKorea: {
    alias: "South Korea",
    mini: "https://flags.fmcdn.net/data/flags/mini/kr.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/kr.png",
  },
  SSudan: {
    alias: "South Sudan",
    mini: "https://flags.fmcdn.net/data/flags/mini/ss.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ss.png",
  },
  Spain: {
    mini: "https://flags.fmcdn.net/data/flags/mini/es.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/es.png",
  },
  Lanka: {
    alias: "Shri Lanka",
    mini: "https://flags.fmcdn.net/data/flags/mini/lk.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/lk.png",
  },
  Sudan: {
    mini: "https://flags.fmcdn.net/data/flags/mini/sd.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/sd.png",
  },
  Suriname: {
    mini: "https://flags.fmcdn.net/data/flags/mini/sr.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/sr.png",
  },
  Swaziland: {
    mini: "https://flags.fmcdn.net/data/flags/mini/sz.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/sz.png",
  },
  Sweden: {
    mini: "https://flags.fmcdn.net/data/flags/mini/se.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/se.png",
  },
  Switzerland: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ch.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ch.png",
  },
  Syria: {
    mini: "https://flags.fmcdn.net/data/flags/mini/sy.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/sy.png",
  },
  Tajikistan: {
    mini: "https://flags.fmcdn.net/data/flags/mini/tj.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/tj.png",
  },
  Tanzania: {
    mini: "https://flags.fmcdn.net/data/flags/mini/tz.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/tz.png",
  },
  Thailand: {
    mini: "https://flags.fmcdn.net/data/flags/mini/th.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/th.png",
  },
  Togo: {
    mini: "https://flags.fmcdn.net/data/flags/mini/tg.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/tg.png",
  },
  Tonga: {
    mini: "https://flags.fmcdn.net/data/flags/mini/to.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/to.png",
  },
  "Trinidad and Tobago": {
    alias: "Trinidad and Tobago",
    mini: "https://flags.fmcdn.net/data/flags/mini/tt.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/tt.png",
  },
  Tunisia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/tn.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/tn.png",
  },
  Turkey: {
    mini: "https://flags.fmcdn.net/data/flags/mini/tr.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/tr.png",
  },
  Turkmenistan: {
    mini: "https://flags.fmcdn.net/data/flags/mini/tm.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/tm.png",
  },
  Tuvalu: {
    mini: "https://flags.fmcdn.net/data/flags/mini/tv.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/tv.png",
  },
  Uganda: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ug.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ug.png",
  },
  Ukraine: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ua.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ua.png",
  },
  UAE: {
    alias: "United Arab Emirates",
    mini: "https://flags.fmcdn.net/data/flags/mini/ae.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ae.png",
  },
  'United Kingdom': {
    alias: "United Kingdom",
    mini: "https://flags.fmcdn.net/data/flags/mini/gb.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/gb.png",
  },
  USA: {
    alias: "United States",
    mini: "https://flags.fmcdn.net/data/flags/mini/us.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/us.png",
  },
  Uruguay: {
    mini: "https://flags.fmcdn.net/data/flags/mini/uy.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/uy.png",
  },
  Uzbekistan: {
    mini: "https://flags.fmcdn.net/data/flags/mini/uz.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/uz.png",
  },
  Vanuatu: {
    mini: "https://flags.fmcdn.net/data/flags/mini/vu.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/vu.png",
  },
  Vatican: {
    alias: "Vatican City",
    mini: "https://flags.fmcdn.net/data/flags/mini/va.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/va.png",
  },
  Venezuela: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ve.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ve.png",
  },
  Vietnam: {
    mini: "https://flags.fmcdn.net/data/flags/mini/vn.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/vn.png",
  },
  Sahara: {
    alias: "Western Sahara",
    mini: "https://flags.fmcdn.net/data/flags/mini/eh.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/eh.png",
  },
  Yemen: {
    mini: "https://flags.fmcdn.net/data/flags/mini/ye.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/ye.png",
  },
  Zambia: {
    mini: "https://flags.fmcdn.net/data/flags/mini/zm.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/zm.png",
  },
  Zimbabwe: {
    mini: "https://flags.fmcdn.net/data/flags/mini/zw.png",
    normal: "https://flags.fmcdn.net/data/flags/normal/zw.png",
  },
};

// const DEFAULT = Object.keys(COUNTRIES)[Math.floor(Math.random() * Object.keys(COUNTRIES).length)]
const COUNTRY_SELECT = document.querySelector('#country')
const LISTBOXES = [...document.querySelectorAll('[behavior=listbox]')]
const BUTTONS = [COUNTRY_SELECT.querySelector('button')]

const POPULATE = () => {
  for (const COUNTRY of Object.keys(COUNTRIES)) {
    LISTBOXES.forEach(listbox => {
      const OPTION = Object.assign(document.createElement('option'), {
        value: COUNTRY,
        // selected: COUNTRY === DEFAULT ? true : false,
        selected: false,
        innerHTML: `
          ${COUNTRIES[COUNTRY].normal ? `<img src="${COUNTRIES[COUNTRY].normal}" alt=""/>` : '<span class="filler"></span>'}
          <span>${COUNTRIES[COUNTRY].alias || COUNTRY}</span>
        `
      })
      listbox.appendChild(OPTION)
    })
  }
  BUTTONS.forEach(button => button.removeAttribute('disabled'))
  // CLONE()
}

const CLONE = SELECT => () => {
  const VALUE = SELECT.querySelector('[behavior=selected-value]')
  const SELECTED = COUNTRIES[SELECT.value]
  if (SELECTED) {
    VALUE.innerHTML = `
      ${SELECTED.normal ? `<img src="${SELECTED.normal}" alt=""/>` : ''}
      <span>${SELECTED.alias || SELECT.value}</span>
    `;
  }
};

const COUNTRY_CLONE = CLONE(COUNTRY_SELECT)
COUNTRY_SELECT.addEventListener("input", COUNTRY_CLONE);

POPULATE()
COUNTRY_CLONE();