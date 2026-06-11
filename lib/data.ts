// AUTO-GENERATED — não editar manualmente.
// Fonte: grape-skus-2026-06-02.json · Markup: 2.8x · Agrupado por prefixo de SKU

export type Tier = {
  minQty: number;
  label: string;
  price: number;
};

export type Variation = {
  sku: string;
  label: string;
  tiers: Tier[];
  weight: string;
  ncm: string;
};

export type Product = {
  prefix: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  supplier: string;
  keywords: string[];
  variations: Variation[];
  stock: number;
  sold: number;
  isPromotion: boolean;
  isLaunch: boolean;
  // Ficha técnica adicional (opcional — preencha por produto)
  tamanho?: string;
  material?: string;
  usoIndicado?: string;
  compativelCom?: string;
};

export const products: Product[] = [
  {
    prefix:"CH.CONEC.DUP",
    slug:"ch-conec-dup",
    name:"Conector Duplo Curto",
    description:"Conector Duplo Curto · Emendas · Grape Tools",
    category:"Elétrica",
    subcategory:"Conectores",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["conector duplo curto","emendas","grape tools","transparente"],
    variations:[
      {sku:"CH.CONEC.DUP.TS",label:"Transparente",tiers:[{minQty:10,label:"10",price:1.12}, {minQty:50,label:"50",price:1.01}, {minQty:100,label:"100",price:0.92}, {minQty:500,label:"500",price:0.81}],weight:"3g",ncm:"85369090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.CONEC.LONG",
    slug:"ch-conec-long",
    name:"Conector Duplo Longo",
    description:"Conector Duplo Longo · Emendas · Grape Tools",
    category:"Elétrica",
    subcategory:"Conectores",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["conector duplo longo","emendas","grape tools","transparente","cinza"],
    variations:[
      {sku:"CH.CONEC.LONG.TS",label:"Transparente",tiers:[{minQty:10,label:"10",price:1.65}, {minQty:50,label:"50",price:1.48}, {minQty:100,label:"100",price:1.35}, {minQty:500,label:"500",price:1.19}],weight:"A consultar",ncm:"85369090"},
      {sku:"CH.CONEC.DUP.CZ",label:"Cinza",tiers:[{minQty:10,label:"10",price:1.93}, {minQty:50,label:"50",price:1.74}, {minQty:100,label:"100",price:1.58}, {minQty:500,label:"500",price:1.39}],weight:"7g",ncm:"85369090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.DISC.125.BR",
    slug:"ch-disc-125-br",
    name:"Disco de Lixa",
    description:"Disco de Lixa · Pluma · Branco · Grape Tools · Grão 40",
    category:"Abrasivos",
    subcategory:"Discos de Lixa",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["disco de lixa","pluma","branco","grape tools","grão 40","grão 60","grão 80","grão 100","grão 120","grão 600"],
    variations:[
      {sku:"CH.DISC.125.BR.40",label:"Branco · Grão 40",tiers:[{minQty:10,label:"10",price:1.09}, {minQty:50,label:"50",price:0.98}, {minQty:100,label:"100",price:0.89}, {minQty:500,label:"500",price:0.78}],weight:"8g",ncm:"68053090"},
      {sku:"CH.DISC.125.BR.60",label:"Branco · Grão 60",tiers:[{minQty:10,label:"10",price:1.09}, {minQty:50,label:"50",price:0.98}, {minQty:100,label:"100",price:0.89}, {minQty:500,label:"500",price:0.78}],weight:"8.00g",ncm:"68053090"},
      {sku:"CH.DISC.125.BR.80",label:"Branco · Grão 80",tiers:[{minQty:10,label:"10",price:1.09}, {minQty:50,label:"50",price:0.98}, {minQty:100,label:"100",price:0.89}, {minQty:500,label:"500",price:0.78}],weight:"8.00g",ncm:"68053090"},
      {sku:"CH.DISC.125.BR.100",label:"Branco · Grão 100",tiers:[{minQty:10,label:"10",price:1.04}, {minQty:50,label:"50",price:0.94}, {minQty:100,label:"100",price:0.85}, {minQty:500,label:"500",price:0.75}],weight:"8.00g",ncm:"68053090"},
      {sku:"CH.DISC.125.BR.120",label:"Branco · Grão 120",tiers:[{minQty:10,label:"10",price:1.04}, {minQty:50,label:"50",price:0.94}, {minQty:100,label:"100",price:0.85}, {minQty:500,label:"500",price:0.75}],weight:"8.00g",ncm:"68053090"},
      {sku:"CH.DISC.125.BR.600",label:"Branco · Grão 600",tiers:[{minQty:10,label:"10",price:1.04}, {minQty:50,label:"50",price:0.94}, {minQty:100,label:"100",price:0.85}, {minQty:500,label:"500",price:0.75}],weight:"8.00g",ncm:"68053090"},
      {sku:"CH.DISC.125.BR.1000",label:"Branco · Grão 1000",tiers:[{minQty:10,label:"10",price:1.04}, {minQty:50,label:"50",price:0.94}, {minQty:100,label:"100",price:0.85}, {minQty:500,label:"500",price:0.75}],weight:"8.00g",ncm:"85444200"},
      {sku:"CH.DISC.125.BR.400",label:"Branco · Grão 400",tiers:[{minQty:10,label:"10",price:1.04}, {minQty:50,label:"50",price:0.94}, {minQty:100,label:"100",price:0.85}, {minQty:500,label:"500",price:0.75}],weight:"8g",ncm:"68053090"},
      {sku:"CH.DISC.125.BR.150",label:"Branco · Grão 150",tiers:[{minQty:10,label:"10",price:1.04}, {minQty:50,label:"50",price:0.94}, {minQty:100,label:"100",price:0.85}, {minQty:500,label:"500",price:0.75}],weight:"8.00g",ncm:"68053090"},
      {sku:"CH.DISC.125.BR.180",label:"Branco · Grão 180",tiers:[{minQty:10,label:"10",price:1.04}, {minQty:50,label:"50",price:0.94}, {minQty:100,label:"100",price:0.85}, {minQty:500,label:"500",price:0.75}],weight:"8.00g",ncm:"68053090"},
      {sku:"CH.DISC.125.BR.240",label:"Branco · Grão 240",tiers:[{minQty:10,label:"10",price:1.04}, {minQty:50,label:"50",price:0.94}, {minQty:100,label:"100",price:0.85}, {minQty:500,label:"500",price:0.75}],weight:"8.00g",ncm:"85444200"},
      {sku:"CH.DISC.125.BR.320",label:"Branco · Grão 320",tiers:[{minQty:10,label:"10",price:1.04}, {minQty:50,label:"50",price:0.94}, {minQty:100,label:"100",price:0.85}, {minQty:500,label:"500",price:0.75}],weight:"8.00g",ncm:"68053090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.DISC.LIX.125",
    slug:"ch-disc-lix-125",
    name:"Disco de Lixa Com Furos Grape Tools",
    description:"Disco de Lixa Com Furos Grape Tools · 125mm · Grão 150",
    category:"Abrasivos",
    subcategory:"Discos com Furos",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["disco de lixa com furos grape tools","125mm","grão 150","grão 180","grão 40","grão 120","grão 400","grão 60","grão 80","grão 100"],
    variations:[
      {sku:"CH.DISC.LIX.125.150",label:"125mm · Grão 150",tiers:[{minQty:10,label:"10",price:0.7}, {minQty:50,label:"50",price:0.63}, {minQty:100,label:"100",price:0.57}, {minQty:500,label:"500",price:0.5}],weight:"6.00g",ncm:"68053090"},
      {sku:"CH.DISC.LIX.125.180",label:"125mm · Grão 180",tiers:[{minQty:10,label:"10",price:0.7}, {minQty:50,label:"50",price:0.63}, {minQty:100,label:"100",price:0.57}, {minQty:500,label:"500",price:0.5}],weight:"6.00g",ncm:"68053090"},
      {sku:"CH.DISC.LIX.125.40",label:"125mm · Grão 40",tiers:[{minQty:10,label:"10",price:0.76}, {minQty:50,label:"50",price:0.68}, {minQty:100,label:"100",price:0.62}, {minQty:500,label:"500",price:0.55}],weight:"6.00g",ncm:"68053090"},
      {sku:"CH.DISC.LIX.125.120",label:"125mm · Grão 120",tiers:[{minQty:10,label:"10",price:0.73}, {minQty:50,label:"50",price:0.66}, {minQty:100,label:"100",price:0.6}, {minQty:500,label:"500",price:0.53}],weight:"6.00g",ncm:"68053090"},
      {sku:"CH.DISC.LIX.125.400",label:"125mm · Grão 400",tiers:[{minQty:10,label:"10",price:0.64}, {minQty:50,label:"50",price:0.58}, {minQty:100,label:"100",price:0.52}, {minQty:500,label:"500",price:0.46}],weight:"6.00g",ncm:"68053090"},
      {sku:"CH.DISC.LIX.125.60",label:"125mm · Grão 60",tiers:[{minQty:10,label:"10",price:0.76}, {minQty:50,label:"50",price:0.68}, {minQty:100,label:"100",price:0.62}, {minQty:500,label:"500",price:0.55}],weight:"6.00g",ncm:"68053090"},
      {sku:"CH.DISC.LIX.125.80",label:"125mm · Grão 80",tiers:[{minQty:10,label:"10",price:0.76}, {minQty:50,label:"50",price:0.68}, {minQty:100,label:"100",price:0.62}, {minQty:500,label:"500",price:0.55}],weight:"6.00g",ncm:"68053090"},
      {sku:"CH.DISC.LIX.125.100",label:"125mm · Grão 100",tiers:[{minQty:10,label:"10",price:0.73}, {minQty:50,label:"50",price:0.66}, {minQty:100,label:"100",price:0.6}, {minQty:500,label:"500",price:0.53}],weight:"6.00g",ncm:"68053090"},
      {sku:"CH.DISC.LIX.125.240",label:"125mm · Grão 240",tiers:[{minQty:10,label:"10",price:0.7}, {minQty:50,label:"50",price:0.63}, {minQty:100,label:"100",price:0.57}, {minQty:500,label:"500",price:0.5}],weight:"6.00g",ncm:"68053090"},
      {sku:"CH.DISC.LIX.125.320",label:"125mm · Grão 320",tiers:[{minQty:10,label:"10",price:0.64}, {minQty:50,label:"50",price:0.58}, {minQty:100,label:"100",price:0.52}, {minQty:500,label:"500",price:0.46}],weight:"6.00g",ncm:"68053090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.TRAV.PIS",
    slug:"ch-trav-pis",
    name:"Trava Plástica com Pistão",
    description:"Trava Plástica com Pistão · Grape Tools · Branco",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["trava plástica com pistão","grape tools","branco","preto"],
    variations:[
      {sku:"CH.TRAV.PIS.BR",label:"Branco",tiers:[{minQty:10,label:"10",price:1.54}, {minQty:50,label:"50",price:1.39}, {minQty:100,label:"100",price:1.26}, {minQty:500,label:"500",price:1.11}],weight:"0.00g",ncm:"83014000"},
      {sku:"CH.TRAV.PIS.PT",label:"Preto",tiers:[{minQty:10,label:"10",price:1.54}, {minQty:50,label:"50",price:1.39}, {minQty:100,label:"100",price:1.26}, {minQty:500,label:"500",price:1.11}],weight:"0.00g",ncm:"83014000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.LA",
    slug:"ch-la",
    name:"Lâmina de Estilete",
    description:"Lâmina de Estilete · 18mm · Grape Tools · 0,5mm Espessura (10un)",
    category:"Ferramentas",
    subcategory:"Lâminas",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["lâmina de estilete","18mm","grape tools","0,5mm espessura (10un)","25mm","0,7mm espessura (10un)"],
    variations:[
      {sku:"CH.LA.18",label:"18mm · 0,5mm Espessura (10un)",tiers:[{minQty:10,label:"10",price:2.83}, {minQty:50,label:"50",price:2.55}, {minQty:100,label:"100",price:2.32}, {minQty:500,label:"500",price:2.04}],weight:"0.00g",ncm:"82119400"},
      {sku:"CH.LA.25",label:"25mm · 0,7mm Espessura (10un)",tiers:[{minQty:10,label:"10",price:13.44}, {minQty:50,label:"50",price:12.1}, {minQty:100,label:"100",price:11.02}, {minQty:500,label:"500",price:9.68}],weight:"0.00g",ncm:"82119400"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.SUP.QUAD.5",
    slug:"ch-sup-quad-5",
    name:"Suporte para Esponja",
    description:"Suporte para Esponja · 5 x 5 · Grape Tools · Aço Escovado",
    category:"Ferramentas",
    subcategory:"Suportes",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["suporte para esponja","5 x 5","grape tools","aço escovado"],
    variations:[
      {sku:"CH.SUP.QUAD.5.5",label:"5 x 5 · Aço Escovado",tiers:[{minQty:10,label:"10",price:3.47}, {minQty:50,label:"50",price:3.12}, {minQty:100,label:"100",price:2.85}, {minQty:500,label:"500",price:2.5}],weight:"0.00g",ncm:"73239300"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.MAC.MAC",
    slug:"ch-mac-mac",
    name:"Fio Macho para Macho",
    description:"Fio Macho para Macho · Grape Tools · 20cm",
    category:"Elétrica",
    subcategory:"Cabos e Fios",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["fio macho para macho","grape tools","20cm"],
    variations:[
      {sku:"CH.MAC.MAC.20",label:"20cm",tiers:[{minQty:10,label:"10",price:6.69}, {minQty:50,label:"50",price:6.02}, {minQty:100,label:"100",price:5.49}, {minQty:500,label:"500",price:4.82}],weight:"0.00g",ncm:"85444200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.ROLET",
    slug:"ch-rolet",
    name:"Fecho Rolete",
    description:"Fecho Rolete · Grape Tools · Dourado",
    category:"Ferragens",
    subcategory:"Fechos",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["fecho rolete","grape tools","dourado","zincado"],
    variations:[
      {sku:"CH.ROLET.DO",label:"Dourado",tiers:[{minQty:10,label:"10",price:1.65}, {minQty:50,label:"50",price:1.48}, {minQty:100,label:"100",price:1.35}, {minQty:500,label:"500",price:1.19}],weight:"14g",ncm:"83013000"},
      {sku:"CH.ROLET.PR",label:"Zincado",tiers:[{minQty:10,label:"10",price:1.82}, {minQty:50,label:"50",price:1.64}, {minQty:100,label:"100",price:1.49}, {minQty:500,label:"500",price:1.31}],weight:"14g",ncm:"83013000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.MASC",
    slug:"ch-masc",
    name:"Mascara 3d para Olhos",
    description:"Mascara 3d para Olhos · Grape Tools · Preto",
    category:"Utilidades",
    subcategory:"Organização",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["mascara 3d para olhos","grape tools","preto"],
    variations:[
      {sku:"CH.MASC.PT",label:"Preto",tiers:[{minQty:10,label:"10",price:25.87}, {minQty:50,label:"50",price:23.28}, {minQty:100,label:"100",price:21.21}, {minQty:500,label:"500",price:18.63}],weight:"35.00g",ncm:"CH.MASC.PT"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.MAC.FEM",
    slug:"ch-mac-fem",
    name:"Fio Macho para Fêmea",
    description:"Fio Macho para Fêmea · Grape Tools · 20cm",
    category:"Elétrica",
    subcategory:"Cabos e Fios",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["fio macho para fêmea","grape tools","20cm"],
    variations:[
      {sku:"CH.MAC.FEM.20",label:"20cm",tiers:[{minQty:10,label:"10",price:5.71}, {minQty:50,label:"50",price:5.14}, {minQty:100,label:"100",price:4.68}, {minQty:500,label:"500",price:4.11}],weight:"0.00g",ncm:"85444200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.FEM.FEM",
    slug:"ch-fem-fem",
    name:"Fio Fêmea para fêmea",
    description:"Fio Fêmea para fêmea · Grape Tools · 20cm",
    category:"Elétrica",
    subcategory:"Cabos e Fios",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["fio fêmea para fêmea","grape tools","20cm"],
    variations:[
      {sku:"CH.FEM.FEM.20",label:"20cm",tiers:[{minQty:10,label:"10",price:9.77}, {minQty:50,label:"50",price:8.79}, {minQty:100,label:"100",price:8.01}, {minQty:500,label:"500",price:7.03}],weight:"0.00g",ncm:"85369090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.SUP.INX.VASS",
    slug:"ch-sup-inx-vass",
    name:"Suporte de Vassoura",
    description:"Suporte de Vassoura · Inox · Grape Tools · 4 Clipes + 5 Ganchos",
    category:"Ferramentas",
    subcategory:"Suportes",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["suporte de vassoura","inox","grape tools","4 clipes + 5 ganchos"],
    variations:[
      {sku:"CH.SUP.INX.VASS.5GAN",label:"Inox · 4 Clipes + 5 Ganchos",tiers:[{minQty:10,label:"10",price:49.76}, {minQty:50,label:"50",price:44.78}, {minQty:100,label:"100",price:40.8}, {minQty:500,label:"500",price:35.83}],weight:"300.00g",ncm:"73181300"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.TRAV.PR",
    slug:"ch-trav-pr",
    name:"Trava Porta",
    description:"Trava Porta · Longo · Grape Tools · Prateado",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["trava porta","longo","grape tools","prateado"],
    variations:[
      {sku:"CH.TRAV.PR.LONG",label:"Longo · Prateado",tiers:[{minQty:10,label:"10",price:24.61}, {minQty:50,label:"50",price:22.15}, {minQty:100,label:"100",price:20.18}, {minQty:500,label:"500",price:17.72}],weight:"160g",ncm:"83013000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.TPOR",
    slug:"ch-tpor",
    name:"Trava Porta Magnético",
    description:"Trava Porta Magnético · Grape Tools |Slim",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["trava porta magnético","grape tools |slim"],
    variations:[
      {sku:"CH.TPOR.SLIM",label:"Grape Tools |Slim",tiers:[{minQty:10,label:"10",price:24.61}, {minQty:50,label:"50",price:22.15}, {minQty:100,label:"100",price:20.18}, {minQty:500,label:"500",price:17.72}],weight:"80g",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.TRAV.BOL",
    slug:"ch-trav-bol",
    name:"Trava Porta Magnético Bola",
    description:"Trava Porta Magnético Bola · Grape Tools · Preto",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["trava porta magnético bola","grape tools","preto"],
    variations:[
      {sku:"CH.TRAV.BOL.PT",label:"Preto",tiers:[{minQty:10,label:"10",price:14.17}, {minQty:50,label:"50",price:12.75}, {minQty:100,label:"100",price:11.62}, {minQty:500,label:"500",price:10.2}],weight:"79g",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.FEC",
    slug:"ch-fec",
    name:"Fecho Magnético Invisível",
    description:"Fecho Magnético Invisível · Grape Tools · Prata",
    category:"Ferragens",
    subcategory:"Fechos",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["fecho magnético invisível","grape tools","prata"],
    variations:[
      {sku:"CH.FEC.MAGNET",label:"Prata",tiers:[{minQty:10,label:"10",price:2.44}, {minQty:50,label:"50",price:2.2}, {minQty:100,label:"100",price:2.0}, {minQty:500,label:"500",price:1.76}],weight:"A consultar",ncm:"83015000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.LIMIT",
    slug:"ch-limit",
    name:"Limitador de Janela",
    description:"Limitador de Janela · Grape Tools Trava Amarelo",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["limitador de janela","grape tools trava amarelo"],
    variations:[
      {sku:"CH.LIMIT.TRAV",label:"Grape Tools Trava Amarelo",tiers:[{minQty:10,label:"10",price:8.04}, {minQty:50,label:"50",price:7.24}, {minQty:100,label:"100",price:6.59}, {minQty:500,label:"500",price:5.79}],weight:"A consultar",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"1.AÇUC",
    slug:"1-acuc",
    name:"Açucareiro",
    description:"Açucareiro · Prático · Azul",
    category:"Utilidades",
    subcategory:"Organização",
    brand:"Cobrirel",
    supplier:"Cobrirel",
    keywords:["açucareiro","prático","azul","branco","cinza","preto","verde","vermelho","amarelo"],
    variations:[
      {sku:"1.AÇUC.AZ",label:"Prático · Azul",tiers:[{minQty:10,label:"10",price:18.9}, {minQty:50,label:"50",price:17.01}, {minQty:100,label:"100",price:15.5}, {minQty:500,label:"500",price:13.61}],weight:"A consultar",ncm:"39241000"},
      {sku:"1.AÇUC.BR",label:"Prático · Branco",tiers:[{minQty:10,label:"10",price:18.9}, {minQty:50,label:"50",price:17.01}, {minQty:100,label:"100",price:15.5}, {minQty:500,label:"500",price:13.61}],weight:"A consultar",ncm:"39241000"},
      {sku:"1.AÇUC.CZ",label:"Prático · Cinza",tiers:[{minQty:10,label:"10",price:18.9}, {minQty:50,label:"50",price:17.01}, {minQty:100,label:"100",price:15.5}, {minQty:500,label:"500",price:13.61}],weight:"A consultar",ncm:"39241000"},
      {sku:"1.AÇUC.PT",label:"Prático · Preto",tiers:[{minQty:10,label:"10",price:18.9}, {minQty:50,label:"50",price:17.01}, {minQty:100,label:"100",price:15.5}, {minQty:500,label:"500",price:13.61}],weight:"A consultar",ncm:"39241000"},
      {sku:"1.AÇUC.VD",label:"Prático · Verde",tiers:[{minQty:10,label:"10",price:18.9}, {minQty:50,label:"50",price:17.01}, {minQty:100,label:"100",price:15.5}, {minQty:500,label:"500",price:13.61}],weight:"A consultar",ncm:"39241000"},
      {sku:"1.AÇUC.VM",label:"Prático · Vermelho",tiers:[{minQty:10,label:"10",price:18.9}, {minQty:50,label:"50",price:17.01}, {minQty:100,label:"100",price:15.5}, {minQty:500,label:"500",price:13.61}],weight:"A consultar",ncm:"39241000"},
      {sku:"1.AÇUC.AM",label:"Prático · Amarelo",tiers:[{minQty:10,label:"10",price:18.9}, {minQty:50,label:"50",price:17.01}, {minQty:100,label:"100",price:15.5}, {minQty:500,label:"500",price:13.61}],weight:"A consultar",ncm:"39241000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"1.SUP",
    slug:"1-sup",
    name:"Suporte para Vassoura Branco",
    description:"Suporte para Vassoura Branco",
    category:"Ferramentas",
    subcategory:"Suportes",
    brand:"Cobrirel",
    supplier:"Cobrirel",
    keywords:["suporte para vassoura branco"],
    variations:[
      {sku:"1.SUP.VAS",label:"VAS",tiers:[{minQty:10,label:"10",price:10.05}, {minQty:50,label:"50",price:9.05}, {minQty:100,label:"100",price:8.24}, {minQty:500,label:"500",price:7.24}],weight:"A consultar",ncm:"39252000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"1.TPOR",
    slug:"1-tpor",
    name:"Trava Porta |Prático",
    description:"Trava Porta |Prático · Branco",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Cobrirel",
    supplier:"Cobrirel",
    keywords:["trava porta |prático","branco","cinza","marrom","preto"],
    variations:[
      {sku:"1.TPOR.BR",label:"Branco",tiers:[{minQty:10,label:"10",price:8.74}, {minQty:50,label:"50",price:7.87}, {minQty:100,label:"100",price:7.17}, {minQty:500,label:"500",price:6.29}],weight:"A consultar",ncm:"39252000"},
      {sku:"1.TPOR.CZ",label:"Cinza",tiers:[{minQty:10,label:"10",price:8.74}, {minQty:50,label:"50",price:7.87}, {minQty:100,label:"100",price:7.17}, {minQty:500,label:"500",price:6.29}],weight:"A consultar",ncm:"39252000"},
      {sku:"1.TPOR.MR",label:"Marrom",tiers:[{minQty:10,label:"10",price:8.74}, {minQty:50,label:"50",price:7.87}, {minQty:100,label:"100",price:7.17}, {minQty:500,label:"500",price:6.29}],weight:"A consultar",ncm:"39252000"},
      {sku:"1.TPOR.PT",label:"Preto",tiers:[{minQty:10,label:"10",price:8.74}, {minQty:50,label:"50",price:7.87}, {minQty:100,label:"100",price:7.17}, {minQty:500,label:"500",price:6.29}],weight:"A consultar",ncm:"39252000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"1.ROD.PIN.30",
    slug:"1-rod-pin-30",
    name:"Rodízio Com Bucha",
    description:"Rodízio Com Bucha · 30mm · Preto",
    category:"Ferragens",
    subcategory:"Rodízios",
    brand:"Cobrirel",
    supplier:"Cobrirel",
    keywords:["rodízio com bucha","30mm","preto","branco"],
    variations:[
      {sku:"1.ROD.PIN.30.PT",label:"30mm · Preto",tiers:[{minQty:10,label:"10",price:6.72}, {minQty:50,label:"50",price:6.05}, {minQty:100,label:"100",price:5.51}, {minQty:500,label:"500",price:4.84}],weight:"A consultar",ncm:"83022000"},
      {sku:"1.ROD.PIN.30.BR",label:"30mm · Branco",tiers:[{minQty:10,label:"10",price:6.72}, {minQty:50,label:"50",price:6.05}, {minQty:100,label:"100",price:5.51}, {minQty:500,label:"500",price:4.84}],weight:"A consultar",ncm:"83022000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"1.ROD.PIN.38",
    slug:"1-rod-pin-38",
    name:"Rodízio Com Bucha",
    description:"Rodízio Com Bucha · 38mm · Preto",
    category:"Ferragens",
    subcategory:"Rodízios",
    brand:"Cobrirel",
    supplier:"Cobrirel",
    keywords:["rodízio com bucha","38mm","preto","branco"],
    variations:[
      {sku:"1.ROD.PIN.38.PT",label:"38mm · Preto",tiers:[{minQty:10,label:"10",price:8.29}, {minQty:50,label:"50",price:7.46}, {minQty:100,label:"100",price:6.8}, {minQty:500,label:"500",price:5.97}],weight:"A consultar",ncm:"83022000"},
      {sku:"1.ROD.PIN.38.BR",label:"38mm · Branco",tiers:[{minQty:10,label:"10",price:8.29}, {minQty:50,label:"50",price:7.46}, {minQty:100,label:"100",price:6.8}, {minQty:500,label:"500",price:5.97}],weight:"A consultar",ncm:"83022000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"2.CAD",
    slug:"2-cad",
    name:"Cadeado |Dourado",
    description:"Cadeado |Dourado · 20mm",
    category:"Ferragens",
    subcategory:"Cadeados",
    brand:"Papaiz",
    supplier:"Papaiz",
    keywords:["cadeado |dourado","20mm","25mm","30mm","35mm","40mm","45mm","50mm","60mm","70mm"],
    variations:[
      {sku:"2.CAD.20",label:"20mm",tiers:[{minQty:10,label:"10",price:0.03}, {minQty:50,label:"50",price:0.03}, {minQty:100,label:"100",price:0.02}, {minQty:500,label:"500",price:0.02}],weight:"A consultar",ncm:"83011000"},
      {sku:"2.CAD.25",label:"25mm",tiers:[{minQty:10,label:"10",price:2.8}, {minQty:50,label:"50",price:2.52}, {minQty:100,label:"100",price:2.3}, {minQty:500,label:"500",price:2.02}],weight:"A consultar",ncm:"83011000"},
      {sku:"2.CAD.30",label:"30mm",tiers:[{minQty:10,label:"10",price:2.8}, {minQty:50,label:"50",price:2.52}, {minQty:100,label:"100",price:2.3}, {minQty:500,label:"500",price:2.02}],weight:"A consultar",ncm:"83011000"},
      {sku:"2.CAD.35",label:"35mm",tiers:[{minQty:10,label:"10",price:2.8}, {minQty:50,label:"50",price:2.52}, {minQty:100,label:"100",price:2.3}, {minQty:500,label:"500",price:2.02}],weight:"A consultar",ncm:"83011000"},
      {sku:"2.CAD.40",label:"40mm",tiers:[{minQty:10,label:"10",price:2.8}, {minQty:50,label:"50",price:2.52}, {minQty:100,label:"100",price:2.3}, {minQty:500,label:"500",price:2.02}],weight:"A consultar",ncm:"83011000"},
      {sku:"2.CAD.45",label:"45mm",tiers:[{minQty:10,label:"10",price:2.8}, {minQty:50,label:"50",price:2.52}, {minQty:100,label:"100",price:2.3}, {minQty:500,label:"500",price:2.02}],weight:"A consultar",ncm:"83011000"},
      {sku:"2.CAD.50",label:"50mm",tiers:[{minQty:10,label:"10",price:79.44}, {minQty:50,label:"50",price:71.5}, {minQty:100,label:"100",price:65.14}, {minQty:500,label:"500",price:57.2}],weight:"A consultar",ncm:"83011000"},
      {sku:"2.CAD.60",label:"60mm",tiers:[{minQty:10,label:"10",price:2.8}, {minQty:50,label:"50",price:2.52}, {minQty:100,label:"100",price:2.3}, {minQty:500,label:"500",price:2.02}],weight:"A consultar",ncm:"83011000"},
      {sku:"2.CAD.70",label:"70mm",tiers:[{minQty:10,label:"10",price:2.8}, {minQty:50,label:"50",price:2.52}, {minQty:100,label:"100",price:2.3}, {minQty:500,label:"500",price:2.02}],weight:"A consultar",ncm:"83011000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.ROD.COMT",
    slug:"3-rod-comt",
    name:"Rodízio",
    description:"Rodízio · Com trava · 35mm",
    category:"Ferragens",
    subcategory:"Rodízios",
    brand:"Renna",
    supplier:"Renna",
    keywords:["rodízio","com trava","35mm","50mm"],
    variations:[
      {sku:"3.ROD.COMT.35",label:"Com trava · 35mm",tiers:[{minQty:10,label:"10",price:7.21}, {minQty:50,label:"50",price:6.49}, {minQty:100,label:"100",price:5.91}, {minQty:500,label:"500",price:5.19}],weight:"A consultar",ncm:"83022000"},
      {sku:"3.ROD.COMT.50",label:"Com trava · 50mm",tiers:[{minQty:10,label:"10",price:8.75}, {minQty:50,label:"50",price:7.88}, {minQty:100,label:"100",price:7.17}, {minQty:500,label:"500",price:6.3}],weight:"A consultar",ncm:"83022000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.ROD.SEMT",
    slug:"3-rod-semt",
    name:"Rodízio",
    description:"Rodízio · Sem trava · 35mm",
    category:"Ferragens",
    subcategory:"Rodízios",
    brand:"Renna",
    supplier:"Renna",
    keywords:["rodízio","sem trava","35mm","50mm"],
    variations:[
      {sku:"3.ROD.SEMT.35",label:"Sem trava · 35mm",tiers:[{minQty:10,label:"10",price:5.81}, {minQty:50,label:"50",price:5.23}, {minQty:100,label:"100",price:4.76}, {minQty:500,label:"500",price:4.18}],weight:"A consultar",ncm:"83022000"},
      {sku:"3.ROD.SEMT.50",label:"Sem trava · 50mm",tiers:[{minQty:10,label:"10",price:6.9}, {minQty:50,label:"50",price:6.21}, {minQty:100,label:"100",price:5.66}, {minQty:500,label:"500",price:4.97}],weight:"A consultar",ncm:"83022000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.TPOR",
    slug:"3-tpor",
    name:"Trava Porta Magnético",
    description:"Trava Porta Magnético · Longo",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Renna",
    supplier:"Renna",
    keywords:["trava porta magnético","longo","slim","trava porta de piso","clássico"],
    variations:[
      {sku:"3.TPOR.LONG",label:"Longo",tiers:[{minQty:10,label:"10",price:23.81}, {minQty:50,label:"50",price:21.43}, {minQty:100,label:"100",price:19.52}, {minQty:500,label:"500",price:17.14}],weight:"A consultar",ncm:"83024100"},
      {sku:"3.TPOR.SLIM",label:"Slim",tiers:[{minQty:10,label:"10",price:18.99}, {minQty:50,label:"50",price:17.09}, {minQty:100,label:"100",price:15.57}, {minQty:500,label:"500",price:13.67}],weight:"A consultar",ncm:"83024100"},
      {sku:"3.TPOR.PISO",label:"Trava Porta de piso · Clássico",tiers:[{minQty:10,label:"10",price:13.86}, {minQty:50,label:"50",price:12.47}, {minQty:100,label:"100",price:11.37}, {minQty:500,label:"500",price:9.98}],weight:"A consultar",ncm:"83024100"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.MET",
    slug:"3-met",
    name:"Metro Sueco de Madeira",
    description:"Metro Sueco de Madeira",
    category:"Ferramentas",
    subcategory:"Medição",
    brand:"Renna",
    supplier:"Renna",
    keywords:["metro sueco de madeira"],
    variations:[
      {sku:"3.MET.SUECO",label:"SUECO",tiers:[{minQty:10,label:"10",price:37.91}, {minQty:50,label:"50",price:34.12}, {minQty:100,label:"100",price:31.09}, {minQty:500,label:"500",price:27.3}],weight:"A consultar",ncm:"90178010"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.CONEC",
    slug:"3-conec",
    name:"Conector de Emenda",
    description:"Conector de Emenda · Engate Rápido",
    category:"Elétrica",
    subcategory:"Conectores",
    brand:"Renna",
    supplier:"Renna",
    keywords:["conector de emenda","engate rápido"],
    variations:[
      {sku:"3.CONEC.DUP",label:"Engate Rápido",tiers:[{minQty:10,label:"10",price:2.93}, {minQty:50,label:"50",price:2.64}, {minQty:100,label:"100",price:2.4}, {minQty:500,label:"500",price:2.11}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.PIS.BR",
    slug:"3-pis-br",
    name:"Pistão Fit",
    description:"Pistão Fit · 40N · Branco",
    category:"Ferragens",
    subcategory:"Pistões",
    brand:"Renna",
    supplier:"Renna",
    keywords:["pistão fit","40n","branco","60n","80n","100n","120n","150n","180n"],
    variations:[
      {sku:"3.PIS.BR.40",label:"40N · Branco",tiers:[{minQty:10,label:"10",price:6.57}, {minQty:50,label:"50",price:5.91}, {minQty:100,label:"100",price:5.39}, {minQty:500,label:"500",price:4.73}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.BR.60",label:"60N · Branco",tiers:[{minQty:10,label:"10",price:6.57}, {minQty:50,label:"50",price:5.91}, {minQty:100,label:"100",price:5.39}, {minQty:500,label:"500",price:4.73}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.BR.80",label:"80N · Branco",tiers:[{minQty:10,label:"10",price:7.3}, {minQty:50,label:"50",price:6.57}, {minQty:100,label:"100",price:5.99}, {minQty:500,label:"500",price:5.26}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.BR.100",label:"100N · Branco",tiers:[{minQty:10,label:"10",price:7.3}, {minQty:50,label:"50",price:6.57}, {minQty:100,label:"100",price:5.99}, {minQty:500,label:"500",price:5.26}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.BR.120",label:"120N · Branco",tiers:[{minQty:10,label:"10",price:7.3}, {minQty:50,label:"50",price:6.57}, {minQty:100,label:"100",price:5.99}, {minQty:500,label:"500",price:5.26}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.BR.150",label:"150N · Branco",tiers:[{minQty:10,label:"10",price:7.18}, {minQty:50,label:"50",price:6.46}, {minQty:100,label:"100",price:5.89}, {minQty:500,label:"500",price:5.17}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.BR.180",label:"180N · Branco",tiers:[{minQty:10,label:"10",price:7.18}, {minQty:50,label:"50",price:6.46}, {minQty:100,label:"100",price:5.89}, {minQty:500,label:"500",price:5.17}],weight:"A consultar",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.PIS.CZ",
    slug:"3-pis-cz",
    name:"Pistão Fit",
    description:"Pistão Fit · 40N · Cinza",
    category:"Ferragens",
    subcategory:"Pistões",
    brand:"Renna",
    supplier:"Renna",
    keywords:["pistão fit","40n","cinza","60n","80n","100n","120n","150n"],
    variations:[
      {sku:"3.PIS.CZ.40",label:"40N · Cinza",tiers:[{minQty:10,label:"10",price:6.57}, {minQty:50,label:"50",price:5.91}, {minQty:100,label:"100",price:5.39}, {minQty:500,label:"500",price:4.73}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.CZ.60",label:"60N · Cinza",tiers:[{minQty:10,label:"10",price:6.57}, {minQty:50,label:"50",price:5.91}, {minQty:100,label:"100",price:5.39}, {minQty:500,label:"500",price:4.73}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.CZ.80",label:"80N · Cinza",tiers:[{minQty:10,label:"10",price:7.3}, {minQty:50,label:"50",price:6.57}, {minQty:100,label:"100",price:5.99}, {minQty:500,label:"500",price:5.26}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.CZ.100",label:"100N · Cinza",tiers:[{minQty:10,label:"10",price:7.18}, {minQty:50,label:"50",price:6.46}, {minQty:100,label:"100",price:5.89}, {minQty:500,label:"500",price:5.17}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.CZ.120",label:"120N · Cinza",tiers:[{minQty:10,label:"10",price:6.57}, {minQty:50,label:"50",price:5.91}, {minQty:100,label:"100",price:5.39}, {minQty:500,label:"500",price:4.73}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.CZ.150",label:"150N · Cinza",tiers:[{minQty:10,label:"10",price:8.79}, {minQty:50,label:"50",price:7.91}, {minQty:100,label:"100",price:7.21}, {minQty:500,label:"500",price:6.33}],weight:"A consultar",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.DOB.AMORT",
    slug:"3-dob-amort",
    name:"Dobradiça Com Amortecedor Curva",
    description:"Dobradiça Com Amortecedor Curva · 35mm",
    category:"Ferragens",
    subcategory:"Dobradiças",
    brand:"Renna",
    supplier:"Renna",
    keywords:["dobradiça com amortecedor curva","35mm","dobradiça com amortecedor reta"],
    variations:[
      {sku:"3.DOB.AMORT.CUR",label:"35mm",tiers:[{minQty:10,label:"10",price:3.15}, {minQty:50,label:"50",price:2.83}, {minQty:100,label:"100",price:2.58}, {minQty:500,label:"500",price:2.27}],weight:"A consultar",ncm:"83021000"},
      {sku:"3.DOB.AMORT.RET",label:"Dobradiça Com Amortecedor Reta · 35mm",tiers:[{minQty:10,label:"10",price:3.1}, {minQty:50,label:"50",price:2.79}, {minQty:100,label:"100",price:2.54}, {minQty:500,label:"500",price:2.23}],weight:"A consultar",ncm:"83021000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.FEC.BATENT",
    slug:"3-fec-batent",
    name:"Fechadura com Batente",
    description:"Fechadura com Batente · 22mm",
    category:"Ferragens",
    subcategory:"Fechaduras",
    brand:"Renna",
    supplier:"Renna",
    keywords:["fechadura com batente","22mm","31mm"],
    variations:[
      {sku:"3.FEC.BATENT.22MM",label:"22mm",tiers:[{minQty:10,label:"10",price:7.19}, {minQty:50,label:"50",price:6.47}, {minQty:100,label:"100",price:5.9}, {minQty:500,label:"500",price:5.18}],weight:"A consultar",ncm:"83013000"},
      {sku:"3.FEC.BATENT.31MM",label:"31mm",tiers:[{minQty:10,label:"10",price:7.82}, {minQty:50,label:"50",price:7.04}, {minQty:100,label:"100",price:6.41}, {minQty:500,label:"500",price:5.63}],weight:"A consultar",ncm:"83013000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.PUX.CONCH",
    slug:"3-pux-conch",
    name:"Puxador",
    description:"Puxador · Paris · 96mm · Aço Escovado",
    category:"Ferragens",
    subcategory:"Puxadores",
    brand:"Renna",
    supplier:"Renna",
    keywords:["puxador","paris","96mm","aço escovado"],
    variations:[
      {sku:"3.PUX.CONCH.AÇOESC",label:"96mm · Aço Escovado",tiers:[{minQty:10,label:"10",price:19.33}, {minQty:50,label:"50",price:17.4}, {minQty:100,label:"100",price:15.85}, {minQty:500,label:"500",price:13.92}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.CORR.LARG",
    slug:"3-corr-larg",
    name:"Corrediça Telescópica",
    description:"Corrediça Telescópica · 45mm · 25cm",
    category:"Ferragens",
    subcategory:"Corrediças",
    brand:"Renna",
    supplier:"Renna",
    keywords:["corrediça telescópica","45mm","25cm","30cm","35cm","40cm"],
    variations:[
      {sku:"3.CORR.LARG.25CM",label:"45mm · 25cm",tiers:[{minQty:10,label:"10",price:12.64}, {minQty:50,label:"50",price:11.38}, {minQty:100,label:"100",price:10.36}, {minQty:500,label:"500",price:9.1}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.CORR.LARG.30CM",label:"45mm · 30cm",tiers:[{minQty:10,label:"10",price:15.79}, {minQty:50,label:"50",price:14.21}, {minQty:100,label:"100",price:12.95}, {minQty:500,label:"500",price:11.37}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.CORR.LARG.35CM",label:"45mm · 35cm",tiers:[{minQty:10,label:"10",price:18.11}, {minQty:50,label:"50",price:16.3}, {minQty:100,label:"100",price:14.85}, {minQty:500,label:"500",price:13.04}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.CORR.LARG.40CM",label:"45mm · 40cm",tiers:[{minQty:10,label:"10",price:19.82}, {minQty:50,label:"50",price:17.84}, {minQty:100,label:"100",price:16.25}, {minQty:500,label:"500",price:14.27}],weight:"A consultar",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.PUX.31",
    slug:"3-pux-31",
    name:"Puxador PUX",
    description:"Puxador PUX · Redondo 31,5mm| Cromado",
    category:"Ferragens",
    subcategory:"Puxadores",
    brand:"Renna",
    supplier:"Renna",
    keywords:["puxador pux","redondo 31,5mm| cromado","redondo 31,5mm| dourado","redondo 31,5mm| preto fosco","redondo 31,5mm| escovado"],
    variations:[
      {sku:"3.PUX.31.CRO",label:"Redondo 31,5mm| Cromado",tiers:[{minQty:10,label:"10",price:10.11}, {minQty:50,label:"50",price:9.1}, {minQty:100,label:"100",price:8.29}, {minQty:500,label:"500",price:7.28}],weight:"A consultar",ncm:""},
      {sku:"3.PUX.31.DO",label:"Redondo 31,5mm| Dourado",tiers:[{minQty:10,label:"10",price:10.08}, {minQty:50,label:"50",price:9.07}, {minQty:100,label:"100",price:8.27}, {minQty:500,label:"500",price:7.26}],weight:"A consultar",ncm:""},
      {sku:"3.PUX.31.PT",label:"Redondo 31,5mm| Preto Fosco",tiers:[{minQty:10,label:"10",price:9.48}, {minQty:50,label:"50",price:8.53}, {minQty:100,label:"100",price:7.77}, {minQty:500,label:"500",price:6.83}],weight:"A consultar",ncm:""},
      {sku:"3.PUX.31.ESC",label:"Redondo 31,5mm| Escovado",tiers:[{minQty:10,label:"10",price:10.1}, {minQty:50,label:"50",price:9.09}, {minQty:100,label:"100",price:8.28}, {minQty:500,label:"500",price:7.27}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.SPOT.QUAD",
    slug:"3-spot-quad",
    name:"Spot Lumini",
    description:"Spot Lumini · Quadrado · 1w 6000k · Cromado",
    category:"Elétrica",
    subcategory:"Iluminação",
    brand:"Renna",
    supplier:"Renna",
    keywords:["spot lumini","quadrado","1w 6000k","cromado"],
    variations:[
      {sku:"3.SPOT.QUAD.CROM",label:"1w 6000k · Cromado",tiers:[{minQty:10,label:"10",price:8.98}, {minQty:50,label:"50",price:8.08}, {minQty:100,label:"100",price:7.36}, {minQty:500,label:"500",price:6.47}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.PUX.LONG.96",
    slug:"3-pux-long-96",
    name:"Puxador",
    description:"Puxador · Haste Inox · Redondo · 96mm · 15cm",
    category:"Ferragens",
    subcategory:"Puxadores",
    brand:"Renna",
    supplier:"Renna",
    keywords:["puxador","haste inox","redondo","96mm","15cm"],
    variations:[
      {sku:"3.PUX.LONG.96.AÇOESC",label:"96mm · 15cm",tiers:[{minQty:10,label:"10",price:4.35}, {minQty:50,label:"50",price:3.91}, {minQty:100,label:"100",price:3.57}, {minQty:500,label:"500",price:3.13}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.PUX.LONG.128",
    slug:"3-pux-long-128",
    name:"Puxador",
    description:"Puxador · Haste Inox · Redondo · 128mm · 20cm",
    category:"Ferragens",
    subcategory:"Puxadores",
    brand:"Renna",
    supplier:"Renna",
    keywords:["puxador","haste inox","redondo","128mm","20cm"],
    variations:[
      {sku:"3.PUX.LONG.128.AÇOESC",label:"128mm · 20cm",tiers:[{minQty:10,label:"10",price:5.08}, {minQty:50,label:"50",price:4.57}, {minQty:100,label:"100",price:4.17}, {minQty:500,label:"500",price:3.66}],weight:"A consultar",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.PUX.LONG.160",
    slug:"3-pux-long-160",
    name:"Puxador",
    description:"Puxador · Haste Inox · Redondo · 160mm · 25cm",
    category:"Ferragens",
    subcategory:"Puxadores",
    brand:"Renna",
    supplier:"Renna",
    keywords:["puxador","haste inox","redondo","160mm","25cm"],
    variations:[
      {sku:"3.PUX.LONG.160.AÇOESC",label:"160mm · 25cm",tiers:[{minQty:10,label:"10",price:5.85}, {minQty:50,label:"50",price:5.26}, {minQty:100,label:"100",price:4.8}, {minQty:500,label:"500",price:4.21}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.PUX.LONG.192",
    slug:"3-pux-long-192",
    name:"Puxador",
    description:"Puxador · Haste Inox · Redondo · 192mm · 30cm",
    category:"Ferragens",
    subcategory:"Puxadores",
    brand:"Renna",
    supplier:"Renna",
    keywords:["puxador","haste inox","redondo","192mm","30cm"],
    variations:[
      {sku:"3.PUX.LONG.192.AÇOESC",label:"192mm · 30cm",tiers:[{minQty:10,label:"10",price:6.48}, {minQty:50,label:"50",price:5.83}, {minQty:100,label:"100",price:5.31}, {minQty:500,label:"500",price:4.67}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"4.LA",
    slug:"4-la",
    name:"Boina de Lã",
    description:"Boina de Lã · 125mm (Compel)",
    category:"Abrasivos",
    subcategory:"Discos Especiais",
    brand:"Starfer",
    supplier:"Starfer",
    keywords:["boina de lã","125mm (compel)"],
    variations:[
      {sku:"4.LA.125",label:"125mm (Compel)",tiers:[{minQty:10,label:"10",price:19.18}, {minQty:50,label:"50",price:17.26}, {minQty:100,label:"100",price:15.73}, {minQty:500,label:"500",price:13.81}],weight:"A consultar",ncm:"96039000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"4.M14",
    slug:"4-m14",
    name:"Disco de Lixa",
    description:"Disco de Lixa · M14 · 125mm",
    category:"Abrasivos",
    subcategory:"Discos de Lixa",
    brand:"Starfer",
    supplier:"Starfer",
    keywords:["disco de lixa","m14","125mm"],
    variations:[
      {sku:"4.M14.125",label:"M14 · 125mm",tiers:[{minQty:10,label:"10",price:19.63}, {minQty:50,label:"50",price:17.67}, {minQty:100,label:"100",price:16.1}, {minQty:500,label:"500",price:14.13}],weight:"A consultar",ncm:"84679200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"4.FEC.VITRIN",
    slug:"4-fec-vitrin",
    name:"Fechadura Para Vitrine",
    description:"Fechadura Para Vitrine · 140mm",
    category:"Ferragens",
    subcategory:"Fechaduras",
    brand:"Starfer",
    supplier:"Starfer",
    keywords:["fechadura para vitrine","140mm"],
    variations:[
      {sku:"4.FEC.VITRIN.140",label:"140mm",tiers:[{minQty:10,label:"10",price:31.66}, {minQty:50,label:"50",price:28.49}, {minQty:100,label:"100",price:25.96}, {minQty:500,label:"500",price:22.8}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"4.DISC.POL",
    slug:"4-disc-pol",
    name:"Disco para Polimento de Vidro",
    description:"Disco para Polimento de Vidro · 5pol",
    category:"Abrasivos",
    subcategory:"Discos Especiais",
    brand:"Starfer",
    supplier:"Starfer",
    keywords:["disco para polimento de vidro","5\""],
    variations:[
      {sku:"4.DISC.POL.5",label:"5\"",tiers:[{minQty:10,label:"10",price:32.16}, {minQty:50,label:"50",price:28.94}, {minQty:100,label:"100",price:26.37}, {minQty:500,label:"500",price:23.16}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"4.FEC.ROLET",
    slug:"4-fec-rolet",
    name:"Fecho Rolete",
    description:"Fecho Rolete · Zincado",
    category:"Ferragens",
    subcategory:"Fechos",
    brand:"Starfer",
    supplier:"Starfer",
    keywords:["fecho rolete","zincado"],
    variations:[
      {sku:"4.FEC.ROLET.PR",label:"Zincado",tiers:[{minQty:10,label:"10",price:3.06}, {minQty:50,label:"50",price:2.75}, {minQty:100,label:"100",price:2.51}, {minQty:500,label:"500",price:2.2}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"4.DISC.125.BR",
    slug:"4-disc-125-br",
    name:"Disco de Lixa",
    description:"Disco de Lixa · Pluma · Branco · Grão 220",
    category:"Abrasivos",
    subcategory:"Discos de Lixa",
    brand:"Starfer",
    supplier:"Starfer",
    keywords:["disco de lixa","pluma","branco","grão 220","grão 320"],
    variations:[
      {sku:"4.DISC.125.BR.220",label:"Branco · Grão 220",tiers:[{minQty:10,label:"10",price:1.9}, {minQty:50,label:"50",price:1.71}, {minQty:100,label:"100",price:1.56}, {minQty:500,label:"500",price:1.37}],weight:"A consultar",ncm:"68053090"},
      {sku:"4.DISC.125.BR.320",label:"Branco · Grão 320",tiers:[{minQty:10,label:"10",price:1.9}, {minQty:50,label:"50",price:1.71}, {minQty:100,label:"100",price:1.56}, {minQty:500,label:"500",price:1.37}],weight:"A consultar",ncm:"68053090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"5.BUCHA.C",
    slug:"5-bucha-c",
    name:"Bucha comum",
    description:"Bucha comum · 100 Peças · 5mm",
    category:"Fixação",
    subcategory:"Buchas",
    brand:"Ivplast",
    supplier:"Ivplast",
    keywords:["bucha comum","100 peças","5mm","pacote","6mm","8mm"],
    variations:[
      {sku:"5.BUCHA.C.5",label:"100 Peças · 5mm",tiers:[{minQty:10,label:"10",price:2.38}, {minQty:50,label:"50",price:2.14}, {minQty:100,label:"100",price:1.95}, {minQty:500,label:"500",price:1.71}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUCHA.C.5_PCT",label:"Pacote · 5mm",tiers:[{minQty:10,label:"10",price:23.83}, {minQty:50,label:"50",price:21.45}, {minQty:100,label:"100",price:19.54}, {minQty:500,label:"500",price:17.16}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUCHA.C.6",label:"100 Peças · 6mm",tiers:[{minQty:10,label:"10",price:2.26}, {minQty:50,label:"50",price:2.03}, {minQty:100,label:"100",price:1.85}, {minQty:500,label:"500",price:1.63}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUCHA.C.6_PCT",label:"Pacote · 6mm",tiers:[{minQty:10,label:"10",price:22.6}, {minQty:50,label:"50",price:20.34}, {minQty:100,label:"100",price:18.53}, {minQty:500,label:"500",price:16.27}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUCHA.C.8",label:"100 Peças · 8mm",tiers:[{minQty:10,label:"10",price:3.97}, {minQty:50,label:"50",price:3.57}, {minQty:100,label:"100",price:3.26}, {minQty:500,label:"500",price:2.86}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUCHA.C.8_PCT",label:"Pacote · 8mm",tiers:[{minQty:10,label:"10",price:39.68}, {minQty:50,label:"50",price:35.71}, {minQty:100,label:"100",price:32.54}, {minQty:500,label:"500",price:28.57}],weight:"A consultar",ncm:"39259090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"5.BUCHA.PER",
    slug:"5-bucha-per",
    name:"Bucha Perfix",
    description:"Bucha Perfix · 100 Peças · 10mm",
    category:"Fixação",
    subcategory:"Buchas",
    brand:"Ivplast",
    supplier:"Ivplast",
    keywords:["bucha perfix","100 peças","10mm","pacote","6mm","8mm"],
    variations:[
      {sku:"5.BUCHA.PER.10",label:"100 Peças · 10mm",tiers:[{minQty:10,label:"10",price:19.47}, {minQty:50,label:"50",price:17.52}, {minQty:100,label:"100",price:15.97}, {minQty:500,label:"500",price:14.02}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUCHA.PER.10_PCT",label:"Pacote · 10mm",tiers:[{minQty:10,label:"10",price:48.66}, {minQty:50,label:"50",price:43.79}, {minQty:100,label:"100",price:39.9}, {minQty:500,label:"500",price:35.04}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUCHA.PER.6",label:"100 Peças · 6mm",tiers:[{minQty:10,label:"10",price:7.49}, {minQty:50,label:"50",price:6.74}, {minQty:100,label:"100",price:6.14}, {minQty:500,label:"500",price:5.39}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUCHA.PER.6_PCT",label:"Pacote · 6mm",tiers:[{minQty:10,label:"10",price:37.44}, {minQty:50,label:"50",price:33.7}, {minQty:100,label:"100",price:30.7}, {minQty:500,label:"500",price:26.96}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUCHA.PER.8",label:"100 Peças · 8mm",tiers:[{minQty:10,label:"10",price:13.55}, {minQty:50,label:"50",price:12.2}, {minQty:100,label:"100",price:11.11}, {minQty:500,label:"500",price:9.76}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUCHA.PER.8_PCT",label:"Pacote · 8mm",tiers:[{minQty:10,label:"10",price:67.76}, {minQty:50,label:"50",price:60.98}, {minQty:100,label:"100",price:55.56}, {minQty:500,label:"500",price:48.79}],weight:"A consultar",ncm:"39259090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"5.BUC.GDP",
    slug:"5-buc-gdp",
    name:"Bucha GDP",
    description:"Bucha GDP · 4mm a 16mm · 250 Pçs",
    category:"Fixação",
    subcategory:"Buchas",
    brand:"Ivplast",
    supplier:"Ivplast",
    keywords:["bucha gdp","4mm a 16mm","250 pçs","100 pçs","15mm a 23mm"],
    variations:[
      {sku:"5.BUC.GDP.4A16_PCT",label:"4mm a 16mm · 250 Pçs",tiers:[{minQty:10,label:"10",price:66.3}, {minQty:50,label:"50",price:59.67}, {minQty:100,label:"100",price:54.37}, {minQty:500,label:"500",price:47.74}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUC.GDP.4A16",label:"4mm a 16mm · 100 Pçs",tiers:[{minQty:10,label:"10",price:26.52}, {minQty:50,label:"50",price:23.87}, {minQty:100,label:"100",price:21.75}, {minQty:500,label:"500",price:19.09}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUC.GDP.2_PCT",label:"15mm a 23mm · 250 Pçs",tiers:[{minQty:10,label:"10",price:84.0}, {minQty:50,label:"50",price:75.6}, {minQty:100,label:"100",price:68.88}, {minQty:500,label:"500",price:60.48}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUC.GDP.2",label:"15mm a 23mm · 100 Pçs",tiers:[{minQty:10,label:"10",price:33.6}, {minQty:50,label:"50",price:30.24}, {minQty:100,label:"100",price:27.55}, {minQty:500,label:"500",price:24.19}],weight:"A consultar",ncm:"39259090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"6.GAN.LV",
    slug:"6-gan-lv",
    name:"Gancho de Rede",
    description:"Gancho de Rede · Dourado",
    category:"Fixação",
    subcategory:"Ganchos",
    brand:"RCA",
    supplier:"RCA",
    keywords:["gancho de rede","dourado","preto","zincado","branco"],
    variations:[
      {sku:"6.GAN.LV.DO",label:"Dourado",tiers:[{minQty:10,label:"10",price:16.41}, {minQty:50,label:"50",price:14.77}, {minQty:100,label:"100",price:13.46}, {minQty:500,label:"500",price:11.82}],weight:"A consultar",ncm:"73269090"},
      {sku:"6.GAN.LV.PT",label:"Preto",tiers:[{minQty:10,label:"10",price:19.26}, {minQty:50,label:"50",price:17.33}, {minQty:100,label:"100",price:15.79}, {minQty:500,label:"500",price:13.87}],weight:"A consultar",ncm:"73269090"},
      {sku:"6.GAN.LV.ZC",label:"Zincado",tiers:[{minQty:10,label:"10",price:16.41}, {minQty:50,label:"50",price:14.77}, {minQty:100,label:"100",price:13.46}, {minQty:500,label:"500",price:11.82}],weight:"A consultar",ncm:"73269090"},
      {sku:"6.GAN.LV.BR",label:"Branco",tiers:[{minQty:10,label:"10",price:19.26}, {minQty:50,label:"50",price:17.33}, {minQty:100,label:"100",price:15.79}, {minQty:500,label:"500",price:13.87}],weight:"A consultar",ncm:"73269090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"6.MAOF.BR",
    slug:"6-maof-br",
    name:"Mão Francesa Leve",
    description:"Mão Francesa Leve · Branca · 20cm",
    category:"Ferragens",
    subcategory:"Mãos Francesas",
    brand:"RCA",
    supplier:"RCA",
    keywords:["mão francesa leve","branca","20cm","25cm","30cm"],
    variations:[
      {sku:"6.MAOF.BR.20",label:"Branca · 20cm",tiers:[{minQty:10,label:"10",price:5.49}, {minQty:50,label:"50",price:4.94}, {minQty:100,label:"100",price:4.5}, {minQty:500,label:"500",price:3.95}],weight:"A consultar",ncm:"72162100"},
      {sku:"6.MAOF.BR.25",label:"Branca · 25cm",tiers:[{minQty:10,label:"10",price:6.8}, {minQty:50,label:"50",price:6.12}, {minQty:100,label:"100",price:5.58}, {minQty:500,label:"500",price:4.9}],weight:"A consultar",ncm:"72162100"},
      {sku:"6.MAOF.BR.30",label:"Branca · 30cm",tiers:[{minQty:10,label:"10",price:7.76}, {minQty:50,label:"50",price:6.98}, {minQty:100,label:"100",price:6.36}, {minQty:500,label:"500",price:5.59}],weight:"A consultar",ncm:"72162100"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"6.MAOF.PT",
    slug:"6-maof-pt",
    name:"Mão Francesa Leve",
    description:"Mão Francesa Leve · Preta · 20cm",
    category:"Ferragens",
    subcategory:"Mãos Francesas",
    brand:"RCA",
    supplier:"RCA",
    keywords:["mão francesa leve","preta","20cm","25cm","30cm"],
    variations:[
      {sku:"6.MAOF.PT.20",label:"Preta · 20cm",tiers:[{minQty:10,label:"10",price:5.49}, {minQty:50,label:"50",price:4.94}, {minQty:100,label:"100",price:4.5}, {minQty:500,label:"500",price:3.95}],weight:"A consultar",ncm:"72162100"},
      {sku:"6.MAOF.PT.25",label:"Preta · 25cm",tiers:[{minQty:10,label:"10",price:6.8}, {minQty:50,label:"50",price:6.12}, {minQty:100,label:"100",price:5.58}, {minQty:500,label:"500",price:4.9}],weight:"A consultar",ncm:"72162100"},
      {sku:"6.MAOF.PT.30",label:"Preta · 30cm",tiers:[{minQty:10,label:"10",price:7.76}, {minQty:50,label:"50",price:6.98}, {minQty:100,label:"100",price:6.36}, {minQty:500,label:"500",price:5.59}],weight:"A consultar",ncm:"72162100"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"7.PF.3.5",
    slug:"7-pf-3-5",
    name:"Parafuso",
    description:"Parafuso · Philips · Minichipboard · 3,5 x 14mm",
    category:"Fixação",
    subcategory:"Parafusos",
    brand:"Jomarca",
    supplier:"Jomarca",
    keywords:["parafuso","philips","minichipboard","3,5 x 14mm"],
    variations:[
      {sku:"7.PF.3.5.14",label:"Minichipboard · 3,5 x 14mm",tiers:[{minQty:10,label:"10",price:4.26}, {minQty:50,label:"50",price:3.83}, {minQty:100,label:"100",price:3.49}, {minQty:500,label:"500",price:3.07}],weight:"A consultar",ncm:"73181200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"7.PF.3.16",
    slug:"7-pf-3-16",
    name:"Parafuso",
    description:"Parafuso · Sextavado · 3/16 x 40mm",
    category:"Fixação",
    subcategory:"Parafusos",
    brand:"Jomarca",
    supplier:"Jomarca",
    keywords:["parafuso","sextavado","3/16 x 40mm"],
    variations:[
      {sku:"7.PF.3.16.40",label:"Sextavado · 3/16 x 40mm",tiers:[{minQty:10,label:"10",price:27.99}, {minQty:50,label:"50",price:25.19}, {minQty:100,label:"100",price:22.95}, {minQty:500,label:"500",price:20.15}],weight:"A consultar",ncm:"73181200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"7.PF.4.5",
    slug:"7-pf-4-5",
    name:"Parafuso",
    description:"Parafuso · Philips · 4,5 x 50mm",
    category:"Fixação",
    subcategory:"Parafusos",
    brand:"Jomarca",
    supplier:"Jomarca",
    keywords:["parafuso","philips","4,5 x 50mm"],
    variations:[
      {sku:"7.PF.4.5.50",label:"Philips · 4,5 x 50mm",tiers:[{minQty:10,label:"10",price:21.04}, {minQty:50,label:"50",price:18.94}, {minQty:100,label:"100",price:17.25}, {minQty:500,label:"500",price:15.15}],weight:"A consultar",ncm:"73181200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"7.PF.5.0",
    slug:"7-pf-5-0",
    name:"Parafuso",
    description:"Parafuso · Philips · 5,0 x 40mm",
    category:"Fixação",
    subcategory:"Parafusos",
    brand:"Jomarca",
    supplier:"Jomarca",
    keywords:["parafuso","philips","5,0 x 40mm"],
    variations:[
      {sku:"7.PF.5.0.40",label:"Philips · 5,0 x 40mm",tiers:[{minQty:10,label:"10",price:19.94}, {minQty:50,label:"50",price:17.95}, {minQty:100,label:"100",price:16.35}, {minQty:500,label:"500",price:14.36}],weight:"A consultar",ncm:"73181200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"8.MINI",
    slug:"8-mini",
    name:"Mini Balança Digital",
    description:"Mini Balança Digital · Preto · 0,1g até 500g",
    category:"Ferramentas",
    subcategory:"Medição",
    brand:"Utimix",
    supplier:"Utimix",
    keywords:["mini balança digital","preto","0,1g até 500g"],
    variations:[
      {sku:"8.MINI.BAL",label:"Preto · 0,1g até 500g",tiers:[{minQty:10,label:"10",price:36.37}, {minQty:50,label:"50",price:32.73}, {minQty:100,label:"100",price:29.82}, {minQty:500,label:"500",price:26.19}],weight:"A consultar",ncm:"84231000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"8.BAL.BOLS",
    slug:"8-bal-bols",
    name:"Balança de Bolso",
    description:"Balança de Bolso · Prata · 0,1 até 500g",
    category:"Ferramentas",
    subcategory:"Medição",
    brand:"Utimix",
    supplier:"Utimix",
    keywords:["balança de bolso","prata","0,1 até 500g"],
    variations:[
      {sku:"8.BAL.BOLS.PR",label:"Prata · 0,1 até 500g",tiers:[{minQty:10,label:"10",price:37.8}, {minQty:50,label:"50",price:34.02}, {minQty:100,label:"100",price:31.0}, {minQty:500,label:"500",price:27.22}],weight:"A consultar",ncm:"84231000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"8.PORT.PAP",
    slug:"8-port-pap",
    name:"Porta Papel Higiênico",
    description:"Porta Papel Higiênico · Tampa de Bambu",
    category:"Utilidades",
    subcategory:"Banheiro",
    brand:"Utimix",
    supplier:"Utimix",
    keywords:["porta papel higiênico","tampa de bambu"],
    variations:[
      {sku:"8.PORT.PAP.BAMB",label:"Tampa de Bambu",tiers:[{minQty:10,label:"10",price:33.57}, {minQty:50,label:"50",price:30.21}, {minQty:100,label:"100",price:27.53}, {minQty:500,label:"500",price:24.17}],weight:"A consultar",ncm:"46021100"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"8.PORT.LEN",
    slug:"8-port-len",
    name:"Porta Lenço Retangular",
    description:"Porta Lenço Retangular · Tampa de Bambu",
    category:"Utilidades",
    subcategory:"Banheiro",
    brand:"Utimix",
    supplier:"Utimix",
    keywords:["porta lenço retangular","tampa de bambu"],
    variations:[
      {sku:"8.PORT.LEN.BAMB",label:"Tampa de Bambu",tiers:[{minQty:10,label:"10",price:33.57}, {minQty:50,label:"50",price:30.21}, {minQty:100,label:"100",price:27.53}, {minQty:500,label:"500",price:24.17}],weight:"A consultar",ncm:"46021100"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"9.BOLS.TER",
    slug:"9-bols-ter",
    name:"Bolsa Térmica",
    description:"Bolsa Térmica · Grande · 650ml",
    category:"Utilidades",
    subcategory:"Organização",
    brand:"Termogel",
    supplier:"Termogel",
    keywords:["bolsa térmica","grande","650ml"],
    variations:[
      {sku:"9.BOLS.TER.GRA",label:"Grande · 650ml",tiers:[{minQty:10,label:"10",price:26.39}, {minQty:50,label:"50",price:23.75}, {minQty:100,label:"100",price:21.64}, {minQty:500,label:"500",price:19.0}],weight:"A consultar",ncm:"39123119"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"9.BOLS.TERM",
    slug:"9-bols-term",
    name:"Bolsa Térmica",
    description:"Bolsa Térmica · Pequena · 350ml",
    category:"Utilidades",
    subcategory:"Organização",
    brand:"Termogel",
    supplier:"Termogel",
    keywords:["bolsa térmica","pequena","350ml"],
    variations:[
      {sku:"9.BOLS.TERM.PEQ",label:"Pequena · 350ml",tiers:[{minQty:10,label:"10",price:14.36}, {minQty:50,label:"50",price:12.92}, {minQty:100,label:"100",price:11.78}, {minQty:500,label:"500",price:10.34}],weight:"A consultar",ncm:"39123119"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"10.DOB.AMORT",
    slug:"10-dob-amort",
    name:"Dobradiça Com Amortecedor Curva",
    description:"Dobradiça Com Amortecedor Curva · 35mm",
    category:"Ferragens",
    subcategory:"Dobradiças",
    brand:"HD",
    supplier:"HD",
    keywords:["dobradiça com amortecedor curva","35mm","dobradiça com amortecedor reta"],
    variations:[
      {sku:"10.DOB.AMORT.CUR",label:"35mm",tiers:[{minQty:10,label:"10",price:3.7}, {minQty:50,label:"50",price:3.33}, {minQty:100,label:"100",price:3.03}, {minQty:500,label:"500",price:2.66}],weight:"A consultar",ncm:"83021000"},
      {sku:"10.DOB.AMORT.RET",label:"Dobradiça Com Amortecedor Reta · 35mm",tiers:[{minQty:10,label:"10",price:4.56}, {minQty:50,label:"50",price:4.1}, {minQty:100,label:"100",price:3.74}, {minQty:500,label:"500",price:3.28}],weight:"A consultar",ncm:"83021000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"10.FEC.BATENT",
    slug:"10-fec-batent",
    name:"Fechadura com Batente",
    description:"Fechadura com Batente · 22mm",
    category:"Ferragens",
    subcategory:"Fechaduras",
    brand:"HD",
    supplier:"HD",
    keywords:["fechadura com batente","22mm"],
    variations:[
      {sku:"10.FEC.BATENT.22MM",label:"22mm",tiers:[{minQty:10,label:"10",price:9.24}, {minQty:50,label:"50",price:8.32}, {minQty:100,label:"100",price:7.58}, {minQty:500,label:"500",price:6.65}],weight:"A consultar",ncm:"83013000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"10.PIS.BR",
    slug:"10-pis-br",
    name:"Pistão Fit",
    description:"Pistão Fit · 40N · Branco",
    category:"Ferragens",
    subcategory:"Pistões",
    brand:"HD",
    supplier:"HD",
    keywords:["pistão fit","40n","branco","60n","80n","100n","120n","150n"],
    variations:[
      {sku:"10.PIS.BR.40",label:"40N · Branco",tiers:[{minQty:10,label:"10",price:6.97}, {minQty:50,label:"50",price:6.27}, {minQty:100,label:"100",price:5.72}, {minQty:500,label:"500",price:5.02}],weight:"A consultar",ncm:"83024200"},
      {sku:"10.PIS.BR.60",label:"60N · Branco",tiers:[{minQty:10,label:"10",price:6.86}, {minQty:50,label:"50",price:6.17}, {minQty:100,label:"100",price:5.63}, {minQty:500,label:"500",price:4.94}],weight:"A consultar",ncm:"83024200"},
      {sku:"10.PIS.BR.80",label:"80N · Branco",tiers:[{minQty:10,label:"10",price:6.97}, {minQty:50,label:"50",price:6.27}, {minQty:100,label:"100",price:5.72}, {minQty:500,label:"500",price:5.02}],weight:"A consultar",ncm:"83024200"},
      {sku:"10.PIS.BR.100",label:"100N · Branco",tiers:[{minQty:10,label:"10",price:6.86}, {minQty:50,label:"50",price:6.17}, {minQty:100,label:"100",price:5.63}, {minQty:500,label:"500",price:4.94}],weight:"A consultar",ncm:"83024200"},
      {sku:"10.PIS.BR.120",label:"120N · Branco",tiers:[{minQty:10,label:"10",price:6.97}, {minQty:50,label:"50",price:6.27}, {minQty:100,label:"100",price:5.72}, {minQty:500,label:"500",price:5.02}],weight:"A consultar",ncm:"83024200"},
      {sku:"10.PIS.BR.150",label:"150n · Branco",tiers:[{minQty:10,label:"10",price:7.25}, {minQty:50,label:"50",price:6.53}, {minQty:100,label:"100",price:5.94}, {minQty:500,label:"500",price:5.22}],weight:"A consultar",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"10.PIS.CZ",
    slug:"10-pis-cz",
    name:"Pistão Fit",
    description:"Pistão Fit · 40N · Cinza",
    category:"Ferragens",
    subcategory:"Pistões",
    brand:"HD",
    supplier:"HD",
    keywords:["pistão fit","40n","cinza","60n","80n","100n","120n","150n"],
    variations:[
      {sku:"10.PIS.CZ.40",label:"40N · Cinza",tiers:[{minQty:10,label:"10",price:7.64}, {minQty:50,label:"50",price:6.88}, {minQty:100,label:"100",price:6.26}, {minQty:500,label:"500",price:5.5}],weight:"A consultar",ncm:"83024200"},
      {sku:"10.PIS.CZ.60",label:"60N · Cinza",tiers:[{minQty:10,label:"10",price:7.64}, {minQty:50,label:"50",price:6.88}, {minQty:100,label:"100",price:6.26}, {minQty:500,label:"500",price:5.5}],weight:"A consultar",ncm:"83024200"},
      {sku:"10.PIS.CZ.80",label:"80N · Cinza",tiers:[{minQty:10,label:"10",price:7.25}, {minQty:50,label:"50",price:6.53}, {minQty:100,label:"100",price:5.94}, {minQty:500,label:"500",price:5.22}],weight:"A consultar",ncm:"83024200"},
      {sku:"10.PIS.CZ.100",label:"100N · Cinza",tiers:[{minQty:10,label:"10",price:7.25}, {minQty:50,label:"50",price:6.53}, {minQty:100,label:"100",price:5.94}, {minQty:500,label:"500",price:5.22}],weight:"A consultar",ncm:"83024200"},
      {sku:"10.PIS.CZ.120",label:"120N · Cinza",tiers:[{minQty:10,label:"10",price:7.64}, {minQty:50,label:"50",price:6.88}, {minQty:100,label:"100",price:6.26}, {minQty:500,label:"500",price:5.5}],weight:"A consultar",ncm:"83024200"},
      {sku:"10.PIS.CZ.150",label:"150n · Cinza",tiers:[{minQty:10,label:"10",price:7.25}, {minQty:50,label:"50",price:6.53}, {minQty:100,label:"100",price:5.94}, {minQty:500,label:"500",price:5.22}],weight:"A consultar",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"11.ROD.PIN",
    slug:"11-rod-pin",
    name:"Rodízio",
    description:"Rodízio · SQ65 HGA Preto · Com Capa",
    category:"Ferragens",
    subcategory:"Rodízios",
    brand:"Squadroni",
    supplier:"Squadroni",
    keywords:["rodízio","sq65 hga preto","com capa"],
    variations:[
      {sku:"11.ROD.PIN.SQ65",label:"SQ65 HGA Preto · Com Capa",tiers:[{minQty:10,label:"10",price:21.22}, {minQty:50,label:"50",price:19.1}, {minQty:100,label:"100",price:17.4}, {minQty:500,label:"500",price:15.28}],weight:"A consultar",ncm:"94039900"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"11.ROD.SEMT",
    slug:"11-rod-semt",
    name:"Rodizio",
    description:"Rodizio · 50mm · Sem Trava",
    category:"Ferragens",
    subcategory:"Rodízios",
    brand:"Squadroni",
    supplier:"Squadroni",
    keywords:["rodizio","50mm","sem trava"],
    variations:[
      {sku:"11.ROD.SEMT.50",label:"50mm · Sem Trava",tiers:[{minQty:10,label:"10",price:7.22}, {minQty:50,label:"50",price:6.5}, {minQty:100,label:"100",price:5.92}, {minQty:500,label:"500",price:5.2}],weight:"A consultar",ncm:"83022000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"11.ROD.SEM.PIN",
    slug:"11-rod-sem-pin",
    name:"Rodizio",
    description:"Rodizio · SQ90 · Sem Pino",
    category:"Ferragens",
    subcategory:"Rodízios",
    brand:"Squadroni",
    supplier:"Squadroni",
    keywords:["rodizio","sq90","sem pino"],
    variations:[
      {sku:"11.ROD.SEM.PIN.SQ90",label:"SQ90 · Sem Pino",tiers:[{minQty:10,label:"10",price:7.59}, {minQty:50,label:"50",price:6.83}, {minQty:100,label:"100",price:6.22}, {minQty:500,label:"500",price:5.46}],weight:"A consultar",ncm:"94039900"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"12.BOT",
    slug:"12-bot",
    name:"Botão ON/OFF",
    description:"Botão ON/OFF · 19mm · 3A · Azul",
    category:"Elétrica",
    subcategory:"Botões",
    brand:"Storm",
    supplier:"Storm",
    keywords:["botão on/off","19mm","3a","azul","vermelho","verde","branco"],
    variations:[
      {sku:"12.BOT.AZ",label:"3A · Azul",tiers:[{minQty:10,label:"10",price:32.62}, {minQty:50,label:"50",price:29.36}, {minQty:100,label:"100",price:26.75}, {minQty:500,label:"500",price:23.49}],weight:"A consultar",ncm:"85365090"},
      {sku:"12.BOT.VM",label:"3A · Vermelho",tiers:[{minQty:10,label:"10",price:32.62}, {minQty:50,label:"50",price:29.36}, {minQty:100,label:"100",price:26.75}, {minQty:500,label:"500",price:23.49}],weight:"A consultar",ncm:"85365090"},
      {sku:"12.BOT.VD",label:"3A · Verde",tiers:[{minQty:10,label:"10",price:32.62}, {minQty:50,label:"50",price:29.36}, {minQty:100,label:"100",price:26.75}, {minQty:500,label:"500",price:23.49}],weight:"A consultar",ncm:"85365090"},
      {sku:"12.BOT.BR",label:"3A · Branco",tiers:[{minQty:10,label:"10",price:32.62}, {minQty:50,label:"50",price:29.36}, {minQty:100,label:"100",price:26.75}, {minQty:500,label:"500",price:23.49}],weight:"A consultar",ncm:"85365090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"12.CHIC",
    slug:"12-chic",
    name:"Chicote para Botão ON/OFF 19mm",
    description:"Chicote para Botão ON/OFF 19mm",
    category:"Elétrica",
    subcategory:"Botões",
    brand:"Storm",
    supplier:"Storm",
    keywords:["chicote para botão on/off 19mm"],
    variations:[
      {sku:"12.CHIC.19MM",label:"19MM",tiers:[{minQty:10,label:"10",price:9.1}, {minQty:50,label:"50",price:8.19}, {minQty:100,label:"100",price:7.46}, {minQty:500,label:"500",price:6.55}],weight:"A consultar",ncm:"85444200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"12.CAB.1M.AZ",
    slug:"12-cab-1m-az",
    name:"Cabo Rca",
    description:"Cabo Rca · 1 Metro · Azul · Blindado · 5mm",
    category:"Elétrica",
    subcategory:"Cabos e Fios",
    brand:"Storm",
    supplier:"Storm",
    keywords:["cabo rca","1 metro","azul","blindado","5mm"],
    variations:[
      {sku:"12.CAB.1M.AZ.5MM",label:"Blindado · 5mm",tiers:[{minQty:10,label:"10",price:73.74}, {minQty:50,label:"50",price:66.37}, {minQty:100,label:"100",price:60.47}, {minQty:500,label:"500",price:53.09}],weight:"A consultar",ncm:"85444200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"12.CAB.RED.BR",
    slug:"12-cab-red-br",
    name:"Fixa Cabos",
    description:"Fixa Cabos · Redondo · 5mm · Cento",
    category:"Elétrica",
    subcategory:"Fixação de Cabos",
    brand:"Storm",
    supplier:"Storm",
    keywords:["fixa cabos","redondo","5mm","cento","6mm","7mm","8mm","10mm"],
    variations:[
      {sku:"12.CAB.RED.BR.5MM",label:"5mm · Cento",tiers:[{minQty:10,label:"10",price:5.88}, {minQty:50,label:"50",price:5.29}, {minQty:100,label:"100",price:4.82}, {minQty:500,label:"500",price:4.23}],weight:"A consultar",ncm:"73170090"},
      {sku:"12.CAB.RED.BR.6MM",label:"6mm · Cento",tiers:[{minQty:10,label:"10",price:7.42}, {minQty:50,label:"50",price:6.68}, {minQty:100,label:"100",price:6.08}, {minQty:500,label:"500",price:5.34}],weight:"A consultar",ncm:"73170090"},
      {sku:"12.CAB.RED.BR.7MM",label:"7mm · Cento",tiers:[{minQty:10,label:"10",price:8.12}, {minQty:50,label:"50",price:7.31}, {minQty:100,label:"100",price:6.66}, {minQty:500,label:"500",price:5.85}],weight:"A consultar",ncm:"73170090"},
      {sku:"12.CAB.RED.BR.8MM",label:"8mm · Cento",tiers:[{minQty:10,label:"10",price:9.88}, {minQty:50,label:"50",price:8.89}, {minQty:100,label:"100",price:8.1}, {minQty:500,label:"500",price:7.11}],weight:"A consultar",ncm:"73170090"},
      {sku:"12.CAB.RED.BR.10MM",label:"10mm · Cento",tiers:[{minQty:10,label:"10",price:0.03}, {minQty:50,label:"50",price:0.03}, {minQty:100,label:"100",price:0.02}, {minQty:500,label:"500",price:0.02}],weight:"A consultar",ncm:"73170090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"13.BLT.3",
    slug:"13-blt-3",
    name:"Bucha Bolt |3/16x2.1/2",
    description:"Bucha Bolt |3/16x2.1/2",
    category:"Fixação",
    subcategory:"Buchas",
    brand:"Sfor",
    supplier:"Sfor",
    keywords:["bucha bolt |3/16x2.1/2"],
    variations:[
      {sku:"13.BLT.3.16",label:"16",tiers:[{minQty:10,label:"10",price:7.9}, {minQty:50,label:"50",price:7.11}, {minQty:100,label:"100",price:6.48}, {minQty:500,label:"500",price:5.69}],weight:"A consultar",ncm:"73181500"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"13.BLT.1",
    slug:"13-blt-1",
    name:"Bucha Bolt",
    description:"Bucha Bolt · 1/4X2.1/2",
    category:"Fixação",
    subcategory:"Buchas",
    brand:"Sfor",
    supplier:"Sfor",
    keywords:["bucha bolt","1/4x2.1/2"],
    variations:[
      {sku:"13.BLT.1.4",label:"1/4X2.1/2",tiers:[{minQty:10,label:"10",price:8.12}, {minQty:50,label:"50",price:7.31}, {minQty:100,label:"100",price:6.66}, {minQty:500,label:"500",price:5.85}],weight:"A consultar",ncm:"73181500"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.SUP.BR",
    slug:"14-sup-br",
    name:"Suporte Simples",
    description:"Suporte Simples · Branco · 20cm",
    category:"Ferragens",
    subcategory:"Suportes",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["suporte simples","branco","20cm","25cm","30cm"],
    variations:[
      {sku:"14.SUP.BR.20",label:"Branco · 20cm",tiers:[{minQty:10,label:"10",price:4.75}, {minQty:50,label:"50",price:4.28}, {minQty:100,label:"100",price:3.89}, {minQty:500,label:"500",price:3.42}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.SUP.BR.25",label:"Branco · 25cm",tiers:[{minQty:10,label:"10",price:6.7}, {minQty:50,label:"50",price:6.03}, {minQty:100,label:"100",price:5.49}, {minQty:500,label:"500",price:4.82}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.SUP.BR.30",label:"Branco · 30cm",tiers:[{minQty:10,label:"10",price:7.53}, {minQty:50,label:"50",price:6.78}, {minQty:100,label:"100",price:6.17}, {minQty:500,label:"500",price:5.42}],weight:"A consultar",ncm:"83024900"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.TS.BR",
    slug:"14-ts-br",
    name:"Trilho Simples",
    description:"Trilho Simples · Branco · 50cm",
    category:"Ferragens",
    subcategory:"Trilhos",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["trilho simples","branco","50cm","100cm","150cm","200cm"],
    variations:[
      {sku:"14.TS.BR.50",label:"Branco · 50cm",tiers:[{minQty:10,label:"10",price:11.05}, {minQty:50,label:"50",price:9.95}, {minQty:100,label:"100",price:9.06}, {minQty:500,label:"500",price:7.96}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.TS.BR.100",label:"Branco · 100cm",tiers:[{minQty:10,label:"10",price:20.59}, {minQty:50,label:"50",price:18.53}, {minQty:100,label:"100",price:16.88}, {minQty:500,label:"500",price:14.82}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.TS.BR.150",label:"Branco · 150cm",tiers:[{minQty:10,label:"10",price:30.9}, {minQty:50,label:"50",price:27.81}, {minQty:100,label:"100",price:25.34}, {minQty:500,label:"500",price:22.25}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.TS.BR.200",label:"Branco · 200cm",tiers:[{minQty:10,label:"10",price:32.43}, {minQty:50,label:"50",price:29.19}, {minQty:100,label:"100",price:26.59}, {minQty:500,label:"500",price:23.35}],weight:"A consultar",ncm:"83024900"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.SDS.6",
    slug:"14-sds-6",
    name:"Broca SDS",
    description:"Broca SDS · 6x160 mm",
    category:"Fixação",
    subcategory:"Brocas",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["broca sds","6x160 mm"],
    variations:[
      {sku:"14.SDS.6.160",label:"6x160 mm",tiers:[{minQty:10,label:"10",price:7.85}, {minQty:50,label:"50",price:7.06}, {minQty:100,label:"100",price:6.44}, {minQty:500,label:"500",price:5.65}],weight:"A consultar",ncm:"82075011"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.SDS.8",
    slug:"14-sds-8",
    name:"Broca SDS",
    description:"Broca SDS · 8x160 mm",
    category:"Fixação",
    subcategory:"Brocas",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["broca sds","8x160 mm"],
    variations:[
      {sku:"14.SDS.8.160",label:"8x160 mm",tiers:[{minQty:10,label:"10",price:8.9}, {minQty:50,label:"50",price:8.01}, {minQty:100,label:"100",price:7.3}, {minQty:500,label:"500",price:6.41}],weight:"A consultar",ncm:"82075011"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.SDS.10",
    slug:"14-sds-10",
    name:"Broca SDS",
    description:"Broca SDS · 10x160 mm",
    category:"Fixação",
    subcategory:"Brocas",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["broca sds","10x160 mm"],
    variations:[
      {sku:"14.SDS.10.160",label:"10x160 mm",tiers:[{minQty:10,label:"10",price:7.88}, {minQty:50,label:"50",price:7.09}, {minQty:100,label:"100",price:6.46}, {minQty:500,label:"500",price:5.67}],weight:"A consultar",ncm:"82075011"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.SDS.12",
    slug:"14-sds-12",
    name:"Broca SDS",
    description:"Broca SDS · 12x160 mm",
    category:"Fixação",
    subcategory:"Brocas",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["broca sds","12x160 mm"],
    variations:[
      {sku:"14.SDS.12.160",label:"12x160 mm",tiers:[{minQty:10,label:"10",price:9.8}, {minQty:50,label:"50",price:8.82}, {minQty:100,label:"100",price:8.04}, {minQty:500,label:"500",price:7.06}],weight:"A consultar",ncm:"82075011"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.SDS.14",
    slug:"14-sds-14",
    name:"Broca SDS",
    description:"Broca SDS · 14x160 mm",
    category:"Fixação",
    subcategory:"Brocas",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["broca sds","14x160 mm"],
    variations:[
      {sku:"14.SDS.14.160",label:"14x160 mm",tiers:[{minQty:10,label:"10",price:11.97}, {minQty:50,label:"50",price:10.77}, {minQty:100,label:"100",price:9.82}, {minQty:500,label:"500",price:8.62}],weight:"A consultar",ncm:"82075011"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.MAOF.BR",
    slug:"14-maof-br",
    name:"Mão Francesa Leve",
    description:"Mão Francesa Leve · Branca · 20cm",
    category:"Ferragens",
    subcategory:"Mãos Francesas",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["mão francesa leve","branca","20cm","25cm","30cm","40cm"],
    variations:[
      {sku:"14.MAOF.BR.20",label:"Branca · 20cm",tiers:[{minQty:10,label:"10",price:4.21}, {minQty:50,label:"50",price:3.79}, {minQty:100,label:"100",price:3.45}, {minQty:500,label:"500",price:3.03}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.MAOF.BR.25",label:"Branca · 25cm",tiers:[{minQty:10,label:"10",price:5.28}, {minQty:50,label:"50",price:4.75}, {minQty:100,label:"100",price:4.33}, {minQty:500,label:"500",price:3.8}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.MAOF.BR.30",label:"Branca · 30cm",tiers:[{minQty:10,label:"10",price:6.46}, {minQty:50,label:"50",price:5.81}, {minQty:100,label:"100",price:5.3}, {minQty:500,label:"500",price:4.65}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.MAOF.BR.40",label:"Branca · 40cm",tiers:[{minQty:10,label:"10",price:12.66}, {minQty:50,label:"50",price:11.39}, {minQty:100,label:"100",price:10.38}, {minQty:500,label:"500",price:9.12}],weight:"A consultar",ncm:"83024900"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.MAOF.PT",
    slug:"14-maof-pt",
    name:"Mão Francesa Leve",
    description:"Mão Francesa Leve · Preta · 20cm",
    category:"Ferragens",
    subcategory:"Mãos Francesas",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["mão francesa leve","preta","20cm","25cm","30cm","40cm"],
    variations:[
      {sku:"14.MAOF.PT.20",label:"Preta · 20cm",tiers:[{minQty:10,label:"10",price:4.3}, {minQty:50,label:"50",price:3.87}, {minQty:100,label:"100",price:3.53}, {minQty:500,label:"500",price:3.1}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.MAOF.PT.25",label:"Preta · 25cm",tiers:[{minQty:10,label:"10",price:5.28}, {minQty:50,label:"50",price:4.75}, {minQty:100,label:"100",price:4.33}, {minQty:500,label:"500",price:3.8}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.MAOF.PT.30",label:"Preta · 30cm",tiers:[{minQty:10,label:"10",price:6.58}, {minQty:50,label:"50",price:5.92}, {minQty:100,label:"100",price:5.4}, {minQty:500,label:"500",price:4.74}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.MAOF.PT.40",label:"Preta · 40cm",tiers:[{minQty:10,label:"10",price:12.66}, {minQty:50,label:"50",price:11.39}, {minQty:100,label:"100",price:10.38}, {minQty:500,label:"500",price:9.12}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.DISC.LIX.125",
    slug:"14-disc-lix-125",
    name:"Disco de Lixa Com Furos",
    description:"Disco de Lixa Com Furos · 125mm · Grão 40",
    category:"Abrasivos",
    subcategory:"Discos com Furos",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["disco de lixa com furos","125mm","grão 40","grão 60","grão 80","grão 100","grão 120","grão 150","grão 180","grão 240"],
    variations:[
      {sku:"14.DISC.LIX.125.40",label:"125mm · Grão 40",tiers:[{minQty:10,label:"10",price:1.12}, {minQty:50,label:"50",price:1.01}, {minQty:100,label:"100",price:0.92}, {minQty:500,label:"500",price:0.81}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.DISC.LIX.125.60",label:"125mm · Grão 60",tiers:[{minQty:10,label:"10",price:1.12}, {minQty:50,label:"50",price:1.01}, {minQty:100,label:"100",price:0.92}, {minQty:500,label:"500",price:0.81}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.DISC.LIX.125.80",label:"125mm · Grão 80",tiers:[{minQty:10,label:"10",price:1.12}, {minQty:50,label:"50",price:1.01}, {minQty:100,label:"100",price:0.92}, {minQty:500,label:"500",price:0.81}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.DISC.LIX.125.100",label:"125mm · Grão 100",tiers:[{minQty:10,label:"10",price:1.12}, {minQty:50,label:"50",price:1.01}, {minQty:100,label:"100",price:0.92}, {minQty:500,label:"500",price:0.81}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.DISC.LIX.125.120",label:"125mm · Grão 120",tiers:[{minQty:10,label:"10",price:1.12}, {minQty:50,label:"50",price:1.01}, {minQty:100,label:"100",price:0.92}, {minQty:500,label:"500",price:0.81}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.DISC.LIX.125.150",label:"125mm · Grão 150",tiers:[{minQty:10,label:"10",price:1.12}, {minQty:50,label:"50",price:1.01}, {minQty:100,label:"100",price:0.92}, {minQty:500,label:"500",price:0.81}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.DISC.LIX.125.180",label:"125mm · Grão 180",tiers:[{minQty:10,label:"10",price:1.12}, {minQty:50,label:"50",price:1.01}, {minQty:100,label:"100",price:0.92}, {minQty:500,label:"500",price:0.81}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.DISC.LIX.125.240",label:"125mm · Grão 240",tiers:[{minQty:10,label:"10",price:1.12}, {minQty:50,label:"50",price:1.01}, {minQty:100,label:"100",price:0.92}, {minQty:500,label:"500",price:0.81}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.DISC.LIX.125.320",label:"125mm · Grão 320",tiers:[{minQty:10,label:"10",price:1.12}, {minQty:50,label:"50",price:1.01}, {minQty:100,label:"100",price:0.92}, {minQty:500,label:"500",price:0.81}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.DISC.LIX.125.400",label:"125mm · Grão 400",tiers:[{minQty:10,label:"10",price:1.12}, {minQty:50,label:"50",price:1.01}, {minQty:100,label:"100",price:0.92}, {minQty:500,label:"500",price:0.81}],weight:"A consultar",ncm:"68053020"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.FLAP.115",
    slug:"14-flap-115",
    name:"Disco Flap",
    description:"Disco Flap · 115mm · Grão 40",
    category:"Abrasivos",
    subcategory:"Disco Flap",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["disco flap","115mm","grão 40","grão 60","grão 80","grão 120"],
    variations:[
      {sku:"14.FLAP.115.40",label:"115mm · Grão 40",tiers:[{minQty:10,label:"10",price:7.15}, {minQty:50,label:"50",price:6.44}, {minQty:100,label:"100",price:5.86}, {minQty:500,label:"500",price:5.15}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.FLAP.115.60",label:"115mm · Grão 60",tiers:[{minQty:10,label:"10",price:7.02}, {minQty:50,label:"50",price:6.32}, {minQty:100,label:"100",price:5.76}, {minQty:500,label:"500",price:5.05}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.FLAP.115.80",label:"115mm · Grão 80",tiers:[{minQty:10,label:"10",price:6.88}, {minQty:50,label:"50",price:6.19}, {minQty:100,label:"100",price:5.64}, {minQty:500,label:"500",price:4.95}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.FLAP.115.120",label:"115mm · Grão 120",tiers:[{minQty:10,label:"10",price:6.88}, {minQty:50,label:"50",price:6.19}, {minQty:100,label:"100",price:5.64}, {minQty:500,label:"500",price:4.95}],weight:"A consultar",ncm:"68053020"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.LA",
    slug:"14-la",
    name:"Lâmina para Estilete",
    description:"Lâmina para Estilete · 18mm · 10 Peças",
    category:"Ferramentas",
    subcategory:"Lâminas",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["lâmina para estilete","18mm","10 peças","25mm"],
    variations:[
      {sku:"14.LA.18MM",label:"18mm · 10 Peças",tiers:[{minQty:10,label:"10",price:4.76}, {minQty:50,label:"50",price:4.28}, {minQty:100,label:"100",price:3.9}, {minQty:500,label:"500",price:3.43}],weight:"A consultar",ncm:"82119400"},
      {sku:"14.LA.25MM",label:"25mm · 10 Peças",tiers:[{minQty:10,label:"10",price:13.6}, {minQty:50,label:"50",price:12.24}, {minQty:100,label:"100",price:11.15}, {minQty:500,label:"500",price:9.79}],weight:"A consultar",ncm:"82119400"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.ABRAC.4.8.200",
    slug:"14-abrac-4-8-200",
    name:"Abraçadeira de Nylon",
    description:"Abraçadeira de Nylon · Preta · 4,8 x 200",
    category:"Fixação",
    subcategory:"Abraçadeiras",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["abraçadeira de nylon","preta","4,8 x 200"],
    variations:[
      {sku:"14.ABRAC.4.8.200.PT",label:"Preta · 4,8 x 200",tiers:[{minQty:10,label:"10",price:11.67}, {minQty:50,label:"50",price:10.5}, {minQty:100,label:"100",price:9.57}, {minQty:500,label:"500",price:8.4}],weight:"A consultar",ncm:"39269090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"15.GAN.LV",
    slug:"15-gan-lv",
    name:"Gancho de Rede (Par)",
    description:"Gancho de Rede (Par) · Zincado",
    category:"Fixação",
    subcategory:"Ganchos",
    brand:"São Raphael",
    supplier:"São Raphael",
    keywords:["gancho de rede (par)","zincado"],
    variations:[
      {sku:"15.GAN.LV.ZC",label:"Zincado",tiers:[{minQty:10,label:"10",price:12.1}, {minQty:50,label:"50",price:10.89}, {minQty:100,label:"100",price:9.92}, {minQty:500,label:"500",price:8.71}],weight:"A consultar",ncm:"73269090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"15.GAN.FEC",
    slug:"15-gan-fec",
    name:"Parafuso Gancho",
    description:"Parafuso Gancho · 8mm",
    category:"Fixação",
    subcategory:"Parafusos",
    brand:"São Raphael",
    supplier:"São Raphael",
    keywords:["parafuso gancho","8mm","6mm","5mm"],
    variations:[
      {sku:"15.GAN.FEC.8",label:"8mm",tiers:[{minQty:10,label:"10",price:52.08}, {minQty:50,label:"50",price:46.87}, {minQty:100,label:"100",price:42.71}, {minQty:500,label:"500",price:37.5}],weight:"A consultar",ncm:"73181300"},
      {sku:"15.GAN.FEC.6",label:"6mm",tiers:[{minQty:10,label:"10",price:26.82}, {minQty:50,label:"50",price:24.14}, {minQty:100,label:"100",price:21.99}, {minQty:500,label:"500",price:19.31}],weight:"A consultar",ncm:"73181300"},
      {sku:"15.GAN.FEC.5",label:"5mm",tiers:[{minQty:10,label:"10",price:18.4}, {minQty:50,label:"50",price:16.56}, {minQty:100,label:"100",price:15.09}, {minQty:500,label:"500",price:13.25}],weight:"A consultar",ncm:"73181300"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"15.GAN.S",
    slug:"15-gan-s",
    name:"Gancho em S",
    description:"Gancho em S · 28mm",
    category:"Fixação",
    subcategory:"Ganchos",
    brand:"São Raphael",
    supplier:"São Raphael",
    keywords:["gancho em s","28mm","53mm","63mm"],
    variations:[
      {sku:"15.GAN.S.28",label:"28mm",tiers:[{minQty:10,label:"10",price:0.33}, {minQty:50,label:"50",price:0.3}, {minQty:100,label:"100",price:0.27}, {minQty:500,label:"500",price:0.24}],weight:"A consultar",ncm:"73269090"},
      {sku:"15.GAN.S.53",label:"53mm",tiers:[{minQty:10,label:"10",price:0.91}, {minQty:50,label:"50",price:0.82}, {minQty:100,label:"100",price:0.75}, {minQty:500,label:"500",price:0.66}],weight:"A consultar",ncm:"73269090"},
      {sku:"15.GAN.S.63",label:"63mm",tiers:[{minQty:10,label:"10",price:1.48}, {minQty:50,label:"50",price:1.33}, {minQty:100,label:"100",price:1.21}, {minQty:500,label:"500",price:1.07}],weight:"A consultar",ncm:"73269090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"15.MOSQ",
    slug:"15-mosq",
    name:"Mosquetão Mola",
    description:"Mosquetão Mola · 7 x 70 · 180kgs",
    category:"Fixação",
    subcategory:"Ganchos",
    brand:"São Raphael",
    supplier:"São Raphael",
    keywords:["mosquetão mola","7 x 70","180kgs","8 x 80","230kgs","10 x 100","350kgs"],
    variations:[
      {sku:"15.MOSQ.7X70",label:"7 x 70 · 180kgs",tiers:[{minQty:10,label:"10",price:4.4}, {minQty:50,label:"50",price:3.96}, {minQty:100,label:"100",price:3.61}, {minQty:500,label:"500",price:3.17}],weight:"A consultar",ncm:"73269090"},
      {sku:"15.MOSQ.8X80",label:"8 x 80 · 230kgs",tiers:[{minQty:10,label:"10",price:4.9}, {minQty:50,label:"50",price:4.41}, {minQty:100,label:"100",price:4.02}, {minQty:500,label:"500",price:3.53}],weight:"A consultar",ncm:"73269090"},
      {sku:"15.MOSQ.10X100",label:"10 x 100 · 350kgs",tiers:[{minQty:10,label:"10",price:8.88}, {minQty:50,label:"50",price:7.99}, {minQty:100,label:"100",price:7.28}, {minQty:500,label:"500",price:6.39}],weight:"A consultar",ncm:"73269090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"16.MOLA",
    slug:"16-mola",
    name:"Mola Aerea",
    description:"Mola Aerea · Coimbra · Branca",
    category:"Ferragens",
    subcategory:"Molas Aéreas",
    brand:"Coimbra",
    supplier:"Coimbra",
    keywords:["mola aerea","coimbra","branca","preta","ouro","cinza","zincado"],
    variations:[
      {sku:"16.MOLA.BR",label:"Branca",tiers:[{minQty:10,label:"10",price:110.57}, {minQty:50,label:"50",price:99.51}, {minQty:100,label:"100",price:90.67}, {minQty:500,label:"500",price:79.61}],weight:"A consultar",ncm:"83026000"},
      {sku:"16.MOLA.PT",label:"Preta",tiers:[{minQty:10,label:"10",price:110.57}, {minQty:50,label:"50",price:99.51}, {minQty:100,label:"100",price:90.67}, {minQty:500,label:"500",price:79.61}],weight:"A consultar",ncm:"83026000"},
      {sku:"16.MOLA.OU",label:"Ouro",tiers:[{minQty:10,label:"10",price:110.57}, {minQty:50,label:"50",price:99.51}, {minQty:100,label:"100",price:90.67}, {minQty:500,label:"500",price:79.61}],weight:"A consultar",ncm:"83026000"},
      {sku:"16.MOLA.CZ",label:"Cinza",tiers:[{minQty:10,label:"10",price:110.57}, {minQty:50,label:"50",price:99.51}, {minQty:100,label:"100",price:90.67}, {minQty:500,label:"500",price:79.61}],weight:"A consultar",ncm:"83026000"},
      {sku:"16.MOLA.ZN",label:"Zincado",tiers:[{minQty:10,label:"10",price:110.57}, {minQty:50,label:"50",price:99.51}, {minQty:100,label:"100",price:90.67}, {minQty:500,label:"500",price:79.61}],weight:"A consultar",ncm:"83026000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"18.MF.RET.BR",
    slug:"18-mf-ret-br",
    name:"Mão Francesa Cantoneira",
    description:"Mão Francesa Cantoneira · Dobrável · 20cm",
    category:"Ferragens",
    subcategory:"Mãos Francesas",
    brand:"Idea",
    supplier:"Idea",
    keywords:["mão francesa cantoneira","dobrável","20cm","25cm","30cm","35cm","40cm","45cm"],
    variations:[
      {sku:"18.MF.RET.BR.20",label:"Dobrável · 20cm",tiers:[{minQty:10,label:"10",price:50.74}, {minQty:50,label:"50",price:45.67}, {minQty:100,label:"100",price:41.61}, {minQty:500,label:"500",price:36.53}],weight:"A consultar",ncm:"83024200"},
      {sku:"18.MF.RET.BR.25",label:"Dobrável · 25cm",tiers:[{minQty:10,label:"10",price:61.26}, {minQty:50,label:"50",price:55.13}, {minQty:100,label:"100",price:50.23}, {minQty:500,label:"500",price:44.11}],weight:"A consultar",ncm:"83024200"},
      {sku:"18.MF.RET.BR.30",label:"Dobrável · 30cm",tiers:[{minQty:10,label:"10",price:64.06}, {minQty:50,label:"50",price:57.65}, {minQty:100,label:"100",price:52.53}, {minQty:500,label:"500",price:46.12}],weight:"A consultar",ncm:"83024200"},
      {sku:"18.MF.RET.BR.35",label:"Dobrável · 35cm",tiers:[{minQty:10,label:"10",price:71.76}, {minQty:50,label:"50",price:64.58}, {minQty:100,label:"100",price:58.84}, {minQty:500,label:"500",price:51.67}],weight:"A consultar",ncm:"83024200"},
      {sku:"18.MF.RET.BR.40",label:"Dobrável · 40cm",tiers:[{minQty:10,label:"10",price:76.89}, {minQty:50,label:"50",price:69.2}, {minQty:100,label:"100",price:63.05}, {minQty:500,label:"500",price:55.36}],weight:"A consultar",ncm:"83024200"},
      {sku:"18.MF.RET.BR.45",label:"Dobrável · 45cm",tiers:[{minQty:10,label:"10",price:84.56}, {minQty:50,label:"50",price:76.1}, {minQty:100,label:"100",price:69.34}, {minQty:500,label:"500",price:60.88}],weight:"A consultar",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"19.FEC.ROLET",
    slug:"19-fec-rolet",
    name:"Fecho Rolete",
    description:"Fecho Rolete · Bicromatizado",
    category:"Ferragens",
    subcategory:"Fechos",
    brand:"Máxima",
    supplier:"Máxima",
    keywords:["fecho rolete","bicromatizado","zincado"],
    variations:[
      {sku:"19.FEC.ROLET.DO",label:"Bicromatizado",tiers:[{minQty:10,label:"10",price:2.23}, {minQty:50,label:"50",price:2.01}, {minQty:100,label:"100",price:1.83}, {minQty:500,label:"500",price:1.61}],weight:"A consultar",ncm:"83013000"},
      {sku:"19.FEC.ROLET.PR",label:"Zincado",tiers:[{minQty:10,label:"10",price:2.23}, {minQty:50,label:"50",price:2.01}, {minQty:100,label:"100",price:1.83}, {minQty:500,label:"500",price:1.61}],weight:"A consultar",ncm:"83013000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"19.BATENT",
    slug:"19-batent",
    name:"Batente de Porta",
    description:"Batente de Porta · Cromado · Max 118",
    category:"Ferragens",
    subcategory:"Batentes",
    brand:"Máxima",
    supplier:"Máxima",
    keywords:["batente de porta","cromado","max 118"],
    variations:[
      {sku:"19.BATENT.MAX118",label:"Cromado · Max 118",tiers:[{minQty:10,label:"10",price:39.28}, {minQty:50,label:"50",price:35.35}, {minQty:100,label:"100",price:32.21}, {minQty:500,label:"500",price:28.28}],weight:"A consultar",ncm:"83024100"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"19.TRAV.PIS",
    slug:"19-trav-pis",
    name:"Trava Plástica com Pistão",
    description:"Trava Plástica com Pistão · Branco",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Máxima",
    supplier:"Máxima",
    keywords:["trava plástica com pistão","branco","preto"],
    variations:[
      {sku:"19.TRAV.PIS.BR",label:"Branco",tiers:[{minQty:10,label:"10",price:2.69}, {minQty:50,label:"50",price:2.42}, {minQty:100,label:"100",price:2.21}, {minQty:500,label:"500",price:1.94}],weight:"A consultar",ncm:"83014000"},
      {sku:"19.TRAV.PIS.PT",label:"Preto",tiers:[{minQty:10,label:"10",price:2.69}, {minQty:50,label:"50",price:2.42}, {minQty:100,label:"100",price:2.21}, {minQty:500,label:"500",price:1.94}],weight:"A consultar",ncm:"83014000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"19.TRAV",
    slug:"19-trav",
    name:"Trava Porta",
    description:"Trava Porta · MAX831",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Máxima",
    supplier:"Máxima",
    keywords:["trava porta","max831"],
    variations:[
      {sku:"19.TRAV.PATO",label:"MAX831",tiers:[{minQty:10,label:"10",price:31.78}, {minQty:50,label:"50",price:28.6}, {minQty:100,label:"100",price:26.06}, {minQty:500,label:"500",price:22.88}],weight:"A consultar",ncm:"83024100"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"20.DISC.125.BR",
    slug:"20-disc-125-br",
    name:"Disco de Lixa",
    description:"Disco de Lixa · Pluma · Branco · Grão 40",
    category:"Abrasivos",
    subcategory:"Discos de Lixa",
    brand:"Disflex",
    supplier:"Disflex",
    keywords:["disco de lixa","pluma","branco","grão 40","grão 60","grão 80","grão 100","grão 120","grão 150","grão 180"],
    variations:[
      {sku:"20.DISC.125.BR.40",label:"Branco · Grão 40",tiers:[{minQty:10,label:"10",price:2.11}, {minQty:50,label:"50",price:1.9}, {minQty:100,label:"100",price:1.73}, {minQty:500,label:"500",price:1.52}],weight:"A consultar",ncm:"68053090"},
      {sku:"20.DISC.125.BR.60",label:"Branco · Grão 60",tiers:[{minQty:10,label:"10",price:2.02}, {minQty:50,label:"50",price:1.82}, {minQty:100,label:"100",price:1.66}, {minQty:500,label:"500",price:1.45}],weight:"A consultar",ncm:"68053090"},
      {sku:"20.DISC.125.BR.80",label:"Branco · Grão 80",tiers:[{minQty:10,label:"10",price:2.11}, {minQty:50,label:"50",price:1.9}, {minQty:100,label:"100",price:1.73}, {minQty:500,label:"500",price:1.52}],weight:"A consultar",ncm:"68053090"},
      {sku:"20.DISC.125.BR.100",label:"Branco · Grão 100",tiers:[{minQty:10,label:"10",price:1.98}, {minQty:50,label:"50",price:1.78}, {minQty:100,label:"100",price:1.62}, {minQty:500,label:"500",price:1.43}],weight:"A consultar",ncm:"68053090"},
      {sku:"20.DISC.125.BR.120",label:"Branco · Grão 120",tiers:[{minQty:10,label:"10",price:1.98}, {minQty:50,label:"50",price:1.78}, {minQty:100,label:"100",price:1.62}, {minQty:500,label:"500",price:1.43}],weight:"A consultar",ncm:"68053090"},
      {sku:"20.DISC.125.BR.150",label:"Branco · Grão 150",tiers:[{minQty:10,label:"10",price:2.02}, {minQty:50,label:"50",price:1.82}, {minQty:100,label:"100",price:1.66}, {minQty:500,label:"500",price:1.45}],weight:"A consultar",ncm:"68053090"},
      {sku:"20.DISC.125.BR.180",label:"Branco · Grão 180",tiers:[{minQty:10,label:"10",price:2.02}, {minQty:50,label:"50",price:1.82}, {minQty:100,label:"100",price:1.66}, {minQty:500,label:"500",price:1.45}],weight:"A consultar",ncm:"68053090"},
      {sku:"20.DISC.125.BR.220",label:"Branco · Grão 220",tiers:[{minQty:10,label:"10",price:1.98}, {minQty:50,label:"50",price:1.78}, {minQty:100,label:"100",price:1.62}, {minQty:500,label:"500",price:1.43}],weight:"A consultar",ncm:"68053090"},
      {sku:"20.DISC.125.BR.320",label:"Branco · Grão 320",tiers:[{minQty:10,label:"10",price:1.98}, {minQty:50,label:"50",price:1.78}, {minQty:100,label:"100",price:1.62}, {minQty:500,label:"500",price:1.43}],weight:"A consultar",ncm:"68053090"},
      {sku:"20.DISC.125.BR.400",label:"Branco · Grão 400",tiers:[{minQty:10,label:"10",price:2.08}, {minQty:50,label:"50",price:1.87}, {minQty:100,label:"100",price:1.71}, {minQty:500,label:"500",price:1.5}],weight:"A consultar",ncm:"68053090"},
      {sku:"20.DISC.125.BR.600",label:"Branco · Grão 600",tiers:[{minQty:10,label:"10",price:2.08}, {minQty:50,label:"50",price:1.87}, {minQty:100,label:"100",price:1.71}, {minQty:500,label:"500",price:1.5}],weight:"A consultar",ncm:"68053090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"20.DISC.FLAP.115",
    slug:"20-disc-flap-115",
    name:"Disco Abrasivo Removedor",
    description:"Disco Abrasivo Removedor · Preto · 115mm",
    category:"Abrasivos",
    subcategory:"Discos Especiais",
    brand:"Disflex",
    supplier:"Disflex",
    keywords:["disco abrasivo removedor","preto","115mm"],
    variations:[
      {sku:"20.DISC.FLAP.115.POLIR",label:"Preto · 115mm",tiers:[{minQty:10,label:"10",price:67.62}, {minQty:50,label:"50",price:60.86}, {minQty:100,label:"100",price:55.45}, {minQty:500,label:"500",price:48.69}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"21.PF.3.16",
    slug:"21-pf-3-16",
    name:"Parafuso Soberba 3/16 x 40mm",
    description:"Parafuso Soberba 3/16 x 40mm · Sextavado",
    category:"Fixação",
    subcategory:"Parafusos",
    brand:"Newfix",
    supplier:"Newfix",
    keywords:["parafuso soberba 3/16 x 40mm","sextavado"],
    variations:[
      {sku:"21.PF.3.16.40",label:"Sextavado",tiers:[{minQty:10,label:"10",price:21.81}, {minQty:50,label:"50",price:19.63}, {minQty:100,label:"100",price:17.88}, {minQty:500,label:"500",price:15.7}],weight:"A consultar",ncm:"73181200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"21.PF.3.5",
    slug:"21-pf-3-5",
    name:"Parafuso Minichipboard",
    description:"Parafuso Minichipboard · 3,5 x 14mm",
    category:"Fixação",
    subcategory:"Parafusos",
    brand:"Newfix",
    supplier:"Newfix",
    keywords:["parafuso minichipboard","3,5 x 14mm"],
    variations:[
      {sku:"21.PF.3.5.14",label:"3,5 x 14mm",tiers:[{minQty:10,label:"10",price:4.06}, {minQty:50,label:"50",price:3.65}, {minQty:100,label:"100",price:3.33}, {minQty:500,label:"500",price:2.92}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"21.PF.5.0",
    slug:"21-pf-5-0",
    name:"Parafuso Chipboard",
    description:"Parafuso Chipboard · 5,0 x 40mm",
    category:"Fixação",
    subcategory:"Parafusos",
    brand:"Newfix",
    supplier:"Newfix",
    keywords:["parafuso chipboard","5,0 x 40mm"],
    variations:[
      {sku:"21.PF.5.0.40",label:"5,0 x 40mm",tiers:[{minQty:10,label:"10",price:18.68}, {minQty:50,label:"50",price:16.81}, {minQty:100,label:"100",price:15.32}, {minQty:500,label:"500",price:13.45}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"22.FEC.BATENT",
    slug:"22-fec-batent",
    name:"Fechadura com Batente",
    description:"Fechadura com Batente · 22mm",
    category:"Ferragens",
    subcategory:"Fechaduras",
    brand:"Sim",
    supplier:"Sim",
    keywords:["fechadura com batente","22mm"],
    variations:[
      {sku:"22.FEC.BATENT.22MM",label:"22mm",tiers:[{minQty:10,label:"10",price:8.37}, {minQty:50,label:"50",price:7.53}, {minQty:100,label:"100",price:6.86}, {minQty:500,label:"500",price:6.03}],weight:"A consultar",ncm:"83013000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"23.SUP.INV",
    slug:"23-sup-inv",
    name:"Suporte Invisível",
    description:"Suporte Invisível · 10cm",
    category:"Ferragens",
    subcategory:"Suportes",
    brand:"Duler",
    supplier:"Duler",
    keywords:["suporte invisível","10cm","15cm","20cm","25cm","30cm","35cm","40cm"],
    variations:[
      {sku:"23.SUP.INV.10",label:"10cm",tiers:[{minQty:10,label:"10",price:12.21}, {minQty:50,label:"50",price:10.99}, {minQty:100,label:"100",price:10.01}, {minQty:500,label:"500",price:8.79}],weight:"A consultar",ncm:"94032090"},
      {sku:"23.SUP.INV.15",label:"15cm",tiers:[{minQty:10,label:"10",price:13.24}, {minQty:50,label:"50",price:11.92}, {minQty:100,label:"100",price:10.86}, {minQty:500,label:"500",price:9.53}],weight:"A consultar",ncm:"94032090"},
      {sku:"23.SUP.INV.20",label:"20cm",tiers:[{minQty:10,label:"10",price:14.14}, {minQty:50,label:"50",price:12.73}, {minQty:100,label:"100",price:11.59}, {minQty:500,label:"500",price:10.18}],weight:"A consultar",ncm:"94032090"},
      {sku:"23.SUP.INV.25",label:"25cm",tiers:[{minQty:10,label:"10",price:15.48}, {minQty:50,label:"50",price:13.93}, {minQty:100,label:"100",price:12.69}, {minQty:500,label:"500",price:11.15}],weight:"A consultar",ncm:"94032090"},
      {sku:"23.SUP.INV.30",label:"30cm",tiers:[{minQty:10,label:"10",price:19.01}, {minQty:50,label:"50",price:17.11}, {minQty:100,label:"100",price:15.59}, {minQty:500,label:"500",price:13.69}],weight:"A consultar",ncm:"94032090"},
      {sku:"23.SUP.INV.35",label:"35cm",tiers:[{minQty:10,label:"10",price:22.99}, {minQty:50,label:"50",price:20.69}, {minQty:100,label:"100",price:18.85}, {minQty:500,label:"500",price:16.55}],weight:"A consultar",ncm:"94032090"},
      {sku:"23.SUP.INV.40",label:"40cm",tiers:[{minQty:10,label:"10",price:25.26}, {minQty:50,label:"50",price:22.73}, {minQty:100,label:"100",price:20.71}, {minQty:500,label:"500",price:18.19}],weight:"A consultar",ncm:"94032090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"24.ROD.COMT",
    slug:"24-rod-comt",
    name:"Rodízio",
    description:"Rodízio · Com Trava · 50mm",
    category:"Ferragens",
    subcategory:"Rodízios",
    brand:"FGVTN",
    supplier:"FGVTN",
    keywords:["rodízio","com trava","50mm","35mm"],
    variations:[
      {sku:"24.ROD.COMT.50",label:"Com Trava · 50mm",tiers:[{minQty:10,label:"10",price:9.27}, {minQty:50,label:"50",price:8.34}, {minQty:100,label:"100",price:7.6}, {minQty:500,label:"500",price:6.67}],weight:"A consultar",ncm:"83022000"},
      {sku:"24.ROD.COMT.35",label:"Com Trava · 35mm",tiers:[{minQty:10,label:"10",price:8.23}, {minQty:50,label:"50",price:7.41}, {minQty:100,label:"100",price:6.75}, {minQty:500,label:"500",price:5.93}],weight:"A consultar",ncm:"83022000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"24.ROD.SEMT",
    slug:"24-rod-semt",
    name:"Rodízio",
    description:"Rodízio · Sem Trava · 50mm",
    category:"Ferragens",
    subcategory:"Rodízios",
    brand:"FGVTN",
    supplier:"FGVTN",
    keywords:["rodízio","sem trava","50mm","35mm"],
    variations:[
      {sku:"24.ROD.SEMT.50",label:"Sem Trava · 50mm",tiers:[{minQty:10,label:"10",price:8.99}, {minQty:50,label:"50",price:8.09}, {minQty:100,label:"100",price:7.37}, {minQty:500,label:"500",price:6.47}],weight:"A consultar",ncm:"83022000"},
      {sku:"24.ROD.SEMT.35",label:"Sem Trava · 35mm",tiers:[{minQty:10,label:"10",price:6.3}, {minQty:50,label:"50",price:5.67}, {minQty:100,label:"100",price:5.17}, {minQty:500,label:"500",price:4.54}],weight:"A consultar",ncm:"83022000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"24.DOB.AMORT",
    slug:"24-dob-amort",
    name:"Dobradiça Curva",
    description:"Dobradiça Curva · Com Amortecedor",
    category:"Ferragens",
    subcategory:"Dobradiças",
    brand:"FGVTN",
    supplier:"FGVTN",
    keywords:["dobradiça curva","com amortecedor"],
    variations:[
      {sku:"24.DOB.AMORT.CUR",label:"Com Amortecedor",tiers:[{minQty:10,label:"10",price:3.42}, {minQty:50,label:"50",price:3.08}, {minQty:100,label:"100",price:2.8}, {minQty:500,label:"500",price:2.46}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"25.SUP.BR",
    slug:"25-sup-br",
    name:"Suporte Simples",
    description:"Suporte Simples · 15cm · Branco",
    category:"Ferragens",
    subcategory:"Suportes",
    brand:"Kian",
    supplier:"Kian",
    keywords:["suporte simples","15cm","branco"],
    variations:[
      {sku:"25.SUP.BR.15",label:"15cm · Branco",tiers:[{minQty:10,label:"10",price:5.12}, {minQty:50,label:"50",price:4.61}, {minQty:100,label:"100",price:4.2}, {minQty:500,label:"500",price:3.69}],weight:"A consultar",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"25.SUP.PT",
    slug:"25-sup-pt",
    name:"Suporte Simples",
    description:"Suporte Simples · 15cm · Preto",
    category:"Ferragens",
    subcategory:"Suportes",
    brand:"Kian",
    supplier:"Kian",
    keywords:["suporte simples","15cm","preto","20cm","25cm"],
    variations:[
      {sku:"25.SUP.PT.15",label:"15cm · Preto",tiers:[{minQty:10,label:"10",price:5.12}, {minQty:50,label:"50",price:4.61}, {minQty:100,label:"100",price:4.2}, {minQty:500,label:"500",price:3.69}],weight:"A consultar",ncm:"83024200"},
      {sku:"25.SUP.PT.20",label:"20cm · Preto",tiers:[{minQty:10,label:"10",price:6.02}, {minQty:50,label:"50",price:5.42}, {minQty:100,label:"100",price:4.94}, {minQty:500,label:"500",price:4.33}],weight:"A consultar",ncm:"83024200"},
      {sku:"25.SUP.PT.25",label:"25cm · Preto",tiers:[{minQty:10,label:"10",price:7.11}, {minQty:50,label:"50",price:6.4}, {minQty:100,label:"100",price:5.83}, {minQty:500,label:"500",price:5.12}],weight:"A consultar",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"25.TS.100",
    slug:"25-ts-100",
    name:"Trilho Simples",
    description:"Trilho Simples · 100cm · Preto",
    category:"Ferragens",
    subcategory:"Trilhos",
    brand:"Kian",
    supplier:"Kian",
    keywords:["trilho simples","100cm","preto"],
    variations:[
      {sku:"25.TS.100.PT",label:"100cm · Preto",tiers:[{minQty:10,label:"10",price:19.44}, {minQty:50,label:"50",price:17.5}, {minQty:100,label:"100",price:15.94}, {minQty:500,label:"500",price:14.0}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"26.CAB",
    slug:"26-cab",
    name:"Cabeça de Parafuso",
    description:"Cabeça de Parafuso · Veipar",
    category:"Fixação",
    subcategory:"Parafusos",
    brand:"Veipar",
    supplier:"Veipar",
    keywords:["cabeça de parafuso","veipar"],
    variations:[
      {sku:"26.CAB.PARAF",label:"PARAF",tiers:[{minQty:10,label:"10",price:1.32}, {minQty:50,label:"50",price:1.19}, {minQty:100,label:"100",price:1.08}, {minQty:500,label:"500",price:0.95}],weight:"A consultar",ncm:"79070010"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"27.COLA.CONT",
    slug:"27-cola-cont",
    name:"Cola de Contato",
    description:"Cola de Contato · 750g",
    category:"Fixação",
    subcategory:"Colas",
    brand:"Tekbond",
    supplier:"Tekbond",
    keywords:["cola de contato","750g"],
    variations:[
      {sku:"27.COLA.CONT.750G",label:"750g",tiers:[{minQty:10,label:"10",price:27.97}, {minQty:50,label:"50",price:25.17}, {minQty:100,label:"100",price:22.94}, {minQty:500,label:"500",price:20.14}],weight:"A consultar",ncm:"35069110"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"27.COLA.MOV",
    slug:"27-cola-mov",
    name:"Cola Instantânea",
    description:"Cola Instantânea · Moveleiro · 100g",
    category:"Fixação",
    subcategory:"Colas",
    brand:"Tekbond",
    supplier:"Tekbond",
    keywords:["cola instantânea","moveleiro","100g"],
    variations:[
      {sku:"27.COLA.MOV.100G",label:"Moveleiro · 100g",tiers:[{minQty:10,label:"10",price:26.18}, {minQty:50,label:"50",price:23.56}, {minQty:100,label:"100",price:21.47}, {minQty:500,label:"500",price:18.85}],weight:"A consultar",ncm:"35061010"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"27.COLA793",
    slug:"27-cola793",
    name:"Cola instantânea",
    description:"Cola instantânea · 793 · 100g",
    category:"Fixação",
    subcategory:"Colas",
    brand:"Tekbond",
    supplier:"Tekbond",
    keywords:["cola instantânea","793","100g"],
    variations:[
      {sku:"27.COLA793.100G",label:"793 · 100g",tiers:[{minQty:10,label:"10",price:54.6}, {minQty:50,label:"50",price:49.14}, {minQty:100,label:"100",price:44.77}, {minQty:500,label:"500",price:39.31}],weight:"A consultar",ncm:"35061010"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"28.DISJ.2P",
    slug:"28-disj-2p",
    name:"Mini Disjuntor",
    description:"Mini Disjuntor · 2 Polos · 6A",
    category:"Elétrica",
    subcategory:"Disjuntores",
    brand:"Elgin",
    supplier:"Elgin",
    keywords:["mini disjuntor","2 polos","6a","10a","16a","20a","25a","32a","40a","50a"],
    variations:[
      {sku:"28.DISJ.2P.6A",label:"2 Polos · 6A",tiers:[{minQty:10,label:"10",price:34.97}, {minQty:50,label:"50",price:31.47}, {minQty:100,label:"100",price:28.68}, {minQty:500,label:"500",price:25.18}],weight:"A consultar",ncm:"85362000"},
      {sku:"28.DISJ.2P.10A",label:"2 Polos · 10A",tiers:[{minQty:10,label:"10",price:32.84}, {minQty:50,label:"50",price:29.56}, {minQty:100,label:"100",price:26.93}, {minQty:500,label:"500",price:23.64}],weight:"A consultar",ncm:"85362000"},
      {sku:"28.DISJ.2P.16A",label:"2 Polos · 16A",tiers:[{minQty:10,label:"10",price:32.84}, {minQty:50,label:"50",price:29.56}, {minQty:100,label:"100",price:26.93}, {minQty:500,label:"500",price:23.64}],weight:"A consultar",ncm:"85362000"},
      {sku:"28.DISJ.2P.20A",label:"2 Polos · 20A",tiers:[{minQty:10,label:"10",price:32.84}, {minQty:50,label:"50",price:29.56}, {minQty:100,label:"100",price:26.93}, {minQty:500,label:"500",price:23.64}],weight:"A consultar",ncm:"85362000"},
      {sku:"28.DISJ.2P.25A",label:"2 Polos · 25A",tiers:[{minQty:10,label:"10",price:32.84}, {minQty:50,label:"50",price:29.56}, {minQty:100,label:"100",price:26.93}, {minQty:500,label:"500",price:23.64}],weight:"A consultar",ncm:"85362000"},
      {sku:"28.DISJ.2P.32A",label:"2 Polos · 32A",tiers:[{minQty:10,label:"10",price:34.97}, {minQty:50,label:"50",price:31.47}, {minQty:100,label:"100",price:28.68}, {minQty:500,label:"500",price:25.18}],weight:"A consultar",ncm:"85362000"},
      {sku:"28.DISJ.2P.40A",label:"2 Polos · 40A",tiers:[{minQty:10,label:"10",price:34.27}, {minQty:50,label:"50",price:30.84}, {minQty:100,label:"100",price:28.1}, {minQty:500,label:"500",price:24.67}],weight:"A consultar",ncm:"85362000"},
      {sku:"28.DISJ.2P.50A",label:"2 Polos · 50A",tiers:[{minQty:10,label:"10",price:34.27}, {minQty:50,label:"50",price:30.84}, {minQty:100,label:"100",price:28.1}, {minQty:500,label:"500",price:24.67}],weight:"A consultar",ncm:"85362000"},
      {sku:"28.DISJ.2P.63A",label:"2 Polos · 63A",tiers:[{minQty:10,label:"10",price:34.27}, {minQty:50,label:"50",price:30.84}, {minQty:100,label:"100",price:28.1}, {minQty:500,label:"500",price:24.67}],weight:"A consultar",ncm:"85362000"},
      {sku:"28.DISJ.2P.MIX",label:"Bipolar · MIX",tiers:[{minQty:10,label:"10",price:34.41}, {minQty:50,label:"50",price:30.97}, {minQty:100,label:"100",price:28.22}, {minQty:500,label:"500",price:24.78}],weight:"A consultar",ncm:"85362000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"29.ROD.SEMT",
    slug:"29-rod-semt",
    name:"Rodízio MN",
    description:"Rodízio MN · Sem Freio · 35mm",
    category:"Ferragens",
    subcategory:"Rodízios",
    brand:"Metalnox",
    supplier:"Metalnox",
    keywords:["rodízio mn","sem freio","35mm","50mm"],
    variations:[
      {sku:"29.ROD.SEMT.35",label:"Sem Freio · 35mm",tiers:[{minQty:10,label:"10",price:5.43}, {minQty:50,label:"50",price:4.89}, {minQty:100,label:"100",price:4.45}, {minQty:500,label:"500",price:3.91}],weight:"A consultar",ncm:"83022000"},
      {sku:"29.ROD.SEMT.50",label:"Sem Freio · 50mm",tiers:[{minQty:10,label:"10",price:5.82}, {minQty:50,label:"50",price:5.24}, {minQty:100,label:"100",price:4.77}, {minQty:500,label:"500",price:4.19}],weight:"A consultar",ncm:"83022000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"29.ROD.COMT",
    slug:"29-rod-comt",
    name:"Rodízio MN",
    description:"Rodízio MN · Com Freio · 35mm",
    category:"Ferragens",
    subcategory:"Rodízios",
    brand:"Metalnox",
    supplier:"Metalnox",
    keywords:["rodízio mn","com freio","35mm","50mm"],
    variations:[
      {sku:"29.ROD.COMT.35",label:"Com Freio · 35mm",tiers:[{minQty:10,label:"10",price:6.72}, {minQty:50,label:"50",price:6.05}, {minQty:100,label:"100",price:5.51}, {minQty:500,label:"500",price:4.84}],weight:"A consultar",ncm:"83022000"},
      {sku:"29.ROD.COMT.50",label:"Com Freio · 50mm",tiers:[{minQty:10,label:"10",price:7.5}, {minQty:50,label:"50",price:6.75}, {minQty:100,label:"100",price:6.15}, {minQty:500,label:"500",price:5.4}],weight:"A consultar",ncm:"83022000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"29.FEC.BATENT",
    slug:"29-fec-batent",
    name:"Fechadura 17 x 22mm",
    description:"Fechadura 17 x 22mm · Com Batente",
    category:"Ferragens",
    subcategory:"Fechaduras",
    brand:"Metalnox",
    supplier:"Metalnox",
    keywords:["fechadura 17 x 22mm","com batente","fechadura 17 x 31mm"],
    variations:[
      {sku:"29.FEC.BATENT.22MM",label:"Com Batente",tiers:[{minQty:10,label:"10",price:6.47}, {minQty:50,label:"50",price:5.82}, {minQty:100,label:"100",price:5.31}, {minQty:500,label:"500",price:4.66}],weight:"A consultar",ncm:"83013000"},
      {sku:"29.FEC.BATENT.31MM",label:"Fechadura 17 x 31mm · Com Batente",tiers:[{minQty:10,label:"10",price:7.76}, {minQty:50,label:"50",price:6.98}, {minQty:100,label:"100",price:6.36}, {minQty:500,label:"500",price:5.59}],weight:"A consultar",ncm:"83013000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"29.PF.3.5",
    slug:"29-pf-3-5",
    name:"Parafuso MiniChipboard",
    description:"Parafuso MiniChipboard · 3,5 x 14mm",
    category:"Fixação",
    subcategory:"Parafusos",
    brand:"Metalnox",
    supplier:"Metalnox",
    keywords:["parafuso minichipboard","3,5 x 14mm"],
    variations:[
      {sku:"29.PF.3.5.14",label:"3,5 x 14mm",tiers:[{minQty:10,label:"10",price:2.58}, {minQty:50,label:"50",price:2.32}, {minQty:100,label:"100",price:2.12}, {minQty:500,label:"500",price:1.86}],weight:"A consultar",ncm:"73181200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"29.PF.4.5",
    slug:"29-pf-4-5",
    name:"Parafuso Chipboard",
    description:"Parafuso Chipboard · 4,5 x 50mm",
    category:"Fixação",
    subcategory:"Parafusos",
    brand:"Metalnox",
    supplier:"Metalnox",
    keywords:["parafuso chipboard","4,5 x 50mm"],
    variations:[
      {sku:"29.PF.4.5.50",label:"4,5 x 50mm",tiers:[{minQty:10,label:"10",price:11.17}, {minQty:50,label:"50",price:10.05}, {minQty:100,label:"100",price:9.16}, {minQty:500,label:"500",price:8.04}],weight:"A consultar",ncm:"73181200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"29.PF.5.0",
    slug:"29-pf-5-0",
    name:"Parafuso Chipboard",
    description:"Parafuso Chipboard · 5.0 x 35mm",
    category:"Fixação",
    subcategory:"Parafusos",
    brand:"Metalnox",
    supplier:"Metalnox",
    keywords:["parafuso chipboard","5.0 x 35mm"],
    variations:[
      {sku:"29.PF.5.0.35",label:"5.0 x 35mm",tiers:[{minQty:10,label:"10",price:10.36}, {minQty:50,label:"50",price:9.32}, {minQty:100,label:"100",price:8.5}, {minQty:500,label:"500",price:7.46}],weight:"A consultar",ncm:"73181200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.TRAV",
    slug:"ch-trav",
    name:"Trava Porta Inox",
    description:"Trava Porta Inox · Grape Tools · Pato",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["trava porta inox","grape tools","pato"],
    variations:[
      {sku:"CH.TRAV.PATO",label:"Pato",tiers:[{minQty:10,label:"10",price:14.17}, {minQty:50,label:"50",price:12.75}, {minQty:100,label:"100",price:11.62}, {minQty:500,label:"500",price:10.2}],weight:"120g",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"10.ROD.COMT",
    slug:"10-rod-comt",
    name:"Rodízio",
    description:"Rodízio · Com trava · 35mm",
    category:"Ferragens",
    subcategory:"Rodízios",
    brand:"HD",
    supplier:"HD",
    keywords:["rodízio","com trava","35mm","50mm"],
    variations:[
      {sku:"10.ROD.COMT.35",label:"Com trava · 35mm",tiers:[{minQty:10,label:"10",price:8.88}, {minQty:50,label:"50",price:7.99}, {minQty:100,label:"100",price:7.28}, {minQty:500,label:"500",price:6.39}],weight:"A consultar",ncm:"83022000"},
      {sku:"10.ROD.COMT.50",label:"Com trava · 50mm",tiers:[{minQty:10,label:"10",price:9.83}, {minQty:50,label:"50",price:8.85}, {minQty:100,label:"100",price:8.06}, {minQty:500,label:"500",price:7.08}],weight:"A consultar",ncm:"83022000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"10.ROD.SEMT",
    slug:"10-rod-semt",
    name:"Rodízio",
    description:"Rodízio · Sem trava · 35mm",
    category:"Ferragens",
    subcategory:"Rodízios",
    brand:"HD",
    supplier:"HD",
    keywords:["rodízio","sem trava","35mm","50mm"],
    variations:[
      {sku:"10.ROD.SEMT.35",label:"Sem trava · 35mm",tiers:[{minQty:10,label:"10",price:6.86}, {minQty:50,label:"50",price:6.17}, {minQty:100,label:"100",price:5.63}, {minQty:500,label:"500",price:4.94}],weight:"A consultar",ncm:"83022000"},
      {sku:"10.ROD.SEMT.50",label:"Sem trava · 50mm",tiers:[{minQty:10,label:"10",price:7.98}, {minQty:50,label:"50",price:7.18}, {minQty:100,label:"100",price:6.54}, {minQty:500,label:"500",price:5.75}],weight:"A consultar",ncm:"83022000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"0",
    slug:"0",
    name:"Personalizado",
    description:"Personalizado",
    category:"Outros",
    subcategory:"Personalizado",
    brand:"",
    supplier:"Grape Tools",
    keywords:["personalizado"],
    variations:[
      {sku:"0",label:"0",tiers:[{minQty:10,label:"10",price:2.8}, {minQty:50,label:"50",price:2.52}, {minQty:100,label:"100",price:2.3}, {minQty:500,label:"500",price:2.02}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"30.BUCHA.C",
    slug:"30-bucha-c",
    name:"Bucha",
    description:"Bucha · 8mm · Comum · USAF · 1000 Peças",
    category:"Fixação",
    subcategory:"Buchas",
    brand:"USAF",
    supplier:"USAF",
    keywords:["bucha","8mm","comum","usaf","1000 peças"],
    variations:[
      {sku:"30.BUCHA.C.8_PCT",label:"Comum · 1000 Peças",tiers:[{minQty:10,label:"10",price:38.64}, {minQty:50,label:"50",price:34.78}, {minQty:100,label:"100",price:31.68}, {minQty:500,label:"500",price:27.82}],weight:"A consultar",ncm:"39259090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"29.PE.QUAD.REG",
    slug:"29-pe-quad-reg",
    name:"Pé Móveis",
    description:"Pé Móveis · Quadrado · Regulagem de Altura · Cromado · 10cm",
    category:"Ferragens",
    subcategory:"Pés de Móveis",
    brand:"Metalnox",
    supplier:"Metalnox",
    keywords:["pé móveis","quadrado","regulagem de altura","cromado","10cm","15cm","20cm"],
    variations:[
      {sku:"29.PE.QUAD.REG.10",label:"Cromado · 10cm",tiers:[{minQty:10,label:"10",price:6.5}, {minQty:50,label:"50",price:5.85}, {minQty:100,label:"100",price:5.33}, {minQty:500,label:"500",price:4.68}],weight:"A consultar",ncm:"83024200"},
      {sku:"29.PE.QUAD.REG.15",label:"Cromado · 15cm",tiers:[{minQty:10,label:"10",price:8.93}, {minQty:50,label:"50",price:8.04}, {minQty:100,label:"100",price:7.32}, {minQty:500,label:"500",price:6.43}],weight:"A consultar",ncm:"83024200"},
      {sku:"29.PE.QUAD.REG.20",label:"Cromado · 20cm",tiers:[{minQty:10,label:"10",price:9.74}, {minQty:50,label:"50",price:8.77}, {minQty:100,label:"100",price:7.99}, {minQty:500,label:"500",price:7.01}],weight:"A consultar",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"4.MOLA",
    slug:"4-mola",
    name:"Mola Aérea",
    description:"Mola Aérea · Ouro",
    category:"Ferragens",
    subcategory:"Molas Aéreas",
    brand:"Starfer",
    supplier:"Starfer",
    keywords:["mola aérea","ouro","prata"],
    variations:[
      {sku:"4.MOLA.OU",label:"Ouro",tiers:[{minQty:10,label:"10",price:113.65}, {minQty:50,label:"50",price:102.29}, {minQty:100,label:"100",price:93.19}, {minQty:500,label:"500",price:81.83}],weight:"A consultar",ncm:"83026000"},
      {sku:"4.MOLA.PR",label:"Prata",tiers:[{minQty:10,label:"10",price:113.65}, {minQty:50,label:"50",price:102.29}, {minQty:100,label:"100",price:93.19}, {minQty:500,label:"500",price:81.83}],weight:"A consultar",ncm:"83026000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"0.KIT.PF.BUC",
    slug:"0-kit-pf-buc",
    name:"Kit mão Francesa (Unitário)",
    description:"Kit mão Francesa (Unitário)",
    category:"Ferragens",
    subcategory:"Mãos Francesas",
    brand:"",
    supplier:"Grape Tools",
    keywords:["kit mão francesa (unitário)"],
    variations:[
      {sku:"0.KIT.PF.BUC.MF",label:"MF",tiers:[{minQty:10,label:"10",price:0.28}, {minQty:50,label:"50",price:0.25}, {minQty:100,label:"100",price:0.23}, {minQty:500,label:"500",price:0.2}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
];

export const categories: string[] = ["Abrasivos", "Elétrica", "Ferragens", "Ferramentas", "Fixação", "Outros", "Utilidades"];
export const suppliers: string[] = ["Cobrirel", "Coimbra", "Disflex", "Duler", "Elgin", "FGVTN", "Fertak", "Grape Tools", "HD", "Idea", "Ivplast", "Jomarca", "Kian", "Metalnox", "Máxima", "Newfix", "Papaiz", "RCA", "Renna", "Sfor", "Sim", "Squadroni", "Starfer", "Storm", "São Raphael", "Tekbond", "Termogel", "USAF", "Utimix", "Veipar"];
export const brands: string[] = ["", "Cobrirel", "Coimbra", "Disflex", "Duler", "Elgin", "FGVTN", "Fertak", "Grape Tools", "HD", "Idea", "Ivplast", "Jomarca", "Kian", "Metalnox", "Máxima", "Newfix", "Papaiz", "RCA", "Renna", "Sfor", "Sim", "Squadroni", "Starfer", "Storm", "São Raphael", "Tekbond", "Termogel", "USAF", "Utimix", "Veipar"];
export const partnerBrands: string[] = ["Cobrirel", "Coimbra", "Disflex", "Duler", "Elgin", "FGVTN", "Fertak", "Grape Tools", "HD", "Idea", "Ivplast"];
export const adminModules: string[] = ["Produtos","Pedidos","Clientes","Estoque","Financeiro","Relatórios"];